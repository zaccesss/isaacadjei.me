import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  number: 0,
  slug: "issue-00-hello",
  title: "Hello: who I am and why I am writing",
  subtitle: "Who I am, what made me start a newsletter and what each issue will bring.",
  tags: ["Personal", "Engineering", "Writing"],
  date: "2026-04-30",
  published: true,
  greeting: "Hello,",
  signOff: "Thanks for reading,",
  intro: [
    { type: "p", text: "Before the first proper issue, I wanted to write you a letter that explains who is on the other end of it." },
    { type: "h2", text: "Who I am" },
    { type: "p", text: "My name is Isaac Adjei. Most people call me Zac. I study Electronic Engineering and Computer Science at Aston University in Birmingham. I spend most of my time where hardware and software meet: microcontrollers, sensors and the software that makes sense of what they measure." },
    { type: "p", text: "I grew up in Ghana. At two years old I lost the sight in my right eye after surgery. That shaped a lot of what came after, including how I think about technology. When reading lecture slides was hard, I built a tool that turned photos of slides into high-contrast, large-text notes. Constraints have a way of becoming direction." },
    { type: "p", text: "My father was a mechanical and refrigeration engineer. In the school holidays I went to work with him and watched him fix things other people had given up on. He used to say: always strive to make things better. I lost him in 2021 and engineering became, in part, a way of carrying that forward. In 2022 I moved to the UK and started again in a new country, in a subject I had never formally studied. The longer version is in [my journey so far](/blog/my-journey-so-far)." },
    { type: "h2", text: "What I am building" },
    { type: "p", text: "Right now that means [PHAEMOS](/projects/phaemos), a predictive maintenance platform that listens to machines for signs they are about to fail. It also means [Vitafolio](/projects/vitafolio), a place to build and share every version of a CV, plus smaller projects in bare-metal C, PCBs and LEDs. Each one teaches me something I could not have learned from a textbook." },
    { type: "h2", text: "Why a newsletter" },
    { type: "p", text: "I learn something most days and forget most of it within a week. Writing is how I stop that from happening. The blog holds the long write-ups. The TIL log holds the small things. The notes hold how I organise the rest of my life. A newsletter ties them together into something you can read in one sitting." },
    { type: "p", text: "I also write for the person a few steps behind me. When I was starting out I would have loved an honest account from someone who was figuring it out at the same time, not years later. If you are new to engineering, studying far from home or learning to work around a disability, I hope some of this helps." },
    { type: "h2", text: "What to expect" },
    {
      type: "ul",
      items: [
        "A short letter every couple of weeks on what I have been building and learning.",
        "Everything I published since the last issue underneath it: blog posts, TILs and notes, each with a line on what it covers.",
        "In the weeks between, a short Outside issue on one thing beyond my own work that is worth hearing about: a launch, a release or a moment in engineering history.",
        "Honest notes on what went wrong as well as what worked.",
        "No sponsors and no adverts. Just the work.",
      ],
    },
    { type: "p", text: "Every issue also lives on [the newsletter page](/newsletter) with reactions and comments, so you can reply there or just hit reply to the email. I read everything." },
    { type: "p", text: "Thank you for being here at the very start." },
  ],
}

export default issue
