import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ProductImage({
  src,
  alt,
  width,
  height,
  className,
}: ProductImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn("relative bg-muted overflow-hidden", className)}
      style={{ aspectRatio: width / height }}
    >
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-16 w-16 text-muted-foreground" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "object-contain transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
