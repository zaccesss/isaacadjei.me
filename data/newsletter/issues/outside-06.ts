import type { NewsletterIssueFile } from "../index"

const issue: NewsletterIssueFile = {
  kind: "outside",
  number: 6,
  slug: "outside-06-robotic-satellite-servicing",
  title: "A robot mechanic heads for geosynchronous orbit",
  subtitle: "A spacecraft with two robotic arms launched to refuel and repair satellites far above Earth.",
  tags: ["Space", "Robotics", "Engineering"],
  date: "2026-07-31",
  published: true,
  intro: [
    { type: "p", text: "On 21 July 2026 a SpaceX Falcon 9 lifted off from Cape Canaveral carrying Northrop Grumman's Mission Robotic Vehicle along with three Mission Extension Pods. The vehicle carries the Robotic Servicing of Geosynchronous Satellites payload, known as RSGS: a pair of robotic arms with a set of tool attachments, developed with the U.S. Naval Research Laboratory and funded by DARPA. DARPA describes it as the first privately owned, operational robotic servicing mission for satellites in geosynchronous orbit." },
    { type: "image", src: "/images/newsletter/mission-robotic-vehicle.jpg", alt: "Northrop Grumman's Mission Robotic Vehicle, a large spacecraft with robotic arms, standing in a test facility", caption: "The Mission Robotic Vehicle after thermal testing at the U.S. Naval Research Laboratory. U.S. Navy photo by Sarah Peterson, public domain, via Wikimedia Commons" },
    { type: "p", text: "The plan is patient. The vehicle will spend about a year travelling out to geosynchronous orbit on electric propulsion. Once there, it will install the extension pods on client satellites, including ones owned by Optus and SES. Each pod carries fresh manoeuvring fuel and is designed to give a satellite up to eight more years of life. The vehicle itself is expected to work for more than a decade." },
    { type: "h2", text: "Why it matters to engineers" },
    { type: "p", text: "A satellite can still have working electronics when its manoeuvring fuel runs low. Servicing changes the design question from how long something lasts to how it can be maintained. That means docking interfaces, tool drives and arms with seven joints each that have to work reliably with no technician anywhere near them." },
    { type: "p", text: "Predictive maintenance is a big part of what I build, so this one stands out. The idea of extending the life of hardware that is already working, instead of replacing it, is the same idea at a very different altitude." },
    { type: "h2", text: "Further reading" },
    {
      type: "ul",
      items: [
        "[Robotic Servicing of Geosynchronous Satellites lifts off (DARPA)](https://www.darpa.mil/news/2026/robotic-servicing-of-geosynchronous-satellites-lifts-off)",
        "[SpaceX launches novel geosynchronous robotic servicing satellite (Spaceflight Now)](https://spaceflightnow.com/2026/07/21/live-coverage-spacex-to-launch-novel-geosynchronous-robotic-servicing-satellite-on-decade-long-mission/)",
      ],
    },
  ],
}

export default issue
