import type { BlogPost } from "../index"

const _how_the_transistor_got_small: BlogPost = {
  slug: "how-the-transistor-got-small",
  title: "How the Transistor Got Small: From a Germanium Slab to Billions on a Chip",
  date: "2026-10-22",
  type: "article",
  cover_image: "/images/blog/covers/how-the-transistor-got-small.webp",
  cover_credit: "Photo: Laura Ockel, Unsplash Licence, via Unsplash",
  description:
    "A short history of the device inside every electronic product: the 1947 point-contact transistor, the integrated circuit, the MOSFET, Moore's law and why shrinking stopped being simple. Written for students who use microcontrollers without thinking about what is inside.",
  tags: ["Electronics", "Hardware", "Engineering", "Learning"],
  published: true,
  content: [
    {
      type: "p",
      text: "The ATmega644P I [programme in bare-metal C](/blog/avr-bare-metal-atmega644p) holds far more transistors than the first microprocessors, most of them in its memory. The laptop I write the code on has billions. Yet in electronics labs I still wire up single transistors on a breadboard, one at a time, each in a package I can pick up with my fingers. I wanted to understand how we got from one to the other, so this post is a short history of the transistor and the ideas that made it small.",
    },
    {
      type: "h2",
      text: "Before the transistor: valves",
    },
    {
      type: "p",
      text: "In the first half of the twentieth century, amplifying or switching an electrical signal meant a vacuum tube, which British engineers call a valve. Valves worked well but they were large, fragile, power hungry and hot because a filament had to glow inside each one. Early electronic computers used thousands of them and valves burning out was a routine maintenance problem. Telephone networks had the same issue at a much larger scale, which is why Bell Telephone Laboratories in the United States was searching for a solid-state replacement.",
    },
    {
      type: "h2",
      text: "1947: the point-contact transistor",
    },
    {
      type: "p",
      text: "In December 1947 [John Bardeen and Walter Brattain at Bell Labs](https://www.computerhistory.org/siliconengine/invention-of-the-point-contact-transistor/) pressed two closely spaced gold contacts onto a slab of germanium and showed that a small current through one contact could control a larger current through the other. It was an amplifier with no vacuum, no filament and no warm-up time. Their manager William Shockley, frustrated not to be part of the breakthrough, worked out the theory of a more robust design: the [junction transistor](https://www.computerhistory.org/siliconengine/conception-of-the-junction-transistor/), built from layers of differently doped semiconductor. It was the ancestor of the bipolar junction transistors still used in student labs today. The three shared the [1956 Nobel Prize in Physics](https://www.nobelprize.org/prizes/physics/1956/summary/).",
    },
    {
      type: "callout",
      tone: "note",
      text: "Doping means adding tiny amounts of other elements to a pure semiconductor. Phosphorus adds spare electrons (n-type) and boron leaves gaps called holes (p-type). Almost every semiconductor device is built from the junctions between n-type and p-type regions.",
    },
    {
      type: "p",
      text: "Early transistors were germanium, which was easier to purify but leaked current badly as it warmed up. In 1954 Texas Instruments produced the [first commercial silicon transistors](https://www.computerhistory.org/siliconengine/silicon-transistors-offer-superior-operating-characteristics/). Silicon works at higher temperatures and, crucially, it grows a stable insulating oxide layer when heated. That oxide turned out to be the key to everything that followed.",
    },
    {
      type: "h2",
      text: "1958 and 1959: the integrated circuit",
    },
    {
      type: "p",
      text: "Even with transistors, circuits were still built from separate components soldered together and more components meant more joints to fail. Engineers called this the tyranny of numbers. In 1958 [Jack Kilby at Texas Instruments built a working circuit](https://www.computerhistory.org/siliconengine/all-semiconductor-solid-circuit-is-demonstrated/) with a transistor, resistors and a capacitor all made from one piece of germanium, joined by fine gold wires. It was the first integrated circuit and it earned him a share of the [2000 Nobel Prize in Physics](https://www.nobelprize.org/prizes/physics/2000/kilby/facts/).",
    },
    {
      type: "p",
      text: "Kilby's chip proved the idea but it was hard to manufacture. At Fairchild Semiconductor, Jean Hoerni developed the [planar process](https://www.computerhistory.org/siliconengine/invention-of-the-planar-manufacturing-process/), which builds devices into a flat silicon surface protected by that oxide layer. Robert Noyce then [showed how to lay metal connections](https://www.computerhistory.org/siliconengine/practical-monolithic-integrated-circuit-concept-patented/) on top of the oxide, so a whole circuit could be made in one series of photographic and chemical steps. That is still, at heart, how chips are made.",
    },
    {
      type: "h2",
      text: "The MOSFET: the transistor that scaled",
    },
    {
      type: "p",
      text: "Also at Bell Labs, Mohamed Atalla and Dawon Kahng demonstrated the [metal oxide semiconductor field effect transistor](https://www.computerhistory.org/siliconengine/metal-oxide-semiconductor-mos-transistor-demonstrated/), the MOSFET, around 1959 and 1960. Instead of a current controlling a current, a voltage on a gate electrode, separated from the silicon by a thin oxide, controls whether a channel conducts. MOSFETs draw almost no gate current and they are simple enough to shrink. In 1963 Frank Wanlass at Fairchild paired n-type and p-type MOSFETs into [CMOS](https://www.computerhistory.org/siliconengine/complementary-mos-circuit-configuration-is-invented/), which draws significant power only while switching. The MOSFET is now the most manufactured device in human history and CMOS is the logic family inside nearly every chip.",
    },
    {
      type: "table",
      headers: ["Year", "Milestone", "Why it mattered"],
      rows: [
        ["1947", "Point-contact transistor, Bell Labs", "Solid-state amplification"],
        ["1954", "Commercial silicon transistor, Texas Instruments", "Heat tolerance and a usable oxide"],
        ["1958", "Kilby's integrated circuit", "Several components on one piece of semiconductor"],
        ["1959", "Planar process and Noyce's monolithic IC", "A manufacturable way to make whole circuits"],
        ["1959 to 1960", "MOSFET, Atalla and Kahng", "A transistor simple enough to shrink"],
        ["1963", "CMOS, Wanlass", "Very low standby power"],
        ["1971", "[Intel 4004](https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/)", "A whole processor on one chip, about 2,300 transistors"],
      ],
    },
    {
      type: "h2",
      text: "Moore's law and Dennard scaling",
    },
    {
      type: "p",
      text: "In 1965 Gordon Moore, then at Fairchild, wrote a [short article in Electronics magazine](https://www.cs.utexas.edu/~fussell/courses/cs352h/papers/moore.pdf) noting that the number of components on the most cost-effective chip was doubling roughly every year. In 1975 he revised the rate to about every two years. It was never a law of physics. It was an observation that became a target the whole industry planned around.",
    },
    {
      type: "p",
      text: "Moore's observation was about count. The reason it delivered faster chips as well was explained in 1974 by [Robert Dennard and colleagues at IBM](https://ieeexplore.ieee.org/document/1050511/). Dennard scaling says that if you shrink every dimension of a MOSFET and its voltage by the same factor, power density stays constant. Smaller transistors switch faster and use less power each, so for decades every new generation was faster without running hotter.",
    },
    {
      type: "h2",
      text: "When shrinking stopped being simple",
    },
    {
      type: "p",
      text: "Around the mid-2000s Dennard scaling broke down. Transistors had become so small that current leaked through gate oxides only a few atoms thick and supply voltages could not keep falling. Clock speeds stalled at a few gigahertz, which is why processors grew more cores instead of higher frequencies. The transistor itself had to change shape. In 2011 Intel moved to FinFETs, where the channel is a thin vertical fin wrapped by the gate on three sides for better control. The newest processes go further with gate-all-around designs, where the gate surrounds stacked ribbons of silicon on every side.",
    },
    {
      type: "p",
      text: "Moore's 1965 article is worth reading for how far ahead it looked. Writing when a chip held a few dozen components, he predicted home computers, automatic controls for cars and personal portable communications equipment. Every one of those arrived, carried by the transistor counts he forecast.",
    },
    {
      type: "p",
      text: "Process names such as '3 nm' no longer describe any physical feature on the chip. They are marketing labels for a generation. The counts are real, though: the largest processors today hold well over a hundred billion transistors.",
    },
    {
      type: "h2",
      text: "Why this matters to me as a student",
    },
    {
      type: "p",
      text: "Knowing this history changed how I read datasheets. The power figures for a microcontroller only make sense once you know CMOS burns power mostly when it switches, which is why lowering the clock or sleeping between interrupts saves so much battery. Leakage current specifications make sense once you know why tiny transistors leak. And the single transistor on my breadboard is not a museum piece. It is the same physics, just a few billion times bigger than its descendants.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Computer History Museum: invention of the point-contact transistor", url: "https://www.computerhistory.org/siliconengine/invention-of-the-point-contact-transistor/" },
        { text: "Computer History Museum: the MOS transistor demonstrated", url: "https://www.computerhistory.org/siliconengine/metal-oxide-semiconductor-mos-transistor-demonstrated/" },
        { text: "Computer History Museum: Moore's law predicts the future of integrated circuits", url: "https://www.computerhistory.org/siliconengine/moores-law-predicts-the-future-of-integrated-circuits/" },
        { text: "The Nobel Prize in Physics 1956", url: "https://www.nobelprize.org/prizes/physics/1956/summary/" },
        { text: "The Nobel Prize: Jack Kilby, Physics 2000", url: "https://www.nobelprize.org/prizes/physics/2000/kilby/facts/" },
        { text: "Gordon Moore (1965): Cramming more components onto integrated circuits (PDF)", url: "https://www.cs.utexas.edu/~fussell/courses/cs352h/papers/moore.pdf" },
        { text: "Dennard et al. (1974): Design of ion-implanted MOSFETs with very small physical dimensions, IEEE Journal of Solid-State Circuits", url: "https://ieeexplore.ieee.org/document/1050511/" },
        { text: "Computer History Museum: scaling of IC process design rules quantified", url: "https://www.computerhistory.org/siliconengine/scaling-of-ic-process-design-rules-quantified/" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "RdYHljZi7ys",
      title: "engineerguy (Bill Hammack): How the first transistor worked",
    },
    {
      type: "spotify",
      episodeId: "1rgEI0RtWnyOwHCnmnFeiq",
      title: "Everything Everywhere Daily: Transistors",
    },
  ],
}

export default _how_the_transistor_got_small
