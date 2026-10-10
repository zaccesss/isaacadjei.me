"use client"

import Image, { type ImageProps } from "next/image"
import { isSyncedImage, mediaLoader } from "@/lib/media"

export default function MediaImage(props: ImageProps) {
  const synced = typeof props.src === "string" && isSyncedImage(props.src)
  return <Image {...props} alt={props.alt} loader={synced ? mediaLoader : undefined} />
}
