import type { BlogPost } from "../index"

const _website_in_seven_languages: BlogPost = {
  slug: "website-in-seven-languages",
  title: "Shipping a Website in Seven Languages, Right to Left Included",
  date: "2026-11-07",
  type: "blog",
  cover_image: "/images/blog/covers/website-in-seven-languages-shot.webp",
  cover_image_dark: "/images/blog/covers/website-in-seven-languages-shot-dark.webp",
  description:
    "How Vitafolio went from English only to seven languages including Arabic and Urdu: picking the language, keeping strings in sync, mirroring layouts with logical CSS and the one-byte bug that broke Arabic PDFs.",
  tags: ["PHP", "Web", "Full-Stack", "Accessibility", "Open Source"],
  projectSlug: "vitafolio",
  published: true,
  content: [
    {
      type: "p",
      text: "[Vitafolio](https://vitafolio.isaacadjei.me) is a [Laravel](https://laravel.com) app for building, storing and sharing every version of a CV. For most of its life it only spoke English. This autumn I translated the whole interface into seven languages: English, Spanish, French, Brazilian Portuguese, Simplified Chinese, Arabic and Urdu. The last two read right to left, which turned a translation job into a layout job as well.",
    },
    {
      type: "p",
      text: "Here is how it fits together and what I would tell anyone about to do the same.",
    },
    {
      type: "h2",
      text: "Choosing the language without changing the address",
    },
    {
      type: "p",
      text: "Many sites put the language in the URL, such as /fr/about. I decided against that. Every page keeps one address, so existing links and search results do not change. A small middleware picks the language for each request in a fixed order.",
    },
    {
      type: "ol",
      items: [
        "The language saved on the account, if someone is signed in.",
        "A locale cookie set by the language menu.",
        "The browser's Accept-Language header on a first visit.",
        "English as the fallback.",
      ],
    },
    {
      type: "p",
      text: "Because the same address can now answer in different languages, the response must say so. The middleware adds [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Vary): Accept-Language to every response, so a shared cache never serves a French page to someone who asked for Urdu. The saved account language also sets the language of the emails someone receives, which is easy to forget.",
    },
    {
      type: "h2",
      text: "Strings keyed by their English text",
    },
    {
      type: "p",
      text: "Laravel supports [translation files keyed by the English text itself](https://laravel.com/framework/docs/13.x/localization), so a view contains __('Save changes') and lang/fr.json maps 'Save changes' to its French version. That keeps views readable. The risk is drift: a developer edits the English and the translations quietly stop matching.",
    },
    {
      type: "p",
      text: "Two pieces stop that. An Artisan command rewrites lang/en.json from the code itself and lists how many strings each language is missing. A test then fails if en.json is out of date or if any language is missing a key or has a stale one. It also fails if a translation changes a placeholder, an HTML tag or a plural form. The English file currently holds about 1,340 strings and every language has every one of them.",
    },
    {
      type: "code",
      lang: "bash",
      text: `php artisan vitafolio:translations   # rewrite lang/en.json and report gaps
php artisan test --filter=LocalisationTest`,
    },
    {
      type: "p",
      text: "Community translators can suggest changes on [Crowdin](https://crowdin.com/project/vitafolio). A daily workflow pulls finished translations into a pull request. A script blocks it from merging itself if any existing translation would be removed or turned back into English.",
    },
    {
      type: "h2",
      text: "Right to left is mostly CSS",
    },
    {
      type: "p",
      text: "The html element carries both lang and dir for every page, so Arabic and Urdu pages start with dir=\"rtl\". The browser then flips the inline direction of text automatically. The work is making the layout follow.",
    },
    {
      type: "h3",
      text: "Logical properties instead of left and right",
    },
    {
      type: "p",
      text: "Physical properties such as margin-left and text-align: left do not mirror. [Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values) do: margin-inline-start means 'the side where text starts', which is the left in English and the right in Arabic. [Tailwind](https://tailwindcss.com/docs/margin) exposes them as ms-, me-, ps-, pe-, start- and text-start. Converting the app was mostly a search for ml-, mr-, pl-, pr-, left- and text-left.",
    },
    {
      type: "table",
      headers: ["Physical (does not mirror)", "Logical (mirrors)", "Tailwind"],
      rows: [
        ["margin-left", "margin-inline-start", "ms-4"],
        ["padding-right", "padding-inline-end", "pe-4"],
        ["text-align: left", "text-align: start", "text-start"],
        ["left: 0", "inset-inline-start: 0", "start-0"],
      ],
    },
    {
      type: "h3",
      text: "Things that must not flip",
    },
    {
      type: "p",
      text: "Some content should stay left to right even on an Arabic page: code, web addresses, email addresses and email or URL inputs. One CSS rule isolates them. Text people write themselves, such as a CV summary, keeps its own direction through dir=\"auto\", so an English summary on an Urdu page still reads correctly.",
    },
    {
      type: "code",
      lang: "css",
      text: `/* code, addresses and emails always read left to right, even on a right-to-left page */
[dir='rtl'] :is(code, kbd, pre, samp, input[type='email'], input[type='url']) {
  direction: ltr;
  unicode-bidi: isolate;
}

/* letter spacing pulls joined arabic and urdu letters apart */
:lang(ar), :lang(ur) { letter-spacing: normal !important; }`,
    },
    {
      type: "p",
      text: "That second rule came from looking at real pages. Arabic script joins letters together, so a heading style with wide letter spacing literally pulls the word apart. Urdu is usually written in the Nastaliq style, which rises and falls far more than Latin text, so Urdu pages get a taller line height to stop letters touching the line above. Both pages load self-hosted [Noto Naskh Arabic](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic) or [Noto Nastaliq Urdu](https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu). Chinese pages use the system's own fonts, which every current system ships, to avoid a very large download.",
    },
    {
      type: "h2",
      text: "The bug that broke Arabic PDFs",
    },
    {
      type: "p",
      text: "Each CV also has its own document language, which sets its section labels and the language of its generated PDF and Word files. After the first release, Arabic text in those files sometimes came out broken, with a stray symbol and a word chopped in half. The cause was one missing letter in a regular expression.",
    },
    {
      type: "code",
      lang: "php",
      text: `// before: splits on bytes
preg_split('/\\R/', $text);

// after: the u modifier makes pcre treat the string as utf-8
preg_split('/\\R/u', $text);`,
    },
    {
      type: "p",
      text: "\\R matches any line break. One of the line breaks it recognises is the single byte 0x85, known as next line. Without the [u modifier](https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php), PCRE works on raw bytes. In UTF-8, the Arabic letter meem (م) is encoded as the two bytes 0xD9 0x85. So the split cut straight through the middle of every meem. Adding u made PCRE read whole characters and the bug vanished. I proved it with one line of PHP before and after the fix.",
    },
    {
      type: "code",
      lang: "text",
      text: `preg_split("/\\R/",  "مرحبا")  ->  ["\\xD9", "رحبا"]   (broken)
preg_split("/\\R/u", "مرحبا")  ->  ["مرحبا"]          (correct)`,
    },
    {
      type: "callout",
      tone: "warning",
      text: "If your PHP app handles anything beyond ASCII, every preg_ call that touches user text should have the u modifier. The same class of bug exists in any language that lets regular expressions run on bytes.",
    },
    {
      type: "h2",
      text: "What stays in English",
    },
    {
      type: "p",
      text: "Legal pages and the developer documentation stay in English, with a short note saying so in each other language. A mistranslated privacy policy is worse than an English one. What people write on their own CVs is never translated either. Vitafolio only translates its own interface and labels.",
    },
    {
      type: "h2",
      text: "Lessons",
    },
    {
      type: "ul",
      items: [
        "Build the right-to-left layout with logical properties from day one. Retrofitting is mostly search and replace, but it touches every view.",
        "Make missing translations a failing test, not a code review comment.",
        "Test with real Arabic and Urdu text, not reversed English. The joining and the line height problems only show up with the real script.",
        "Treat every string as Unicode everywhere: regular expressions, string length and truncation included.",
        "Ship the changes with a note people can read: the languages arrived in the [Vitafolio changelog](https://vitafolio.isaacadjei.me/changelog) and the rest of the build is on the [Vitafolio project page](/projects/vitafolio).",
      ],
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "W3C: structural markup and right-to-left text in HTML", url: "https://www.w3.org/International/questions/qa-html-dir" },
        { text: "MDN: CSS logical properties and values", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values" },
        { text: "PHP manual: PCRE pattern modifiers, including u", url: "https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php" },
        { text: "Google Fonts: Noto Nastaliq Urdu", url: "https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu" },
        { text: "Vitafolio on Crowdin, where anyone can suggest translations", url: "https://crowdin.com/project/vitafolio" },
        { text: "W3C: inline markup and bidirectional text in HTML", url: "https://www.w3.org/International/articles/inline-bidi-markup/" },
        { text: "Laravel documentation: localisation", url: "https://laravel.com/framework/docs/13.x/localization" },
        { text: "Vitafolio documentation", url: "https://vitafolio.isaacadjei.me/docs" },
      ],
    },
  ],
}

export default _website_in_seven_languages
