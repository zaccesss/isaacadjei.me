import { describe, expect, it } from "vitest"
import { secretEquals } from "@/lib/secure-compare"

describe("secretEquals", () => {
  it("accepts an identical secret", () => {
    expect(secretEquals("abc123", "abc123")).toBe(true)
  })
  it("rejects a different secret of the same length", () => {
    expect(secretEquals("abc123", "abc124")).toBe(false)
  })
  it("rejects a different length without throwing", () => {
    expect(secretEquals("abc", "abcdef")).toBe(false)
  })
  it("fails closed when either side is missing or empty", () => {
    expect(secretEquals(null, "x")).toBe(false)
    expect(secretEquals("x", undefined)).toBe(false)
    expect(secretEquals("", "")).toBe(false)
  })
})
