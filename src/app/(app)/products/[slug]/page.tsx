import type { Media, Product } from "@/payload-types";

import { RenderBlocks } from "@/blocks/RenderBlocks";
import { ProductGridItem } from "@/components/ProductGridItem";
import { Gallery } from "@/components/product/Gallery";
import { ProductDescription } from "@/components/product/ProductDescription";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { getFirstImage, isPortrait } from "@/components/product/utils";
import { cn } from "@/utilities/cn";
import { getShopStatus } from "@/utilities/shopStatus";
import { Metadata } from "next";

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

/** Dark until the shop opens; an admin previewing a draft still sees the page. */
const shopClosedFor = async () => {
  const { isEnabled: draft } = await draftMode()
  return !draft && !(await getShopStatus()).open
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  if (await shopClosedFor()) return notFound()
  const { slug } = await params;
  const product = await queryProductBySlug({ slug });

  if (!product) return notFound();

  const gallery =
    product.gallery?.filter((item) => typeof item.image === "object") || [];

  const metaImage =
    typeof product.meta?.image === "object" ? product.meta?.image : undefined;
  const canIndex = product._status === "published";

  // Explicit prints never put their image in a social preview.
  const seoImage = product.explicitContent
    ? undefined
    : metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined);

  return {
    description: product.meta?.description || "",
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt || "",
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  };
}

export default async function ProductPage({ params }: Args) {
  if (await shopClosedFor()) return notFound()
  const { slug } = await params;
  const product = await queryProductBySlug({ slug });

  if (!product) return notFound();

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === "object")
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || [];

  const portrait = isPortrait(getFirstImage(product));
  const artwork = await queryArtworkForProduct(product.id);

  const metaImage =
    typeof product.meta?.image === "object" ? product.meta?.image : undefined;
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== "object") return false;
        return variant.inventory && variant?.inventory > 0;
      })
    : product.inventory! > 0;

  let price = product.priceInUSD;

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (
        typeof variant === "object" &&
        variant?.priceInUSD &&
        acc &&
        variant?.priceInUSD > acc
      ) {
        return variant.priceInUSD;
      }
      return acc;
    }, price);
  }

  const productJsonLd = {
    name: product.title,
    "@context": "https://schema.org",
    "@type": "Product",
    description: product.description,
    image: product.explicitContent ? undefined : metaImage?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      price: price,
      priceCurrency: "usd",
    },
  };

  const relatedProducts =
    product.relatedProducts?.filter(
      (relatedProduct) => typeof relatedProduct === "object",
    ) ?? [];

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          // Escape `<` so text in the CMS can't close the script tag.
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <div className="container pt-8 pb-16">
        <Link
          href="/shop"
          className="mb-12 inline-block text-xs font-medium uppercase tracking-[0.1em] text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:underline-offset-4"
        >
          Shop
        </Link>

        <div
          className={cn(
            "flex flex-col gap-12",
            portrait
              ? "lg:grid lg:grid-cols-2 lg:items-start lg:gap-12"
              : "max-w-5xl",
          )}
        >
          {Boolean(gallery?.length) && (
            <Gallery
              gallery={gallery}
              sizes={
                portrait
                  ? "(min-width: 1024px) 45vw, 100vw"
                  : "(min-width: 1280px) 60vw, 100vw"
              }
            />
          )}

          <div className={cn(!portrait && "max-w-3xl")}>
            <ProductDescription artwork={artwork} product={product} />
          </div>
        </div>
      </div>

      {product.layout?.length ? (
        <RenderBlocks blocks={product.layout} />
      ) : (
        <></>
      )}

      {relatedProducts.length ? (
        <div className="container">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section aria-labelledby="related-prints" className="border-t py-12">
      <h2
        id="related-prints"
        className="mb-8 text-xs font-medium uppercase tracking-[0.1em] text-primary/50"
      >
        Related prints
      </h2>
      <ul className="grid grid-cols-1 items-start gap-x-12 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <ProductGridItem product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const queryArtworkForProduct = async (productId: Product["id"]) => {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "artwork",
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    select: { year: true, series: true },
    where: {
      and: [
        { availablePrints: { contains: productId } },
        { _status: { equals: "published" } },
      ],
    },
  });

  return result.docs?.[0] || null;
};

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "products",
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: "published" } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInUSD: true,
        inventory: true,
        options: true,
      },
    },
  });

  return result.docs?.[0] || null;
};
