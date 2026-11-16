/**
 * Dev/preview-only fixture: placeholder prints on real artwork, for reviewing the shop on a
 * Preview deployment. Never run against production. Refuses unless the database name ends in
 * "-preview" or the host is local.
 *
 *   SEED_DATABASE_URI=<preview uri> pnpm payload run src/scripts/seed-preview-prints.ts
 *
 * SEED_DATABASE_URI is separate from DATABASE_URI on purpose: Payload loads .env, which would
 * otherwise silently point the script at whatever database .env names.
 *
 * Prices, sizes, editions, paper and process are placeholders, not Will's decisions.
 */
import { getPayload } from "payload";

const PRINTS: {
  slug: string;
  explicit: boolean;
  inventory: [number, number];
}[] = [
  { slug: "sorry-barbie", explicit: true, inventory: [5, 3] },
  { slug: "american-pie", explicit: true, inventory: [10, 10] },
  { slug: "familiar-mechanisms-iii", explicit: false, inventory: [5, 3] },
  { slug: "abomination-i", explicit: true, inventory: [1, 0] },
  { slug: "transcendence", explicit: false, inventory: [0, 0] },
];

// Revalidation hooks need a running Next server; there is none here.
const context = { disableRevalidate: true };

const run = async () => {
  const uri = process.env.SEED_DATABASE_URI || "";
  if (!uri) throw new Error("Set SEED_DATABASE_URI to the preview database.");
  const dbName = new URL(
    uri.replace(/^mongodb(\+srv)?:/, "http:"),
  ).pathname.slice(1);
  const local = /127\.0\.0\.1|localhost/.test(uri);
  if (!dbName.endsWith("-preview") && !local) {
    throw new Error(
      `Refusing to seed database "${dbName}": not a preview or local database.`,
    );
  }

  console.log(`Seeding database "${dbName}"`);
  // payload.config.ts reads DATABASE_URI at import time, so set it before importing.
  process.env.DATABASE_URI = uri;
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });

  const existingType = await payload.find({
    collection: "variantTypes",
    where: { name: { equals: "size" } },
    limit: 1,
  });
  const sizeType =
    existingType.docs[0] ??
    (await payload.create({
      collection: "variantTypes",
      context,
      data: { label: "Size", name: "size" },
    }));

  const option = async (label: string) => {
    const found = await payload.find({
      collection: "variantOptions",
      where: {
        and: [
          { variantType: { equals: sizeType.id } },
          { label: { equals: label } },
        ],
      },
      limit: 1,
    });
    return (
      found.docs[0] ??
      (await payload.create({
        context,
        collection: "variantOptions",
        data: { label, value: label.toLowerCase(), variantType: sizeType.id },
      }))
    );
  };
  const small = await option("Small");
  const large = await option("Large");

  for (const spec of PRINTS) {
    const art = (
      await payload.find({
        collection: "artwork",
        where: { slug: { equals: spec.slug } },
        limit: 1,
      })
    ).docs[0];
    if (!art) {
      payload.logger.warn(`No artwork with slug ${spec.slug}; skipping`);
      continue;
    }
    const productSlug = `${spec.slug}-print`;
    const exists = await payload.find({
      collection: "products",
      where: { slug: { equals: productSlug } },
      limit: 1,
    });
    if (exists.docs.length) {
      payload.logger.info(`${productSlug} already exists; skipping`);
      continue;
    }

    const imageID = typeof art.image === "object" ? art.image.id : art.image;
    const product = await payload.create({
      context,
      collection: "products",
      data: {
        title: art.title.trim(),
        slug: productSlug,
        _status: "published",
        gallery: [{ image: imageID }],
        enableVariants: true,
        variantTypes: [sizeType.id],
        explicitContent: spec.explicit,
        editionSize: 10,
        artistProofs: 2,
        paper: "Placeholder paper",
        printProcess: "Placeholder process",
        signed: true,
        productionTime: 14,
        priceInUSDEnabled: true,
      },
    });

    for (const [opt, inventory, price] of [
      [small, spec.inventory[0], 15000],
      [large, spec.inventory[1], 30000],
    ] as const) {
      await payload.create({
        context,
        collection: "variants",
        data: {
          product: product.id,
          options: [opt.id],
          inventory,
          priceInUSDEnabled: true,
          priceInUSD: price,
          _status: "published",
        },
      });
    }

    await payload.update({
      context,
      collection: "artwork",
      id: art.id,
      data: { availablePrints: [product.id] },
    });
    payload.logger.info(`Created ${productSlug}`);
  }

  // A test shipping rate so the preview shop opens. Will sets real ones in Shop settings.
  const settings = await payload.findGlobal({ slug: "shopSettings", depth: 0 });
  if (!settings.shippingRates?.length) {
    await payload.updateGlobal({
      slug: "shopSettings",
      context,
      data: {
        shippingRates: [
          { label: "Flat mailer (test rate)", price: 15, minDays: 5, maxDays: 8 },
        ],
        shippingCountries: ["US"],
      },
    });
    payload.logger.info("Added a test shipping rate");
  }

  // A way into the shop from the preview's nav. Preview database only.
  const header = await payload.findGlobal({ slug: "header", depth: 0 });
  const nav = header.navItems ?? [];
  if (!nav.some((n) => n.link?.url === "/shop")) {
    await payload.updateGlobal({
      context,
      slug: "header",
      data: {
        navItems: [
          ...nav,
          {
            type: "link",
            link: {
              type: "custom",
              url: "/shop",
              label: "Prints",
              newTab: false,
            },
          },
        ],
      },
    });
    payload.logger.info("Added Prints to the preview nav");
  }

  process.exit(0);
};

// `payload run` does not wait for a floating promise; await at the top level.
try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
