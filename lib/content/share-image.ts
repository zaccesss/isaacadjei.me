import type { Metadata } from "next"

export function sameShareImage(meta: Metadata): Metadata {
  const images = meta.openGraph?.images
  if (!images || meta.twitter?.images) return meta
  return { ...meta, twitter: { ...meta.twitter, card: "summary_large_image", images: images as NonNullable<Metadata["twitter"]>["images"] } }
}
