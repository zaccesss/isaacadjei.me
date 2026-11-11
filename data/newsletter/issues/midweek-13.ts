import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 13,
  slug: "midweek-13-penalty-shootout-pressure",
  title: "Why penalty shoot-outs are a test of nerve",
  subtitle: "Research on penalty shoot-outs shows that pressure, not skill, decides many of them.",
  tags: ["Psychology", "Football", "Sport"],
  date: "2026-11-11",
  published: true,
  intro: [
    { type: "p", text: "A penalty kick from 12 yards should be easy for a professional. In a shoot-out it often is not. The reason has more to do with the mind than the foot." },
    { type: "image", src: "/images/newsletter/penalty-kick.jpg", alt: "A player runs up to take a penalty in a professional match while the goalkeeper waits on the line and the referee watches", caption: "A penalty in a 2013 match. Photo: md.faisalzaman, CC BY 2.0, via Wikimedia Commons" },
    { type: "h2", text: "What the research found" },
    { type: "p", text: "Working at the University of Groningen at the time, Geir Jordet and his colleagues analysed 41 shoot-outs comprising 409 penalty kicks from the World Cup, the European Championships and the Copa America between 1976 and 2004. On the first kick, when the pressure is relatively low, 87 per cent were scored. The success rate then dropped, down to 73 per cent for the fourth kick, when the pressure is often higher." },
    { type: "p", text: "Fatigue plays a part, but Jordet's team found it could not account for all of the difference. Jordet, now a professor at the Norwegian School of Sport Sciences, wrote a book on the subject: Pressure: Lessons from the Psychology of the Penalty Shootout. Speaking about the 2026 World Cup he said: \"In our research, the only emotion everyone agrees is present is anxiety.\" He also noted that players who rush their kick sometimes do so because they just want the stressful moment to be over." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "The same pattern shows up far from a football pitch: in exams, interviews and presentations, the stakes change the performance as much as the skill does. Players prepare their technique for years and their response to pressure much less. Two lessons seem to carry over: practise under realistic pressure and take your time rather than rushing to escape it." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Penalty kicks all in the mind](https://www.nature.com/news/2007/070115/full/news070115-12.html) from Nature News",
        "[Penalty shootouts at the World Cup are a drama of inhumane pressure](https://wtop.com/sports/2026/06/penalty-shootouts-at-the-world-cup-are-a-drama-of-inhumane-pressure/) from the Associated Press via WTOP",
      ],
    },
  ],
}

export default issue
