import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "fill" | "sizes"> & {
  className?: string;
  sizes?: string;
};

/** Image that fills its parent. Parent must be position:relative with fixed height/width */
export default function ImageFill({ className, sizes, alt, ...rest }: Props) {
  return <Image alt={alt} fill className={className || "object-cover"} sizes={sizes || "(max-width: 768px) 90vw, 800px"} {...rest} />;
}
