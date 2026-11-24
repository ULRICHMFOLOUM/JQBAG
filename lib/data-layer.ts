import { prisma } from "@/lib/prisma";
import fallbackJson from "./fallback-data.json";

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count: {
    products: number;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promoPrice: number | null;
  stock: number;
  imageUrl: string;
  imageUrl2: string | null;
  imageUrl3: string | null;
  imageUrl4: string | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export async function getHomeData() {
  try {
    const [categories, featuredProducts, dbSettings] = await Promise.all([
      prisma.category.findMany({
        take: 3,
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        take: 8,
        include: { category: true },
      }),
      prisma.setting.findMany(),
    ]);

    if (categories && categories.length > 0 && featuredProducts && featuredProducts.length > 0) {
      const settingsMap: Record<string, string> = {};
      for (const s of dbSettings || []) {
        settingsMap[s.key] = s.value;
      }
      return {
        categories: categories as unknown as CategoryWithCount[],
        featuredProducts: featuredProducts as unknown as ProductItem[],
        settingsMap,
      };
    }
  } catch (error) {
    console.warn("Prisma home query fallback triggered:", error);
  }

  // Fallback high-fidelity data
  const fallbackCategories = (fallbackJson.categories || []) as unknown as CategoryWithCount[];
  const allProducts = (fallbackJson.products || []) as unknown as ProductItem[];
  const featured = allProducts.filter((p) => p.isFeatured && p.isActive).slice(0, 8);

  const settingsMap: Record<string, string> = {};
  for (const s of fallbackJson.settings || []) {
    settingsMap[s.key] = s.value;
  }

  return {
    categories: fallbackCategories,
    featuredProducts: featured.length > 0 ? featured : allProducts.slice(0, 8),
    settingsMap,
  };
}

export async function getCatalogData(categorySlug?: string) {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
      }),
    ]);

    if (products && products.length > 0) {
      return {
        products: products as unknown as ProductItem[],
        categories: categories as unknown as CategoryWithCount[],
      };
    }
  } catch (error) {
    console.warn("Prisma catalog query fallback triggered:", error);
  }

  // Fallback
  const allProducts = (fallbackJson.products || []) as unknown as ProductItem[];
  const categories = (fallbackJson.categories || []) as unknown as CategoryWithCount[];

  return {
    products: allProducts,
    categories,
  };
}

export async function getProductDetail(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (product) {
      const relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        take: 4,
        include: { category: true },
      });

      return {
        product: product as unknown as ProductItem,
        relatedProducts: relatedProducts as unknown as ProductItem[],
      };
    }
  } catch (error) {
    console.warn(`Prisma product [${slug}] query fallback triggered:`, error);
  }

  // Fallback
  const allProducts = (fallbackJson.products || []) as unknown as ProductItem[];
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    return { product: null, relatedProducts: [] };
  }

  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 4);

  return {
    product,
    relatedProducts,
  };
}

