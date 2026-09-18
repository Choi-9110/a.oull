"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * 매거진 본문 에디터 (Tiptap)
 * 저장 형식은 Tiptap JSON(locale별) — posts.body jsonb에 그대로 저장한다.
 * 이미지: 데모 모드에서는 브라우저 미리보기 URL만 쓴다. Supabase 연결 후 스토리지 업로드로 교체.
 */
export function RichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: JSONContent;
  onChange: (json: JSONContent, html: string) => void;
  placeholder: string;
}) {
  const fileInputId = useId();
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // 부모가 다시 렌더링돼도 에디터가 재생성되지 않도록 확장·콜백을 고정한다
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder],
  );

  const editor = useEditor(
    {
      immediatelyRender: false, // SSR 하이드레이션 불일치 방지
      extensions,
      content: value,
      editorProps: {
        attributes: { class: "article min-h-[360px] px-5 py-4 outline-none" },
      },
      onCreate: ({ editor }) => onChangeRef.current(editor.getJSON(), editor.getHTML()),
      onUpdate: ({ editor }) => onChangeRef.current(editor.getJSON(), editor.getHTML()),
    },
    [extensions],
  );

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            quote: e.isActive("blockquote"),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });

  if (!editor) {
    return (
      <div className="min-h-[420px] rounded-card border border-jae bg-baekja" aria-busy />
    );
  }
  const active = state ?? INACTIVE;

  const chain = () => editor.chain().focus();

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) chain().extendMarkRange("link").unsetLink().run();
    else
      chain()
        .extendMarkRange("link")
        .setLink({ href: /^https?:\/\//.test(url) ? url : `https://${url}` })
        .run();
    setLinkOpen(false);
  };

  const tools: {
    label: string;
    icon: React.ReactNode;
    on?: boolean;
    disabled?: boolean;
    run: () => void;
  }[] = [
    {
      label: "제목",
      icon: <Heading2 size={18} />,
      on: active.h2,
      run: () => chain().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "소제목",
      icon: <Heading3 size={18} />,
      on: active.h3,
      run: () => chain().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "굵게",
      icon: <Bold size={18} />,
      on: active.bold,
      run: () => chain().toggleBold().run(),
    },
    {
      label: "기울임",
      icon: <Italic size={18} />,
      on: active.italic,
      run: () => chain().toggleItalic().run(),
    },
    {
      label: "인용",
      icon: <Quote size={18} />,
      on: active.quote,
      run: () => chain().toggleBlockquote().run(),
    },
    {
      label: "글머리 목록",
      icon: <List size={18} />,
      on: active.ul,
      run: () => chain().toggleBulletList().run(),
    },
    {
      label: "번호 목록",
      icon: <ListOrdered size={18} />,
      on: active.ol,
      run: () => chain().toggleOrderedList().run(),
    },
    {
      label: "링크",
      icon: <LinkIcon size={18} />,
      on: active.link || linkOpen,
      run: () => {
        setLinkUrl(editor.getAttributes("link").href ?? "");
        setLinkOpen((o) => !o);
      },
    },
    {
      label: "이미지",
      icon: <ImagePlus size={18} />,
      run: () => document.getElementById(fileInputId)?.click(),
    },
    {
      label: "구분선",
      icon: <Minus size={18} />,
      run: () => chain().setHorizontalRule().run(),
    },
    {
      label: "되돌리기",
      icon: <Undo2 size={18} />,
      disabled: !active.canUndo,
      run: () => chain().undo().run(),
    },
    {
      label: "다시 실행",
      icon: <Redo2 size={18} />,
      disabled: !active.canRedo,
      run: () => chain().redo().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-card border border-jae bg-baekja">
      <div
        role="toolbar"
        aria-label="본문 서식"
        className="flex flex-wrap gap-0.5 border-b border-jae bg-hanji p-1.5"
      >
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            aria-label={t.label}
            aria-pressed={t.on}
            disabled={t.disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            className={`flex size-9 items-center justify-center rounded-btn disabled:opacity-30 ${
              t.on ? "bg-meok text-baekja" : "text-meok hover:bg-baekja"
            }`}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {linkOpen && (
        <div className="flex items-center gap-2 border-b border-jae px-3 py-2">
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
            }}
            placeholder="https://"
            aria-label="링크 주소"
            className="h-9 min-w-0 flex-1 rounded-btn border border-jae px-2 text-sm outline-none focus:border-meok"
          />
          <button
            type="button"
            onClick={applyLink}
            className="h-9 rounded-btn bg-meok px-3 text-sm text-baekja"
          >
            {linkUrl.trim() ? "적용" : "링크 해제"}
          </button>
        </div>
      )}

      <EditorContent editor={editor} />

      <input
        id={fileInputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file)
            chain()
              .setImage({ src: URL.createObjectURL(file), alt: file.name })
              .run();
          e.target.value = "";
        }}
      />
    </div>
  );
}

const INACTIVE = {
  h2: false,
  h3: false,
  bold: false,
  italic: false,
  quote: false,
  ul: false,
  ol: false,
  link: false,
  canUndo: false,
  canRedo: false,
};
