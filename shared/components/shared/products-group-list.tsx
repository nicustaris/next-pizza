"use client";
import React, { useEffect } from "react";
import { useIntersection } from "react-use";

import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import ProductCard from "./product-card";
import { useCategoryStore } from "@/shared/store/category";
import { ProductWithRelations } from "@/@types/prisma";
import { Ingredient } from "@prisma/client";

interface Props {
  title: string;
  products: ProductWithRelations[];
  categoryId: number;
  className?: string;
  listClassName?: string;
}

const ProductsGroupList: React.FC<Props> = ({
  title,
  products,
  categoryId,
  className,
  listClassName,
}) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [intersection?.isIntersecting, categoryId, title]);

  return (
    <div className={cn(className)} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />
      <div
        className={cn(
          "grid sm:grid-cols-1 gap-[50px] md:grid-cols-2 xl:grid-cols-3",
          listClassName,
        )}
      >
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.variants[0].price}
            ingredients={product.ingredients}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsGroupList;
