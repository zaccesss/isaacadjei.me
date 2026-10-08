import type { TILEntry } from "../index"

const _wcag_aaa_contrast_7_to_1: TILEntry = {
    id: "wcag-aaa-contrast-7-to-1",
    title: "WCAG AAA contrast is 7:1 for normal text and 4.5:1 for large text",
    date: "2026-10-03",
    category: "Accessibility",
    published: true,
    body: "Success criterion [1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html) asks for at least 7:1 between text and its background, dropping to 4.5:1 for large text. The AA level in [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) is 4.5:1 for normal text and 3:1 for large text. Large means at least 18 point (14 point if bold). The ratio comes from [relative luminance](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance), so it is a number you can calculate rather than a judgement made by eye.",
    detail: [
      {
        type: "p",
        text: "The ratio is (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter colour and L2 the darker. White is 1 and black is 0, which gives the maximum of 21:1.",
      },
      {
        type: "code",
        lang: "text",
        code: `#000000 on #ffffff   21.0:1   passes AAA
#595959 on #ffffff    7.0:1   passes AAA (only just)
#767676 on #ffffff    4.54:1  passes AA, fails AAA`,
        caption: "Grey text on white: the jump from AA to AAA is bigger than it looks",
      },
      {
        type: "code",
        lang: "python",
        code: `def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hex_colour: str) -> float:
    r, g, b = (int(hex_colour[i:i + 2], 16) for i in (1, 3, 5))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def contrast(a: str, b: str) -> float:
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)

print(round(contrast("#595959", "#ffffff"), 2))   # 7.0
print(round(contrast("#767676", "#ffffff"), 2))   # 4.54`,
        caption: "The WCAG formula in a dozen lines, so a palette can be checked in a script or a test",
      },
      {
        type: "note",
        text: "Logos and purely decorative text are exempt. Placeholder text in a form field is not, which catches out a lot of light grey designs.",
      },
    ],
    tags: ["accessibility", "WCAG", "colour", "design"],
    source: { label: "W3C: Understanding SC 1.4.6 Contrast (Enhanced)", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html" },
  }

export default _wcag_aaa_contrast_7_to_1
