import { Container, Stories, Title } from "@/shared/components/shared";
import Filters from "@/shared/components/shared/filters";
import ProductsGroupList from "@/shared/components/shared/products-group-list";
import TopBar from "@/shared/components/shared/top-bar";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizzas";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const params = await searchParams;
  const categories = await findPizzas(params);

  return (
    <>
      <Container className="mt-10">
        <Title text="All Pizza's" size="lg" className="font-bold" />
      </Container>

      {/* TODO: Check categories length before passing */}
      <TopBar categories={categories} />

      <Stories />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Filter */}
          <div className="w-[250px]">
            <Filters />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      products={category.products}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
