import { Page, PageRequest } from "@/models/page";
import Checkout from "@/models/checkout";
import PaginationFilter from "@/components/PaginationFilter";
import ItemsPerPageFilter from "@/components/ItemsPerPageFilter";
import SortingFilter from "@/components/SortingFilter";
import { SearchParams } from "@/util/params";
import createFilter from "@/util/FilterFactory";
import { buildParams } from "@/util/rest";

const getCheckouts = async (filter: PageRequest) => {
  const res = await fetch(
    process.env.API_ROOT + "checkout/getCheckouts" + buildParams(filter)
  );
  return await res.json();
};

export default async function CheckoutsPage({
  searchParams,
}: {
  searchParams: Partial<SearchParams>;
}) {
  const filter: PageRequest = createFilter(searchParams);

  const page: Page<Checkout> = await getCheckouts(filter);
  console.log(page);

  return (
    <>
      {
        // TODO move all of this into a layout to share between books and checkouts
      }
      <h1 className="text-xl font-bold">Checkouts</h1>
      <PaginationFilter
        url="/checkouts"
        totalPages={page.totalPages}
        searchParams={searchParams}
      />
      <ItemsPerPageFilter
        url="/checkouts"
        options={[20, 35, 50, 75]}
        searchParams={searchParams}
      />
      <SortingFilter
        url="/checkouts"
        sortOn={"borrowerLastName"}
        searchParams={searchParams}
      />
      <section className="flex flex-col gap-2">
        {page.content.map((checkout, i) => (
          <article key={i}>
            <p>
              Name: {checkout.borrowerFirstName} {checkout.borrowerLastName}
            </p>
            <p>Book: {checkout.borrowedBook.title}</p>
            <p>Borrowed on: {checkout.checkedOutDate}</p>
            <p>Due date: {checkout.dueDate}</p>
            <p>{checkout.returnedDate ? "RETURNED" : "NOT RETURNED"}</p>
          </article>
        ))}
      </section>
    </>
  );
}