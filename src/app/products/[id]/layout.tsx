import { Metadata } from "next";
import { getProductDetails } from "@/lib/products";
import ProductDetailPage from "./page";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = await Promise.resolve(parseInt(params.id));

  if (isNaN(productId)) {
    return {
      title: "Product Not Found",
    };
  }

  try {
    const product = await getProductDetails(productId);
    return {
      title: product.name,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found",
    };
  }
}

export default function ProductLayout({ params }: Props) {
  return <ProductDetailPage />;
}
