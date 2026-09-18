import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor, type PostDraft } from "@/components/admin/post-editor";
import { routing } from "@/i18n/routing";
import { getArtisans, getPost } from "@/server/queries/content";

export const metadata: Metadata = { title: "글 편집" };

export default async function EditPostPage({
  params,
}: PageProps<"/admin/magazine/[slug]">) {
  const { slug } = await params;
  const [post, artisans] = await Promise.all([getPost(slug), getArtisans()]);
  if (!post) notFound();

  // 목업 글(문단 배열)을 에디터 형식(Tiptap JSON)으로 변환
  const initial: PostDraft = {
    slug: post.slug,
    category: post.category.ko,
    artisanSlug: post.artisanSlug ?? "",
    content: Object.fromEntries(
      routing.locales.map((l) => [
        l,
        {
          title: post.title[l] ?? "",
          excerpt: post.excerpt[l] ?? "",
          body: {
            type: "doc",
            content: post.body
              .map((p) => p[l])
              .filter(Boolean)
              .map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
          },
        },
      ]),
    ) as PostDraft["content"],
  };

  return (
    <PostEditor
      initial={initial}
      artisans={artisans.map((a) => ({
        slug: a.slug,
        label: `${a.name.ko} · ${a.title.ko}`,
      }))}
    />
  );
}
