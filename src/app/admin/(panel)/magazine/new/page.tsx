import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/post-editor";
import { getArtisans } from "@/server/queries/content";

export const metadata: Metadata = { title: "새 글" };

export default async function NewPostPage() {
  const artisans = await getArtisans();
  return (
    <PostEditor
      artisans={artisans.map((a) => ({
        slug: a.slug,
        label: `${a.name.ko} · ${a.title.ko}`,
      }))}
    />
  );
}
