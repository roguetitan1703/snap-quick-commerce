import { Metadata } from "next";
import { getProductDetails } from "@/lib/products";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = parseInt(params.id);

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