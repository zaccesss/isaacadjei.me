export const ZACESS_MEDIA_HOST = "https://media.zacess.com"

const override = process.env.NEXT_PUBLIC_ZACESS_MEDIA_BASE

export const ZACESS_STUDIO_BASE = override !== undefined ? override.replace(/\/$/, "") : process.env.NODE_ENV === "development" ? "/zacess-media" : ZACESS_MEDIA_HOST
