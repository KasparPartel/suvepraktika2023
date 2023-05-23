import Link from "next/link";
import buildQueryParams, { SearchParams } from "@/util/params";

export default function PaginationFilter({
  url,
  totalPages,
  searchParams,
}: {
  url: string;
  totalPages: number;
  searchParams: Partial<SearchParams>;
}) {
  const activePage = parseInt(searchParams.page ?? "1", 10);

  return (
    <ul className="flex gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((v, i) => {
        searchParams.page = v.toString();

        return (
          <li key={i} className={v == activePage ? "font-bold" : ""}>
            <Link href={url + buildQueryParams(searchParams)}>{v}</Link>
          </li>
        );
      })}
    </ul>
  );
}