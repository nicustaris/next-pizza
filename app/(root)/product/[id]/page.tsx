import { Container } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

import { ProductForm } from "@/shared/components/shared/product-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: Optimise the db request for recommended items
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      ingredients: true,

      category: {
        include: {
          products: {
            include: {
              variants: true,
            },
          },
        },
      },
      variants: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <ProductForm product={product} />
    </Container>
  );
}
