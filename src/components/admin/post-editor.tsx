"use client";

import type { JSONContent } from "@tiptap/react";
import Link from "next/link";
import { useState } from "react";
import { Field, Select, TextArea, TextInput } from "@/components/forms/fields";
import { button, PhotoPlaceholder } from "@/components/ui/primitives";
import { routing, type Locale } from "@/i18n/routing";
import { RichEditor } from "./rich-editor";

export type PostDraft = {
  slug: string;
  category: string;
  artisanSlug: string;
  content: Record<Locale, { title: string; excerpt: string; body: JSONContent }>;
};

const LOCALE_TABS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};
const CATEGORIES = ["프로젝트", "공예 노트", "인터뷰", "소식"];
const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

const emptyDraft = (): PostDraft => ({
  slug: "",
  category: CATEGORIES[0],
  artisanSlug: "",
  content: Object.fromEntries(
    routing.locales.map((l) => [l, { title: "", excerpt: "", body: EMPTY_DOC }]),
  ) as PostDraft["content"],
});

/**
 * A-02 매거진 글쓰기 — 대표 이미지 + 언어별(한국어 필수) 제목·요약·본문(리치 에디터)
 * 데모 모드: 브라우저에 임시저장만 된다. Supabase 연결 후 posts 테이블 저장 + 이미지 업로드로 교체.
 */
export function PostEditor({
  initial,
  artisans,
}: {
  initial?: PostDraft;
  artisans: { slug: string; label: string }[];
}) {
  const [draft, setDraft] = useState<PostDraft>(initial ?? emptyDraft);
  const [tab, setTab] = useState<Locale>("ko");
  const [html, setHtml] = useState<Partial<Record<Locale, string>>>({});
  const [cover, setCover] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const current = draft.content[tab];
  const setContent = (patch: Partial<PostDraft["content"][Locale]>) =>
    setDraft((d) => ({
      ...d,
      content: { ...d.content, [tab]: { ...d.content[tab], ...patch } },
    }));

  const slugValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug);
  const koReady = draft.content.ko.title.trim().length > 0;

  const saveDraft = () => {
    try {
      localStorage.setItem(
        `aoull:post-draft:${draft.slug || "new"}`,
        JSON.stringify(draft),
      );
      setNotice("이 브라우저에 임시 저장했습니다. (데모 모드: 서버에는 저장되지 않음)");
    } catch {
      setNotice("임시 저장에 실패했습니다.");
    }
  };

  const publish = () => {
    if (!koReady || !slugValid) {
      setNotice("한국어 제목과 주소(slug)를 확인해 주세요.");
      return;
    }
    setNotice("데모 모드라 발행되지 않습니다. Supabase 연결 후 실제로 발행됩니다.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-meok pb-3">
        <div>
          <Link href="/admin/magazine" className="text-label text-nambit">
            ← 매거진 목록
          </Link>
          <h1 className="font-serif text-heading font-semibold">
            {initial ? "글 편집" : "새 글 쓰기"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className={`${button.base} ${button.secondary} h-11 px-4 text-sm`}
          >
            {preview ? "편집으로" : "미리보기"}
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className={`${button.base} ${button.secondary} h-11 px-4 text-sm`}
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={publish}
            className={`${button.base} ${button.solid} h-11 px-5 text-sm`}
          >
            발행
          </button>
        </div>
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-card border border-jae bg-baekja px-4 py-3 text-caption"
        >
          {notice}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* 본문 */}
        <div className="flex flex-col gap-4">
          <div role="tablist" aria-label="언어" className="flex border-b border-jae">
            {routing.locales.map((l) => {
              const filled = draft.content[l].title.trim().length > 0;
              return (
                <button
                  key={l}
                  role="tab"
                  type="button"
                  aria-selected={tab === l}
                  onClick={() => setTab(l)}
                  className={`-mb-px h-11 border-b-2 px-4 text-sm ${
                    tab === l ? "border-meok font-bold" : "border-transparent text-mukhoe"
                  }`}
                >
                  {LOCALE_TABS[l]}
                  {l === "ko" && <span className="ml-0.5 text-onggi">*</span>}
                  <span
                    aria-hidden
                    className={`ml-1.5 inline-block size-1.5 rounded-full align-middle ${filled ? "bg-cheongja-deep" : "bg-jae"}`}
                  />
                </button>
              );
            })}
          </div>

          {preview ? (
            <article
              lang={tab}
              className="rounded-card border border-jae bg-baekja px-6 py-8"
            >
              <p className="label">{draft.category}</p>
              <h2 className="mt-2 font-serif text-[27px] leading-snug font-semibold">
                {current.title || "(제목 없음)"}
              </h2>
              {current.excerpt && (
                <p className="mt-4 font-serif text-lg text-nambit">{current.excerpt}</p>
              )}
              <div
                className="article mt-6"
                // 에디터가 만든 HTML(관리자 본인 입력)만 미리보기로 렌더링
                dangerouslySetInnerHTML={{ __html: html[tab] ?? "" }}
              />
            </article>
          ) : (
            <>
              <Field label={`제목 (${LOCALE_TABS[tab]})`} required={tab === "ko"}>
                {(id) => (
                  <TextInput
                    id={id}
                    value={current.title}
                    onChange={(e) => setContent({ title: e.target.value })}
                    placeholder={
                      tab === "ko"
                        ? "글 제목"
                        : `${LOCALE_TABS[tab]} 제목 (비우면 한국어로 표시)`
                    }
                  />
                )}
              </Field>
              <Field label="요약">
                {(id) => (
                  <TextArea
                    id={id}
                    rows={2}
                    value={current.excerpt}
                    onChange={(e) => setContent({ excerpt: e.target.value })}
                    placeholder="목록과 공유 미리보기에 쓰이는 한두 문장"
                  />
                )}
              </Field>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption font-bold">본문</span>
                <RichEditor
                  key={tab}
                  value={current.body}
                  placeholder="본문을 입력하세요. 툴바에서 제목·인용·이미지를 넣을 수 있습니다."
                  onChange={(json, h) => {
                    setContent({ body: json });
                    setHtml((prev) => ({ ...prev, [tab]: h }));
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* 설정 */}
        <aside className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-caption font-bold">대표 이미지</span>
            <label className="block cursor-pointer overflow-hidden rounded-card border border-jae">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt="대표 이미지 미리보기"
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <PhotoPlaceholder
                  label="클릭해서 이미지 선택 · 16:10"
                  className="aspect-[16/10] w-full"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setCover(URL.createObjectURL(f));
                }}
              />
            </label>
            <span className="text-[11px] text-mukhoe">
              업로드 시 480·960·1440px WebP로 자동 변환 예정
            </span>
          </div>

          <Field label="주소 (slug)" required>
            {(id) => (
              <>
                <TextInput
                  id={id}
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, slug: e.target.value.toLowerCase() }))
                  }
                  placeholder="예: voice-of-the-artisan"
                />
                <span
                  className={`text-[11px] ${draft.slug && !slugValid ? "text-onggi" : "text-mukhoe"}`}
                >
                  영문 소문자·숫자·하이픈만 · /magazine/{draft.slug || "…"}
                </span>
              </>
            )}
          </Field>

          <Field label="분류">
            {(id) => (
              <Select
                id={id}
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="관련 장인">
            {(id) => (
              <Select
                id={id}
                value={draft.artisanSlug}
                onChange={(e) => setDraft((d) => ({ ...d, artisanSlug: e.target.value }))}
              >
                <option value="">없음</option>
                {artisans.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </aside>
      </div>
    </div>
  );
}
