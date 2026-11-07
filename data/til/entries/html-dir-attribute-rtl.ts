import type { TILEntry } from "../index"

const _html_dir_attribute_rtl: TILEntry = {
    id: "html-dir-attribute-rtl",
    title: "Set dir=\"rtl\" on the html element, not direction in CSS",
    date: "2026-11-07",
    category: "Web",
    published: true,
    body: "For Arabic and Urdu pages the base direction belongs in the markup: `<html lang=\"ar\" dir=\"rtl\">`. The [W3C advises](https://www.w3.org/International/questions/qa-html-dir) against setting it with the CSS `direction` property because direction is part of the content and must still be there when the stylesheet is not. For text supplied at run time that could go either way, such as a name in a list, use `dir=\"auto\"` or a [`<bdi>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdi) element. Either one lets the browser decide per element. Vitafolio's Arabic and Urdu locales are built this way.",
    detail: [
      {
        type: "code",
        lang: "blade",
        code: `@php($rtl = in_array(app()->getLocale(), ['ar', 'ur']))
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ $rtl ? 'rtl' : 'ltr' }}">

{{-- a user's name could be in any script --}}
<li><bdi>{{ $member->name }}</bdi>: {{ $member->role }}</li>`,
        caption: "One layout serves every locale: the direction follows the language",
      },
      {
        type: "note",
        text: "Getting `dir` right is the first half. The second is CSS logical properties (`margin-inline-start` rather than `margin-left`), which then flip on their own.",
      },
    ],
    tags: ["i18n", "RTL", "HTML", "accessibility"],
    source: { label: "W3C: structural markup and right-to-left text in HTML", url: "https://www.w3.org/International/questions/qa-html-dir" },
    project: { name: "Vitafolio", url: "https://vitafolio.isaacadjei.me", slug: "vitafolio" },
  }

export default _html_dir_attribute_rtl
