import type { Metadata } from "next";
import Link from "next/link";
import { button } from "@/components/ui/primitives";
import { getPosts } from "@/server/queries/content";

export const metadata: Metadata = { title: "매거진" };

// A-02 매거진 글 목록
export default async function AdminMagazinePage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between border-b border-meok pb-3">
        <div>
          <p className="label">MAGAZINE</p>
          <h1 className="font-serif text-heading font-semibold">매거진</h1>
        </div>
        <Link
          href="/admin/magazine/new"
          className={`${button.base} ${button.solid} h-11 px-5 text-sm`}
        >
          새 글 쓰기
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-jae text-left text-label text-mukhoe">
            <th className="py-2 font-bold">제목</th>
            <th className="py-2 font-bold">분류</th>
            <th className="py-2 font-bold">번역</th>
            <th className="py-2 font-bold">발행일</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.slug} className="border-b border-jae">
              <td className="py-3 pr-4 font-serif font-semibold">{p.title.ko}</td>
              <td className="py-3 pr-4 text-mukhoe">{p.category.ko}</td>
              <td className="py-3 pr-4 text-label">
                {(["en", "ja", "zh"] as const).map((l) => (
                  <span
                    key={l}
                    className={`mr-1.5 uppercase ${p.title[l] ? "font-bold text-meok" : "text-jae"}`}
                  >
                    {l}
                  </span>
                ))}
              </td>
              <td className="py-3 pr-4 font-en lining-nums tabular-nums">
                {p.publishedAt.replaceAll("-", ".")}
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/magazine/${p.slug}`}
                  className="text-nambit underline underline-offset-2"
                >
                  편집
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
