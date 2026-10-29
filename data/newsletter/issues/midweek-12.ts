import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "midweek",
  number: 12,
  slug: "midweek-12-chelsea-clean-sheet",
  title: "Chelsea's long wait for a clean sheet is over",
  subtitle: "Chelsea went 23 top-flight matches without a clean sheet. The run finally ended at Everton on 17 October.",
  tags: ["Football", "Chelsea", "Sport"],
  date: "2026-10-28",
  published: true,
  intro: [
    { type: "p", text: "I support Chelsea, so this one is personal. By the September international break Chelsea had gone 21 Premier League matches without a clean sheet. Under Xabi Alonso they were still waiting for their first one, sitting 10th in the table." },
    { type: "image", src: "/images/newsletter/stamford-bridge.jpg", alt: "Inside Stamford Bridge during a Chelsea match, with full stands of blue seats and the pitch below", caption: "Stamford Bridge. Photo: Richard Humphrey, CC BY-SA 2.0, via Wikimedia Commons" },
    { type: "h2", text: "How long is long" },
    { type: "p", text: "The club's own worst run is 31 league matches without a shutout, set across 1961 and 1962. Chelsea were not the only side in the league still without a clean sheet that season either. Three other teams were in the same position at the break. The difference is that for a squad built to challenge near the top, a run that long says something about how the team defends as a whole." },
    { type: "p", text: "Clean sheets are rarely down to the goalkeeper alone. They come from the shape of the whole side: how high the defensive line sits, how quickly the midfield wins the ball back and how many chances the team allows in the first place. A new manager changing all of that at once often costs goals before it saves them." },
    { type: "h2", text: "How it ended" },
    { type: "p", text: "On Saturday 17 October Chelsea won 2-0 away at Everton and kept their first Premier League clean sheet in nine months. ESPN counts it as the first in 23 top-flight matches. Pedro Neto scored both goals: the first 43 seconds after half-time and the second in the 90th minute." },
    { type: "p", text: "It was not a quiet afternoon at the back either. Emi Martinez went off with a head injury in the second half and the young goalkeeper who replaced him, on his debut, saw the clean sheet through. The result was Everton's first league defeat of the season and Chelsea's first win at Everton since August 2022. It moved Xabi Alonso's side on to 13 points from seven games." },
    { type: "h2", text: "Why I find it interesting" },
    { type: "p", text: "Football is full of runs like this that feel like a curse while you are in them. This one lasted nine months, then ended in an away game against a side that had not lost all season. It is a reminder that one statistic can tell a long story about a team. The story can also turn in a single afternoon." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Everton 0-2 Chelsea: Pedro Neto scores twice](https://www.skysports.com/football/everton-vs-chelsea/6750641124462809232) from Sky Sports",
        "[Everton 0-2 Chelsea match report](https://www.espn.com/soccer/report/_/gameId/401878771) from ESPN",
        "[How close are Chelsea to making English football history?](https://www.sportsmole.co.uk/football/chelsea/news/chelsea-clean-sheet-woes-how-close-are-blues-to-setting-unwanted-english-football-records_605662.html) from Sports Mole",
      ],
    },
  ],
}

export default issue
