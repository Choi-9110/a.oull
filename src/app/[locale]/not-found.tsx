import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <p className="text-lg">404</p>
      <Link href="/" className="underline">
        A.OULL
      </Link>
    </div>
  );
}
