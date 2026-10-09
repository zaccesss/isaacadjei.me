import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 10,
  slug: "issue-10-learning-to-code",
  title: "Learning to code and getting ready for term",
  subtitle: "Eleven things I would tell anyone starting out, how I set up a new term and five lessons from CSS, git, shells, cooking and Ghanaian names.",
  tags: ["Learning", "Programming", "Beginner", "Advice", "Career"],
  date: "2026-09-18",
  published: true,
  intro: [
    { type: "p", text: "The summer is wrapping up and a new term is close, so this fortnight looked both back and forward. Looking back, most of what I wanted from the summer happened: the write-ups got done and the fundamentals got real time." },
    { type: "h2", text: "What I wrote" },
    { type: "p", text: "[Eleven Things That Actually Help When Learning to Code](/blog/eleven-things-learning-to-code) is not another argument about which language to learn first. It is about the habits underneath: reading error messages all the way through, typing examples out instead of pasting them and learning the debugger early. It also covers treating documentation as essential, using version control from day one, explaining a problem out loud after twenty minutes stuck, building things you want to exist, reading other people's code, consistency over intensity, understanding why before how and writing it all down." },
    { type: "h2", text: "From the notebook" },
    { type: "p", text: "[Getting ready for a new term](/notes/getting-ready-for-a-new-term) is what I do in the quiet week before the first lecture. Every fixed commitment goes into the calendar first, every module gets a folder with the same layout and every assessment date goes in one place. I also check my tools work and decide early which projects carry on during term and which pause until the next break." },
    { type: "h2", text: "Small things I learned" },
    {
      type: "ul",
      items: [
        "[Ghanaian day names](/til/ghanaian-naming-conventions) record the day of the week you were born, with Akan and Ga each keeping their own set.",
        "[CSS logical properties](/til/css-logical-properties-rtl) flip automatically in right-to-left layouts with no extra CSS.",
        "[git log --follow](/til/git-log-follow) keeps a file's history visible across renames.",
        "[Blooming spices in oil](/til/cooking-ghanaian-spice-depth) at the start of cooking gives a deeper flavour than adding them to water.",
        "[The order Bash and Zsh load dotfiles](/til/bash-dotfile-loading-order) explains why a PATH change sometimes does not stick.",
      ],
    },
  ],
}

export default issue
