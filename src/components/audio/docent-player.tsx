"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALE_NAMES } from "@/components/layout/language-switcher";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { routing, type Locale } from "@/i18n/routing";
import type { EventType } from "@/lib/analytics/events";
import { track, type TrackInput } from "@/lib/analytics/track";

export type PlayerTrack = {
  id: string;
  title: string;
  durationSec: number;
  /** locale별 재생 URL (없는 locale은 서버에서 ko로 채워서 넘긴다) */
  src: Record<Locale, string>;
};

const SPEEDS = [1, 1.25, 1.5, 0.75] as const;
const MILESTONES = [25, 50, 75, 100] as const;

/**
 * F-04 AI 음성 도슨트 플레이어 (브랜드 키트 04 — 이 서비스의 핵심 컴포넌트)
 * - 정지 상태: 먹 테두리형 버튼. 재생 중일 때만 청자 깊은색이 나타난다.
 * - 자동재생에 의존하지 않는다 (재생 버튼 항상 노출, QR 진입 시 안내)
 * - preload="metadata": 재생 전에는 오디오 본문을 받지 않는다
 * - 카드가 화면 밖으로 나가면 CTA 바 위에 미니 플레이어로 이어서 제어
 */
export function DocentPlayer({
  tracks,
  artisanId,
  artisanName,
}: {
  tracks: PlayerTrack[];
  artisanId: string;
  artisanName: string;
}) {
  const t = useTranslations("docent");
  const pageLocale = useLocale() as Locale;

  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const reported = useRef(new Set<string>());

  const [index, setIndex] = useState(0);
  const [docentLocale, setDocentLocale] = useState<Locale>(pageLocale);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(tracks[0]?.durationSec ?? 0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const fromQr = useSyncExternalStore(noopSubscribe, isQrEntry, () => false);
  const [prevPageLocale, setPrevPageLocale] = useState(pageLocale);
  const [cardVisible, setCardVisible] = useState(true);
  const [langOpen, setLangOpen] = useState(false);

  const current = tracks[index];

  // 페이지 언어를 바꾸면 도슨트 언어도 따라간다
  if (prevPageLocale !== pageLocale) {
    setPrevPageLocale(pageLocale);
    setDocentLocale(pageLocale);
  }

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCardVisible(e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed, index, docentLocale]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: artisanName,
      album: "A.OULL AI DOCENT",
    });
  }, [current, artisanName]);

  // ── 행동 데이터 (docs/features.md §2-2) ─────────────────────────
  const listened = useRef(0); // 현재 트랙·언어에서 실제로 들은 누적 시간(초)
  const lastPos = useRef(0);
  const playingRef = useRef(false);
  const dragFrom = useRef<number | null>(null);

  const emit = useCallback(
    (type: EventType, extra: TrackInput = {}) => {
      if (!current) return;
      track(type, {
        artisan: artisanId,
        track: current.id,
        locale: docentLocale,
        position: round(audioRef.current?.currentTime ?? 0),
        listened: round(listened.current),
        ...extra,
      });
    },
    [artisanId, current, docentLocale],
  );

  // 재생 중에 페이지를 떠나면(탭 닫기·다른 페이지 이동) 이탈로 기록한다.
  // 화면만 꺼진 경우(백그라운드 재생)는 이탈이 아니므로 visibilitychange는 쓰지 않는다.
  const emitRef = useRef(emit);
  useEffect(() => {
    emitRef.current = emit;
  }, [emit]);
  useEffect(() => {
    const onLeave = () => {
      if (playingRef.current) emitRef.current("docent_abandon");
    };
    window.addEventListener("pagehide", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      onLeave();
    };
  }, []);

  const resetListening = () => {
    listened.current = 0;
    lastPos.current = 0;
    reported.current.clear();
  };

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        emit("docent_play");
      } catch {
        // 브라우저가 재생을 막은 경우: 다시 탭하면 된다
      }
    } else {
      a.pause();
      emit("docent_pause");
    }
  };

  const seekTo = (to: number) => {
    const a = audioRef.current;
    if (!a) return;
    const from = a.currentTime;
    a.currentTime = Math.max(0, Math.min(a.duration || duration, to));
    lastPos.current = a.currentTime;
    setTime(a.currentTime);
    emit("docent_seek", { props: { from: round(from) } });
  };

  const playAfterSwitch = (shouldPlay: boolean) =>
    requestAnimationFrame(() => {
      if (shouldPlay) audioRef.current?.play().catch(() => {});
    });

  const selectTrack = (i: number) => {
    if (playingRef.current) emit("docent_pause");
    resetListening();
    setIndex(i);
    setTime(0);
    playAfterSwitch(true);
  };

  const changeLocale = (l: Locale) => {
    if (l === docentLocale) return;
    const wasPlaying = playing;
    emit("docent_locale", { props: { from: docentLocale, to: l } });
    resetListening();
    setDocentLocale(l);
    setTime(0);
    playAfterSwitch(wasPlaying);
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !current) return;
    const now = a.currentTime;
    const delta = now - lastPos.current;
    if (playingRef.current && delta > 0 && delta < 1.5) listened.current += delta;
    lastPos.current = now;
    setTime(now);

    const pct = (now / (a.duration || duration)) * 100;
    for (const m of MILESTONES) {
      const key = `${current.id}:${docentLocale}:${m}`;
      if (pct >= m - 0.5 && !reported.current.has(key)) {
        reported.current.add(key);
        if (m === 100) emit("docent_complete", { progress: 100 });
        else emit("docent_progress", { progress: m });
      }
    }
  };

  const onEnded = () => {
    playingRef.current = false;
    setPlaying(false);
    if (index < tracks.length - 1) selectTrack(index + 1);
  };

  if (!current) return null;
  const progress = duration ? Math.min(100, (time / duration) * 100) : 0;
  const showMini = !cardVisible && (playing || time > 0);

  return (
    <>
      <section
        ref={cardRef}
        aria-label="AI Docent"
        className="flex flex-col gap-3.5 rounded-card bg-hanji p-4"
      >
        <audio
          ref={audioRef}
          src={current.src[docentLocale]}
          preload="metadata"
          onPlay={() => {
            playingRef.current = true;
            setPlaying(true);
          }}
          onPause={() => {
            playingRef.current = false;
            setPlaying(false);
          }}
          onLoadedMetadata={(e) =>
            setDuration(e.currentTarget.duration || current.durationSec)
          }
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />

        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-cheongja-deep" aria-hidden />
          <span className="text-[11px] font-bold tracking-[0.18em] text-cheongja-deep">
            AI DOCENT
          </span>
          <span className="ml-auto text-[11px] text-mukhoe">{t("voiceSource")}</span>
        </div>

        {fromQr && !playing && time === 0 && (
          <p className="text-caption text-nambit">
            <strong className="font-bold">{t("qrWelcome")}</strong> — {t("qrWelcomeBody")}
          </p>
        )}

        <div className="flex items-center gap-3.5">
          <PlayButton
            playing={playing}
            onClick={toggle}
            label={playing ? t("pause") : t("play")}
            size={52}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="truncate font-serif text-[15px] font-semibold">
              {current.title}
            </p>
            <Progress
              value={time}
              max={duration || 1}
              progress={progress}
              onChange={(v) => {
                if (!audioRef.current) return;
                dragFrom.current ??= audioRef.current.currentTime;
                audioRef.current.currentTime = v;
                lastPos.current = v;
                setTime(v);
              }}
              onCommit={() => {
                if (dragFrom.current === null) return;
                emit("docent_seek", { props: { from: round(dragFrom.current) } });
                dragFrom.current = null;
              }}
            />
            <div className="flex justify-between font-en text-sm tracking-[0.04em] text-mukhoe lining-nums tabular-nums">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-jae pt-3">
          <div className="flex items-center">
            <TextButton
              label={t("back10")}
              onClick={() => seekTo((audioRef.current?.currentTime ?? 0) - 10)}
            >
              −10
            </TextButton>
            <TextButton
              label={t("forward10")}
              onClick={() => seekTo((audioRef.current?.currentTime ?? 0) + 10)}
            >
              +10
            </TextButton>
            <TextButton
              label={t("speed")}
              onClick={() =>
                setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])
              }
            >
              {speed}×
            </TextButton>
          </div>
          <button
            type="button"
            onClick={() => setLangOpen(true)}
            aria-label={`${t("language")}: ${LOCALE_NAMES[docentLocale]}`}
            className="tap flex h-11 items-center gap-1.5 rounded-btn border border-meok px-3 text-sm font-bold"
          >
            <Globe size={16} strokeWidth={1.6} aria-hidden />
            {LOCALE_NAMES[docentLocale]}
            <ChevronDown size={16} strokeWidth={1.6} aria-hidden />
          </button>
        </div>

        {tracks.length > 1 && (
          <ol aria-label={t("trackList")} className="border-t border-jae">
            {tracks.map((tr, i) => {
              const active = i === index;
              return (
                <li key={tr.id}>
                  <button
                    type="button"
                    onClick={() => selectTrack(i)}
                    aria-current={active ? "true" : undefined}
                    className="flex min-h-12 w-full items-center gap-3 border-b border-jae text-left last:border-b-0"
                  >
                    <span
                      className={`w-6 font-en text-base lining-nums tabular-nums ${
                        active && playing ? "text-cheongja-deep" : "text-mukhoe"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 truncate text-body ${active ? "font-bold" : ""}`}
                    >
                      {tr.title}
                    </span>
                    <span className="font-en text-sm text-mukhoe lining-nums tabular-nums">
                      {fmt(tr.durationSec)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}

        <p className="text-[11px] text-mukhoe">※ {t("aiVoice")}</p>
      </section>

      <BottomSheet
        open={langOpen}
        onClose={() => setLangOpen(false)}
        title={t("languageSheet")}
        closeLabel={t("close")}
      >
        <ul role="radiogroup" aria-label={t("language")}>
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="radio"
                aria-checked={l === docentLocale}
                lang={l}
                onClick={() => {
                  setLangOpen(false);
                  changeLocale(l);
                }}
                className="tap-row flex min-h-14 w-full items-center justify-between border-b border-jae text-left text-body-l"
              >
                <span className={l === docentLocale ? "font-bold" : ""}>
                  {LOCALE_NAMES[l]}
                </span>
                {l === docentLocale && <Check size={20} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      {/* 미니 플레이어: 카드가 화면 밖일 때 CTA 바 바로 위 */}
      <div
        aria-hidden={!showMini}
        className={`fixed inset-x-0 z-30 mx-auto w-full max-w-[var(--shell-max-width)] px-3 transition-[opacity,transform] duration-200 ${
          showMini
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        style={{ bottom: "calc(var(--cta-height) + env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className="flex items-center gap-3 rounded-card border border-jae bg-hanji p-2 pr-3">
          <PlayButton
            playing={playing}
            onClick={toggle}
            label={playing ? t("pause") : t("play")}
            size={44}
            tabIndex={showMini ? 0 : -1}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <p className="truncate font-serif text-sm font-semibold">{current.title}</p>
            <div className="h-1 rounded-full bg-jae">
              <div
                className="h-full rounded-full bg-cheongja-deep"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="font-en text-sm text-mukhoe lining-nums tabular-nums">
            {fmt(time)}
          </span>
        </div>
      </div>
    </>
  );
}

const round = (n: number) => Math.round(n * 10) / 10;
const noopSubscribe = () => () => {};
const isQrEntry = () => new URLSearchParams(window.location.search).get("src") === "qr";

function PlayButton({
  playing,
  onClick,
  label,
  size,
  tabIndex,
}: {
  playing: boolean;
  onClick: () => void;
  label: string;
  size: number;
  tabIndex?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      tabIndex={tabIndex}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
        playing ? "bg-cheongja-deep" : "border border-meok bg-transparent"
      }`}
    >
      {playing ? (
        <span className="flex gap-1" aria-hidden>
          <span className="h-4 w-1 bg-baekja" />
          <span className="h-4 w-1 bg-baekja" />
        </span>
      ) : (
        <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden className="ml-0.5">
          <path d="M2 1.5 L14 9 L2 16.5 Z" fill="var(--meok)" />
        </svg>
      )}
    </button>
  );
}

function Progress({
  value,
  max,
  progress,
  onChange,
  onCommit,
}: {
  value: number;
  max: number;
  progress: number;
  onChange: (v: number) => void;
  onCommit: () => void;
}) {
  return (
    <div className="relative h-4">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-jae" />
      <div
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-cheongja-deep"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cheongja-deep"
        style={{ left: `${progress}%` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
        aria-label="progress"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

function TextButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 min-w-12 items-center justify-center font-en text-base text-meok lining-nums tabular-nums"
    >
      {children}
    </button>
  );
}

function fmt(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const s = Math.floor(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
