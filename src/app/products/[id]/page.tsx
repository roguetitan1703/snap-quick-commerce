"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMinus,
  FiPlus,
  FiHeart,
  FiShare2,
  FiShoppingBag,
  FiStar,
  FiCheck,
  FiTruck,
  FiChevronLeft,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { v4 as uuidv4 } from "uuid";
import ProductCard from "@/components/product/ProductCard";
import ImprovedImage from "@/components/ui/ImprovedImage";



// Sample quick commerce grocery product data
const sampleProduct = {
  id: "1",
  name: "Organic Bananas (6 pcs)",
  price: 4.99,
  imageUrl:
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  category: "Fruits & Vegetables",
  currentStock: 50,
  description:
    "Fresh, organic bananas with a sweet flavor. Perfect for smoothies, baking, or as a healthy snack. Grown without pesticides or chemical fertilizers.",
  isNew: false,
  rating: 4.7,
  reviews: 124,
  weight: "1kg (approx.)",
  origin: "India",
  nutritionalInfo: [
    "Rich in potassium",
    "Good source of vitamin B6",
    "Contains vitamin C",
    "High in fiber",
  ],
  storageInstructions:
    "Store at room temperature. Refrigerate to slow ripening.",
  images: [
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  ],
};

// Sample related products for quick commerce
const relatedProducts = [
  {
    id: "2",
    name: "Fresh Milk 1L",
    price: 2.99,
    imageUrl: "/images/products/milk.jpg",
    category: "Dairy & Eggs",
    currentStock: 35,
  },
  {
    id: "3",
    name: "Brown Eggs (6 pcs)",
    price: 3.49,
    imageUrl:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Dairy & Eggs",
    currentStock: 24,
  },
  {
    id: "4",
    name: "Sourdough Bread",
    price: 5.99,
    imageUrl: "/images/products/bread.svg",
    category: "Bakery",
    isNew: true,
  },
];

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // In a real app, this would fetch the product based on params.id
  const product = sampleProduct;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, items } = useCartStore();

  // Check if this product is already in the cart
  const cartItem = items.find((item) => item.productId === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.currentStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: cartItem?.id || uuidv4(),
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      maxQuantity: product.currentStock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="pb-20 bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/products" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="snap-heading-1">Product Details</h1>
      </div>

      {/* Product Images */}
      <div className="bg-white">
        <div className="relative h-72 w-full bg-gray-100">
          <Suspense
            fallback={<div className="h-72 w-full bg-gray-200 animate-pulse" />}
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder-product.svg";
              }}
            />
          </Suspense>
          {product.isNew && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
              NEW
            </div>
          )}
        </div>

        {/* Thumbnail images */}
        <div className="px-4 py-2 flex space-x-2 overflow-x-auto hide-scrollbar">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-16 h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden ${
                selectedImage === index
                  ? "border-indigo-600"
                  : "border-transparent"
              }`}
            >
              <div className="relative w-full h-full">
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  }
                >
                  <Image
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-product.svg";
                    }}
                  />
                </Suspense>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white mt-2 p-4">
        <div className="flex flex-col mb-2">
          <p className="text-xs text-gray-500">{product.category}</p>
          <h1 className="text-xl font-semibold text-gray-900 mt-1">
            {product.name}
          </h1>

          {/* Weight/Size */}
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600">{product.weight}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-600">
              Origin: {product.origin}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-current" : ""
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-500">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Price and Delivery Info */}
        <div className="flex flex-col mb-3">
          <div className="flex items-baseline">
            <p className="text-xl font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </p>
            <span className="ml-2 text-sm text-green-600 font-medium">
              In Stock
            </span>
          </div>
          <div className="flex items-center mt-2 bg-indigo-50 p-2 rounded-lg">
            <FiClock className="text-indigo-600 mr-2" size={16} />
            <p className="text-sm text-indigo-800">Delivery in 10-15 minutes</p>
          </div>
        </div>

        {/* Add to cart section */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center">
            <p className="text-sm font-medium">Quantity</p>
          </div>

          {quantityInCart > 0 ? (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium mr-3">
                In your cart: {quantityInCart}
              </p>
              <div className="flex items-center bg-indigo-50 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    useCartStore.getState().decrementItem(product.id)
                  }
                  className="px-3 py-2 text-indigo-600"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>
                <span className="text-sm font-medium text-indigo-800 px-3">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => {
                    addItem({
                      id: cartItem?.id || uuidv4(),
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                      quantity: 1,
                      maxQuantity: product.currentStock,
                    });
                  }}
                  className="px-3 py-2 text-indigo-600"
                  disabled={quantityInCart >= product.currentStock}
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden mr-3">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>
                <span className="text-sm font-medium px-3">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.currentStock}
                  className="px-3 py-2 text-gray-600"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.currentStock === 0 || isAdded}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  product.currentStock === 0
                    ? "bg-gray-300 text-gray-500"
                    : isAdded
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {product.currentStock === 0 ? (
                  "Out of Stock"
                ) : isAdded ? (
                  <>
                    <FiCheck className="mr-2" />
                    Added
                  </>
                ) : (
                  <>
                    <FiShoppingBag className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Description and nutrition */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">About this Product</h2>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>

          <h3 className="text-base font-medium mb-2">Nutritional Benefits</h3>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            {product.nutritionalInfo.map((info, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                {info}
              </li>
            ))}
          </ul>

          <h3 className="text-base font-medium mb-2">Storage Instructions</h3>
          <p className="text-sm text-gray-600">{product.storageInstructions}</p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white mt-2 p-4">
        <h2 className="text-lg font-semibold mb-3">Delivery Information</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FiTruck className="text-indigo-600" />
            </div>
            <div>
              <p className="text-base font-medium">Fast Delivery</p>
              <p className="text-sm text-gray-600">
                Get your groceries delivered within 10-15 minutes
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <FiCheck className="text-green-600" />
            </div>
            <div>
              <p className="text-base font-medium">Fresh Guarantee</p>
              <p className="text-sm text-gray-600">
                We ensure all produce is fresh. Easy returns if you're not
                satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-4 px-4 pb-4">
        <h2 className="text-lg font-semibold mb-3">You Might Also Like</h2>
        <div className="grid grid-cols-2 gap-3">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} {...relatedProduct} />
          ))}
        </div>
      </div>

      {/* Fixed Add to Cart Button (for easier access) */}
      {!quantityInCart && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg border-t border-gray-200 max-w-[100vw] overflow-hidden">
          <button
            onClick={handleAddToCart}
            disabled={product.currentStock === 0}
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center whitespace-nowrap"
          >
            <FiShoppingBag className="mr-2" />
            Add to Cart • ₹{product.price.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
