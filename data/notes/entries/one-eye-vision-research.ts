import type { NoteEntry } from "../index"

const oneEyeVisionResearch: NoteEntry = {
  slug: "one-eye-vision-research",
  title: "Could someone with one eye ever get a second working eye?",
  description:
    "A sourced look at every route to restoring sight in a missing eye: prosthetic eyes, retinal implants, cortical implants and whole-eye transplant. What exists today, what is experimental and what is still only a research goal.",
  ogTitle: "Could%20Someone%20With%20One%20Eye%20Ever%20Get%20a%20Second%20Working%20Eye%3F",
  ogDescription:
    "A%20sourced%20look%20at%20prosthetic%20eyes%2C%20retinal%20and%20cortical%20implants%20and%20whole-eye%20transplant%2C%20and%20what%20each%20could%20mean%20for%20one%20eye%2E",
  tags: ["Prosthetics", "Health Tech", "Research", "Vision", "Neuroscience"],
  lead:
    "I have lived with one working eye since I was two. The obvious question is whether anything exists or is close to existing that could give me a second one. I went looking for the actual evidence rather than the headlines. The honest short answer is no: there is no proven way today to restore sight in an eye that has been removed. What follows is what does exist, what is genuinely experimental and where each route runs into a wall. This is my reading of published sources and not medical advice.",
  body: [
    { type: "h2", text: "What a second eye would actually need" },
    {
      type: "p",
      text: "Seeing takes three things in a chain. A globe with a retina to turn light into electrical signals. An optic nerve to carry those signals into the brain. Then visual cortex that can make sense of them. When an eye is removed (enucleation) the globe, the retina and most of the optic nerve go with it. So any route to a second working eye has to either rebuild that whole chain or skip the front of it and talk to the brain directly.",
    },
    {
      type: "p",
      text: "My other eye works normally, which changes the question in an important way. Almost every project below is aimed at people who are blind in both eyes, because that is where the benefit clearly outweighs the risk. A person with one good eye is usually not a candidate. Later on I will show one reason that goes beyond eligibility rules.",
    },
    { type: "h2", text: "Route 1: a prosthetic eye (available now, cosmetic only)" },
    {
      type: "p",
      text: "This is what exists today. A prosthetic eye sits in front of an orbital implant and restores the look of the face and the shape of the socket. It does not see. The interesting change is in how they are made. Moorfields Eye Hospital in London has run a trial of fully digital 3D printed prosthetic eyes, built from a scan of the socket and a photo of the other eye, with the trial planned to follow around 40 patients for a year. It replaces an invasive two hour mould and shortens the process to two or three weeks. It is a better eye to look at, not a way to see.",
    },
    { type: "h2", text: "Route 2: retinal implants (not possible after enucleation)" },
    {
      type: "p",
      text: "Retinal prostheses such as the Argus II work by stimulating surviving cells in the retina. They need a retina and an optic nerve that still connect to the brain. They were built for conditions like retinitis pigmentosa where the light sensing cells are lost but the rest of the pathway survives. After enucleation there is no retina left to stimulate, so this whole family of devices is closed off. I covered how they work in my earlier note on prosthetics and health technology.",
    },
    { type: "h2", text: "Route 3: cortical implants (skip the eye entirely)" },
    {
      type: "p",
      text: "If the eye is gone, the logical alternative is to bypass it. Cortical visual prostheses put electrodes on or in the visual cortex and feed them from a camera. Two projects are worth knowing about. Both are earlier than the headlines suggest.",
    },
    {
      type: "list",
      items: [
        "Gennaris (Monash Vision Group, Australia): a camera on headgear, a processor and up to 11 wireless tiles in the visual cortex, each with 43 microelectrodes. It has shown long term biocompatibility in sheep and is preparing for first-in-human trials.",
        "Blindsight (Neuralink): a brain implant fed by a camera. It received an FDA Breakthrough Device designation in September 2024 and human trials have been announced, but I could not find any published human results. The company describes the expected first percepts as low resolution.",
      ],
    },
    {
      type: "p",
      text: "Even the best case here is coarse, pixel-like perception for people with no sight at all. For someone whose other eye works normally the trade is poor: brain surgery to gain a low resolution signal from a side that already has no eye. I would not expect to be offered it. I would not want it on today's evidence.",
    },
    { type: "h2", text: "Route 4: whole-eye transplant (the real frontier)" },
    {
      type: "p",
      text: "In May 2023 a team at NYU Langone performed the first whole-eye transplant, joining a donor eye and its optic nerve to a man who had lost an eye in an accident. A year on, the eye was alive, with normal pressure and blood flow. Tests showed the retina still responded electrically to light. But he could not see with it. The reason is the central unsolved problem of the field: an optic nerve is a cable of around a million nerve fibres. Nobody can yet make cut fibres regrow and reconnect to the right places in the brain.",
    },
    {
      type: "p",
      text: "The American Academy of Ophthalmology names three barriers: regrowing the optic nerve, keeping retinal ganglion cells alive and managing blood supply and immune rejection. The US research agency ARPA-H has committed up to 125 million dollars to a programme called THEA aimed at exactly this. The surgeons quoted expect human testing of nerve regeneration therapies over roughly the next decade. They expect the first candidates to be people who are blind in both eyes.",
    },
    {
      type: "p",
      text: "One line in the Academy's piece matters for me directly. For patients who still have one functional eye, newly regenerated fibres may interfere with those of the healthy eye, putting the patient at risk of losing vision they already have. For a one-eyed person that is not a technicality. The thing I would be trying to gain could damage the thing I have.",
    },
    { type: "h2", text: "The cancer question sits on top of all of it" },
    {
      type: "p",
      text: "My eye was lost to retinoblastoma. People who had the heritable form of the disease carry a higher lifelong risk of other cancers. Published follow-up studies of large groups put the second cancer rate at around a third by 50 years after diagnosis in hereditary cases, against far lower rates in the non-heritable form. Whether that applies to a given person depends on their genetics, which is a conversation for their own specialists. It matters here because a transplant needs long term immune suppression and implants mean surgery near the brain, so any future option would need sign-off from an oncologist who knows the whole history, not just an eye surgeon.",
    },
    { type: "h2", text: "What actually helps now" },
    {
      type: "list",
      items: [
        "Depth perception without a second eye: stereopsis (depth from two eyes) is not available, but the brain builds depth from motion parallax, relative size, overlap and texture. People who have used one eye for a long time often find their depth perception is perfectly acceptable.",
        "Protecting the good eye: with one working eye, eye protection during sport, DIY and work is worth taking seriously. Regular checks with an eye specialist matter more than they do for most people.",
        "A well made prosthesis: the cosmetic side is improving quickly and is a real quality of life gain.",
      ],
    },
    { type: "h2", text: "My conclusion" },
    {
      type: "p",
      text: "There is no proven, available way to give a person with one eye a second working eye. The nearest thing to a route is whole-eye transplant combined with optic nerve regeneration. That is a funded research goal with a decade of work ahead and a specific caution for people who still see with the other eye. Cortical implants are real engineering but aimed at total blindness and still pre-clinical or at first trials. That does not make the field boring to me. The problems it depends on, high channel count neural interfaces, flexible bio-integrated electronics and nerve regeneration, are exactly the engineering I want to work on.",
    },
    {
      type: "p",
      text: "What I will keep an eye on: the first published human results from a cortical implant, any demonstration that a transplanted optic nerve can carry a signal, plus how THEA-funded groups report their regeneration work. I will update this note when any of those move. My earlier write-up on how the devices themselves work is at /notes/prosthetics-health-tech.",
    },
  ],
  references: [
    { text: "NYU Langone: first whole-eye and partial-face transplant recipient one year on, with a viable eye", url: "https://nyulangone.org/news/worlds-first-whole-eye-partial-face-transplant-recipient-achieves-remarkable-recovery-viable-eye-one-year-after-landmark-surgery" },
    { text: "NYU Langone News: a bold vision for restoring eyesight", url: "https://nyulangone.org/news/bold-vision-restoring-eyesight" },
    { text: "American Academy of Ophthalmology EyeNet: eyes on the prize, the quest to restore vision with whole eye transplant", url: "https://www.aao.org/eyenet/article/eyes-on-the-prize-whole-eye-transplant" },
    { text: "ARPA-H: Transplantation of Human Eye Allografts (THEA) programme", url: "https://arpa-h.gov/explore-funding/programs/thea" },
    { text: "Monash Vision Group: the Gennaris bionic vision technology", url: "https://www.monash.edu/bioniceye/technology" },
    { text: "bionic-vision.org: Gennaris cortical implant", url: "https://www.bionic-vision.org/implants/gennaris" },
    { text: "Neuralink: visual prosthesis trials", url: "https://neuralink.com/trials/visual-prosthesis/" },
    { text: "Moorfields Eye Charity: 3D printed ocular prosthetics", url: "https://moorfieldseyecharity.org.uk/projects-we-fund/first-ever-patient-fitted-with-a-digital-3d-printed-prosthetic-eye" },
    { text: "American Academy of Ophthalmology: depth perception", url: "https://www.aao.org/eye-health/anatomy/depth-perception" },
    { text: "PMC: subsequent malignant neoplasms in retinoblastoma survivors", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8001190/" },
    { text: "City, University of London: second cancers following treatment for retinoblastoma", url: "https://openaccess.city.ac.uk/id/eprint/17330/" },
    { text: "American Cancer Society: hereditary retinoblastoma (RB1)", url: "https://www.cancer.org/cancer/risk-prevention/genetics/family-cancer-syndromes/hereditary-retinoblastoma.html" },
    { text: "Retinoblastoma UK: patient information, research and support", url: "https://www.retinoblastoma.org.uk" },
    { text: "PMC: can bionic eyes restore vision? A comprehensive review", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12659496/" },
  ],
}

export default oneEyeVisionResearch
