import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type Props = Omit<ImageProps, "src"> & { src: string; darkSrc?: string }

export default function ThemedCover({ src, darkSrc, className, alt, ...rest }: Props) {
  if (!darkSrc) return <Image src={src} alt={alt} className={className} {...rest} />
  return (
    <>
      <Image src={src} alt={alt} className={cn(className, "dark:hidden")} {...rest} />
      <Image src={darkSrc} alt={alt} className={cn(className, "hidden dark:block")} {...rest} />
    </>
  )
}
