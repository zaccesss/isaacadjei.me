import type { TILEntry } from "../index"

const _pdf_ua_iso_14289: TILEntry = {
    id: "pdf-ua-iso-14289",
    title: "PDF/UA is ISO 14289 and it is about tags, not looks",
    date: "2026-11-05",
    category: "Accessibility",
    published: true,
    body: "PDF/UA, short for Universal Accessibility, is published as ISO 14289. Part 1 (2012, revised in 2014) builds on PDF 1.7. Part 2 (2024) builds on PDF 2.0. It requires a tagged PDF where real content is tagged in a logical reading order, decoration is marked as an artifact and meaningful images carry alternative text. A PDF can look perfect on screen and still fail, because a screen reader follows the tags rather than the page. The free [veraPDF](https://docs.verapdf.org/cli/validation/) validator checks a file against the standard. Vitafolio's PDF tests can keep each generated file for checking with it.",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `# check a generated file against PDF/UA-1 with the free veraPDF validator
verapdf --flavour ua1 cv.pdf`,
        caption: "veraPDF reports each failed rule with the clause of the standard it comes from",
      },
      {
        type: "note",
        text: "Common failures in generated PDFs are a missing document title, no declared language and fonts without a Unicode mapping. All three come from the generator settings, not from the content.",
      },
      {
        type: "link",
        url: "https://docs.verapdf.org/cli/validation/",
        label: "veraPDF: command line validation",
        description: "The flavour codes, including ua1 and ua2, with example commands.",
      },
    ],
    tags: ["accessibility", "PDF", "standards"],
    source: { label: "Wikipedia: PDF/UA", url: "https://en.wikipedia.org/wiki/PDF/UA" },
    project: { name: "Vitafolio", url: "https://vitafolio.isaacadjei.me", slug: "vitafolio" },
  }

export default _pdf_ua_iso_14289
