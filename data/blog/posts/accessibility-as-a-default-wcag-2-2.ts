import type { BlogPost } from "../index"

const _accessibility_as_a_default_wcag_2_2: BlogPost = {
  slug: "accessibility-as-a-default-wcag-2-2",
  title: "Accessibility as a Default, Not a Feature: WCAG 2.2 AA in Practice",
  date: "2026-10-03",
  type: "blog",
  cover_image: "/images/blog/covers/accessibility-as-a-default-wcag-2-2-shot.webp",
  cover_image_dark: "/images/blog/covers/accessibility-as-a-default-wcag-2-2-shot-dark.webp",
  description:
    "What building Vitafolio to WCAG 2.2 AA actually involved: contrast in two themes, alternatives to dragging, sign-in without puzzles and why I now treat an accessibility problem as a bug.",
  tags: ["Accessibility", "Web", "WebDev", "BestPractices", "PHP"],
  projectSlug: "vitafolio",
  published: true,
  content: [
    {
      type: "p",
      text: "When I started [Vitafolio](https://vitafolio.isaacadjei.me), my CV platform, I wrote one line in the plan that shaped everything after it: the site aims for WCAG 2.2 AA throughout. Not a later pass, not an accessibility sprint before launch. A CV site is only useful if everyone can build a CV on it and everyone can read the result, so accessibility had to be part of the definition of done for every page. This post is what that meant in practice, which criteria caught me out and the habits I would carry into any project.",
    },
    {
      type: "h2",
      text: "What WCAG 2.2 AA actually asks for",
    },
    {
      type: "p",
      text: "The [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) are organised into success criteria at three levels: A, AA and AAA. AA is the level most laws and procurement rules point at, so it is the sensible target for a public product. Version 2.2 became a W3C Recommendation in October 2023 and added nine new criteria to 2.1. Several of them are about things that are easy to get wrong in a modern interface.",
    },
    {
      type: "table",
      headers: ["Criterion", "Level", "What it means in plain words"],
      rows: [
        ["[2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)", "AA", "A focused control must not be completely hidden behind a sticky header, banner or popup"],
        ["[2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)", "AA", "Anything you can drag must also work with single clicks or taps"],
        ["[2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)", "AA", "Click targets are at least 24 by 24 CSS pixels or have enough space around them"],
        ["[3.2.6 Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html)", "A", "Help links sit in the same place on every page"],
        ["[3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)", "A", "Do not make people type the same information twice in one process"],
        ["[3.3.8 Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)", "AA", "Signing in must not depend on a memory test or puzzle unless there is an alternative"],
      ],
      caption: "The new WCAG 2.2 criteria that mattered most for Vitafolio.",
    },
    {
      type: "h2",
      text: "Contrast in two themes",
    },
    {
      type: "p",
      text: "Normal text needs a contrast ratio of at least 4.5:1 against its background at AA, large text needs 3:1 and so do the edges of controls and focus indicators. Meeting that in one theme is straightforward. Meeting it in a light and a dark theme at the same time is where mistakes hide. A grey that reads well on white can vanish on near-black and a brand colour that looks vivid in dark mode can fail on a white card.",
    },
    {
      type: "p",
      text: "Vitafolio lets each person pick an accent colour for their CV, which made the problem harder. Every accent in the list is checked for contrast in both themes, so nobody can pick a colour that makes their own headings unreadable. Badges, statuses and links also carry text or an icon as well as colour, because colour alone fails anyone who cannot tell two hues apart.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "Check contrast with real values rather than by eye. [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/) takes two hex codes and tells you the ratio and which levels it passes. I keep it open whenever I touch a colour token.",
    },
    {
      type: "h2",
      text: "Dragging is never the only way",
    },
    {
      type: "p",
      text: "Two parts of Vitafolio started out drag only: reordering CV sections and framing a profile photo inside a circle. Both failed 2.5.7 the moment I tried them with a keyboard. Section order now has move up and move down buttons beside each item and the photo framer responds to the arrow keys and a zoom slider as well as dragging. The drag still works for people who like it. It is just no longer the only path.",
    },
    {
      type: "clip",
      src: "/videos/projects/vitafolio/profile.mp4",
      poster: "/videos/projects/vitafolio/profile.webp",
      alt: "A photo is chosen, zoomed and dragged into the circle, then uploaded. The handle changes and Connected accounts shows Google and GitHub connected with Microsoft ready to connect",
      caption: "The photo framer works by dragging, with the zoom slider or with the arrow keys.",
    },
    {
      type: "code",
      lang: "javascript",
      text: `// dragging is a convenience; the move buttons do the same job from the keyboard
Sortable.create(list.value, {
  handle: '[data-drag]',
  // the animation is decoration, so it is switched off when the device asks
  animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150,
  onEnd: ({ oldIndex, newIndex }) => reorder(oldIndex, newIndex),
})

// the up and down buttons call the same reorder and announce the new position
function move(index, delta) {
  reorder(index, index + delta)
}`,
    },
    {
      type: "p",
      text: "That last comment is the real lesson. Both paths end in the same reorder and save. Each move is announced to screen readers with the section's new position. When the keyboard path and the pointer path call the same function, the keyboard version cannot quietly fall behind. When they are separate implementations, one of them always rots.",
    },
    {
      type: "h2",
      text: "Signing in without a memory test",
    },
    {
      type: "p",
      text: "Criterion 3.3.8 changed how I thought about authentication. Copying a six digit code from an authenticator app is a cognitive test if the field blocks paste or splits the code across six boxes that fight the clipboard. In Vitafolio every field allows paste, codes can be pasted whole and passkeys or recovery codes can stand in for an authenticator app. Bot protection uses [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/), which normally needs no interaction at all, rather than an image puzzle.",
    },
    {
      type: "h2",
      text: "Structure that screen readers can follow",
    },
    {
      type: "ul",
      items: [
        "Real headings in order and landmarks for the header, navigation, main content and footer.",
        "A label on every field. Placeholder text is not a label because it disappears as soon as someone types.",
        "Form errors listed at the top of the form, each one linked to its field, as well as shown beside the field.",
        "Live announcements for actions with no page change, such as a saved section or a copied link.",
        "Pages that [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) at 400% zoom without sideways scrolling.",
        "A Plain CV theme built for screen readers and applicant tracking systems, plus tagged PDFs that declare their language.",
      ],
    },
    {
      type: "h2",
      text: "Making it a habit rather than a project",
    },
    {
      type: "p",
      text: "The most useful change was not technical. Every pull request template in the project has a checkbox that says the pages I touched work with a keyboard and keep AA contrast in light and dark themes. It takes a minute to honour and it means accessibility is checked at the point where a change is cheapest to fix. The repository also has an accessibility issue form, so a barrier can be reported with the same weight as any other bug.",
    },
    {
      type: "quote",
      text: "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect.",
      source: "Tim Berners-Lee",
    },
    {
      type: "p",
      text: "I also write down what is not yet good enough. Vitafolio's [accessibility statement](https://vitafolio.isaacadjei.me/accessibility) lists its known gaps: PDFs compiled from LaTeX may lack the tags screen readers need and uploaded files are only as accessible as their authors made them. A statement that promises only what is true in every case is worth more than one that sounds impressive.",
    },
    {
      type: "h2",
      text: "Where to start on your own project",
    },
    {
      type: "ol",
      items: [
        "Unplug the mouse and use your site with Tab, Shift+Tab, Enter and the arrow keys for ten minutes.",
        "Run every colour pair in both themes through a contrast checker.",
        "Find anything that needs dragging, hovering or a precise gesture and add a button alternative.",
        "Turn on reduced motion in your operating system and see what still moves.",
        "Zoom to 400% and look for anything cut off or scrolling sideways.",
      ],
    },
    {
      type: "p",
      text: "None of this made Vitafolio slower to build once it was a habit. What it did was remove a whole category of late, expensive surprises. Accessibility treated as a default costs a little every day. Accessibility treated as a feature costs a lot at the worst possible moment. The rest of the build is on the [Vitafolio project page](/projects/vitafolio) and the [features page](https://vitafolio.isaacadjei.me/features).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "W3C: Web Content Accessibility Guidelines (WCAG) 2.2", url: "https://www.w3.org/TR/WCAG22/" },
        { text: "W3C WAI: What is new in WCAG 2.2", url: "https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/" },
        { text: "WebAIM contrast checker", url: "https://webaim.org/resources/contrastchecker/" },
        { text: "MDN: prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion" },
        { text: "Vitafolio accessibility statement", url: "https://vitafolio.isaacadjei.me/accessibility" },
        { text: "Vitafolio documentation", url: "https://vitafolio.isaacadjei.me/docs" },
        { text: "W3C WAI: Introduction to web accessibility", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
        { text: "My shared accessibility statement", url: "https://isaacadjei.me/accessibility" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "spotify",
      episodeId: "0zD6t6vBmPtekeb6js8svZ",
      title: "99% Invisible: Adapt or Design",
    },
  ],
}

export default _accessibility_as_a_default_wcag_2_2
