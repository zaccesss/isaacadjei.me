import type { BlogPost } from "../index"

const _how_knuth_built_tex: BlogPost = {
  slug: "how-knuth-built-tex",
  title: "How Donald Knuth Built TeX Because His Book Looked Wrong",
  date: "2026-11-10",
  type: "article",
  cover_image: "/images/blog/covers/how-knuth-built-tex.webp",
  cover_credit: "Photo: Bret Lama, Unsplash Licence, via Unsplash",
  description:
    "The story of TeX: a computer scientist unhappy with the proofs of his own book, a sabbatical that turned into a decade, a line-breaking algorithm still admired today and a program whose version number is slowly becoming pi.",
  tags: ["Software Engineering", "Algorithms", "Writing", "Open Source", "Learning"],
  published: true,
  content: [
    {
      type: "p",
      text: "Almost every maths-heavy paper, thesis and a surprising number of CVs are typeset with a program written by one person in the late 1970s. That program is [TeX](https://tug.org/whatis.html). The reason it exists is wonderfully ordinary: Donald Knuth thought his book looked ugly.",
    },
    {
      type: "p",
      text: "I came to this story sideways. I recently added a LaTeX editor to [Vitafolio](https://vitafolio.isaacadjei.me), my CV platform. I wanted to understand what I was actually running. The history turned out to be one of the best stories in computing.",
    },
    {
      type: "h2",
      text: "A book that came back looking wrong",
    },
    {
      type: "p",
      text: "Knuth's life work is [The Art of Computer Programming](https://www-cs-faculty.stanford.edu/~knuth/taocp.html), a multi-volume series on algorithms whose first volume appeared in 1968. The early volumes were typeset in hot metal on Monotype machines, a craft that produced beautiful mathematics. By the mid-1970s that craft was dying. When the second edition of volume 2 was prepared, the publisher had moved to phototypesetting and the galley proofs that came back looked poor to Knuth, especially the mathematics.",
    },
    {
      type: "p",
      text: "Around the same time he saw the output of a high-resolution digital typesetter. His insight was that a printed page is, in the end, a pattern of tiny dots of ink. Deciding where those dots go is a computing problem. And computing problems were something he knew how to solve.",
    },
    {
      type: "h2",
      text: "A sabbatical that took about ten years",
    },
    {
      type: "p",
      text: "Knuth started work on a typesetting system in 1977, expecting it to take a year or so. The first version, now called TeX78, was written in a language called SAIL. It worked well enough to show the idea, but he then rewrote the whole thing from scratch as TeX82, together with Metafont, a separate program for designing fonts mathematically. He also designed the Computer Modern typefaces with it.",
    },
    {
      type: "table",
      headers: ["Year", "Milestone"],
      rows: [
        ["1968", "The first volume of The Art of Computer Programming"],
        ["1977", "Work on TeX begins"],
        ["1978", "The first version, TeX78"],
        ["1981", "Knuth and Michael Plass publish their paragraph line-breaking algorithm"],
        ["1982", "TeX82, the complete rewrite that modern TeX descends from"],
        ["1980s", "Leslie Lamport writes LaTeX, a set of macros on top of TeX"],
        ["1989", "TeX 3.0 adds full 8-bit character support"],
        ["1994", "LaTeX2e, the version still in use"],
        ["2021", "TeX 3.141592653"],
      ],
    },
    {
      type: "p",
      text: "The name is pronounced 'tech'. The letters are the Greek capitals tau, epsilon and chi, from the root of words such as technology and the Greek τέχνη, meaning art or craft. The X is a chi, which is why it is not pronounced like the X in 'Texas'.",
    },
    {
      type: "h2",
      text: "Breaking paragraphs into lines",
    },
    {
      type: "p",
      text: "The technical heart of TeX is its line-breaking algorithm, published by Knuth and Michael Plass in 1981 in a paper called [Breaking Paragraphs into Lines](https://en.wikipedia.org/wiki/Knuth%E2%80%93Plass_line-breaking_algorithm). A word processor of the time typically filled lines greedily: put as many words on the current line as fit, then move to the next. That is fast, but one awkward word can leave a line horribly stretched. The algorithm never goes back to fix it.",
    },
    {
      type: "p",
      text: "TeX looks at the whole paragraph at once. It models text as boxes (the words), glue (the spaces, which can stretch and shrink) and penalties (places where breaking is more or less desirable, such as a hyphen). Every possible set of line breaks gets a score, called demerits, based on how much each line has to stretch or squash. Dynamic programming then finds the set of breaks with the lowest total, without trying every combination.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    A["Paragraph"] --> B["Boxes, glue and penalties"]
    B --> C["Score each possible line:<br/>how far it stretches"]
    C --> D["Dynamic programming over<br/>all feasible breakpoints"]
    D --> E["Breaks with the lowest<br/>total demerits"]`,
      caption: "TeX chooses all the line breaks in a paragraph together, not one line at a time.",
    },
    {
      type: "p",
      text: "The result is the even, calm texture that makes TeX documents recognisable. Variations of the idea are now used well outside TeX. I like it as a reminder that a greedy algorithm is often good enough, but rarely the best.",
    },
    {
      type: "h2",
      text: "A program that is meant to stop changing",
    },
    {
      type: "p",
      text: "Knuth made an unusual decision for a piece of software: TeX would be finished. New features are not added. Only bugs are fixed. With each fix the version number gains another digit of pi: 3.14, 3.141, 3.1415 and so on. Metafont's version converges on e in the same way. Knuth has said that when he dies the version will become exactly pi and any remaining bugs will become features.",
    },
    {
      type: "p",
      text: "He also [pays people who find errors](https://www-cs-faculty.stanford.edu/~knuth/faq.html) in his books and in TeX. The famous reward cheques started at $2.56, one 'hexadecimal dollar'. The reward for TeX bugs doubled over time. Very few people cash them. Many frame them instead.",
    },
    {
      type: "quote",
      text: "Beware of bugs in the above code; I have only proved it correct, not tried it.",
      source: "Donald Knuth, in a 1977 memo",
    },
    {
      type: "h2",
      text: "Literate programming",
    },
    {
      type: "p",
      text: "TeX82 was written in WEB, a [literate programming](https://www-cs-faculty.stanford.edu/~knuth/lp.html) system Knuth invented so a program could be written as an essay for people to read, with the code woven through it. One tool extracts compilable Pascal and another produces a beautifully typeset book of the program. The source of TeX is published as a book, TeX: The Program. Few projects follow the method strictly today, but the idea that code should be written to be read by humans first has aged very well.",
    },
    {
      type: "h2",
      text: "LaTeX and TeX today",
    },
    {
      type: "p",
      text: "Most people never write raw TeX. They write [LaTeX](https://www.latex-project.org/about/), Leslie Lamport's layer of macros that lets an author describe structure, such as a section or an equation. The layout is left to a document class.",
    },
    {
      type: "code",
      lang: "latex",
      text: `\\documentclass{article}
\\begin{document}
\\section{Ohm's law}
The current through a resistor is
\\begin{equation}
  I = \\frac{V}{R}
\\end{equation}
\\end{document}`,
    },
    {
      type: "p",
      text: "Modern distributions such as [TeX Live](https://tug.org/texlive/) bundle thousands of packages and several engines, including pdfLaTeX, XeLaTeX and LuaLaTeX. In Vitafolio, TeX Live itself is [compiled to WebAssembly](https://github.com/zaccesss/vitafolio-latex) and runs inside the browser, so a CV written in LaTeX compiles without any server. A program first written for mainframes now runs inside a web page. It still produces the same output. That stability is exactly what Knuth was aiming for. The editor is described on the [Vitafolio project page](/projects/vitafolio).",
    },
    {
      type: "clip",
      src: "/videos/projects/vitafolio/compile.mp4",
      poster: "/videos/projects/vitafolio/compile.webp",
      alt: "The LaTeX editor compiles the classic template in the browser, the PDF appears in the preview pane and is then saved to the CV",
      caption: "TeX Live compiled to WebAssembly, typesetting a CV template inside the browser.",
    },
    {
      type: "h2",
      text: "What I take from it",
    },
    {
      type: "ul",
      items: [
        "Caring about quality in the output, not just the code, can be worth years of work.",
        "A well-chosen algorithm can outlive every machine it was designed for.",
        "Deciding a program is finished is a feature. Stability is why a 40-year-old document still compiles today.",
      ],
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Donald Knuth: Computers and Typesetting", url: "https://www-cs-faculty.stanford.edu/~knuth/abcde.html" },
        { text: "TeX Users Group: what is TeX?", url: "https://tug.org/whatis.html" },
        { text: "The LaTeX Project: about LaTeX", url: "https://www.latex-project.org/about/" },
        { text: "Wikipedia: Knuth and Plass line-breaking algorithm", url: "https://en.wikipedia.org/wiki/Knuth%E2%80%93Plass_line-breaking_algorithm" },
        { text: "Donald Knuth: frequently asked questions, including why he pays $2.56 per error", url: "https://www-cs-faculty.stanford.edu/~knuth/faq.html" },
        { text: "Donald Knuth: literate programming", url: "https://www-cs-faculty.stanford.edu/~knuth/lp.html" },
        { text: "TeX Users Group: TeX Live", url: "https://tug.org/texlive/" },
        { text: "Vitafolio's in-browser LaTeX engine", url: "https://github.com/zaccesss/vitafolio-latex" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "9IM_dqjBkIw",
      title: "Donald Knuth on the origins of TeX (Turing Award interview clip, YouTube)",
    },
    {
      type: "video",
      youtubeId: "emmBqIO46Qg",
      title: "Donald Knuth on designing and implementing TeX (Turing Award interview clip, YouTube)",
    },
    {
      type: "spotify",
      episodeId: "5ZOcvwIfzTt5g1QnS5FN9m",
      title: "Lex Fridman Podcast: Donald Knuth on algorithms, TeX and The Art of Computer Programming",
    },
  ],
}

export default _how_knuth_built_tex
