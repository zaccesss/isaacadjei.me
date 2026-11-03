import type { BlogPost } from "../index"

const _running_pal_sessions: BlogPost = {
  slug: "running-pal-sessions",
  title: "Running PAL Sessions: Teaching Python to My Peers",
  date: "2026-11-03",
  type: "journal",
  cover_image: "/images/blog/covers/running-pal-sessions.webp",
  cover_credit: "Photo: Vitaly Gariev, Unsplash Licence, via Unsplash",
  description:
    "What I have learned leading weekly Peer Assisted Learning sessions in Python: how a session is built, why the leader talks less than anyone and what teaching has done for my own understanding.",
  tags: ["Teaching", "Python", "Electronics", "University", "Learning", "Aston"],
  published: true,
  content: [
    {
      type: "p",
      text: "Every week I lead [Peer Assisted Learning](https://www.aston.ac.uk/library/learning-services/pal) sessions, known as PAL, for students on two core modules: one in Python programming and one in electronics. Being on the leading side has taught me more about learning than any study technique I have tried.",
    },
    {
      type: "p",
      text: "This post is about how the sessions actually run, the rules that shape them and a few things I got wrong early on. If you are thinking of becoming a PAL leader, a teaching assistant or just the friend everyone asks for help, I hope some of it is useful.",
    },
    {
      type: "h2",
      text: "What PAL is and what it is not",
    },
    {
      type: "p",
      text: "PAL is a scheme where trained students in later years run regular, informal sessions for students taking modules they have already completed. It is not extra teaching and the leader is not a lecturer. The whole point is that the students do the thinking and the talking.",
    },
    {
      type: "table",
      headers: ["PAL is", "PAL is not"],
      rows: [
        ["Voluntary: nobody has to attend", "A compulsory tutorial"],
        ["Confidential: what is said in the room stays there", "A report back to staff on who struggled"],
        ["For everyone, including strong students", "Remedial help only for people who are behind"],
        ["Student-led: the group sets the pace", "A lecture repeated by someone younger"],
        ["A place to practise with new examples", "A place to get coursework or lab answers checked"],
      ],
    },
    {
      type: "p",
      text: "The last row is the one people push on most. Someone always asks if I can just check their lab code. I cannot. That is a good rule. What I can do is give them a similar problem, ask questions until they can see what their own code is doing and let them go back to the lab with their own understanding.",
    },
    {
      type: "h2",
      text: "Anatomy of a one-hour session",
    },
    {
      type: "p",
      text: "Each Python session follows the same rough shape, which helps people settle quickly and helps me plan.",
    },
    {
      type: "ol",
      items: [
        "Welcome and where to find everything: the exact path to the worksheet and code files, read out and on screen.",
        "A short quiz on the previous week's topic, run in [Wayground](https://wayground.com) or [Kahoot](https://kahoot.com), about 15 questions from easy to hard.",
        "Worksheet time at three levels: Core with one star, Stretch with two and Challenge with three. Everyone starts on Core and nobody has to finish.",
        "A group activity such as a peer code review or a jigsaw, where small groups each master one part and teach it to the others.",
        "A recap, then a feedback survey QR code on the last slide.",
      ],
    },
    {
      type: "p",
      text: "Questions go out before or at the session. Solutions only go up afterwards, with one clear answer per question. Longer questions come with a starter Python file named after the question, so nobody loses ten minutes to typing boilerplate.",
    },
    {
      type: "h3",
      text: "Stars, words and hints",
    },
    {
      type: "p",
      text: "The difficulty levels use both a word and a star rating, never colour alone, because colour is the first thing to disappear on a projector and not everyone sees it the same way. Every Stretch and Challenge question has a hint box underneath. A hint is a nudge, never the answer: 'what does range(5) actually produce?' rather than 'use range(1, 6)'.",
    },
    {
      type: "h2",
      text: "The hardest skill: saying less",
    },
    {
      type: "p",
      text: "My instinct when someone is stuck is to explain. It feels helpful. It mostly is not. PAL training is strict about this: no talking at the room for more than two or three minutes, redirect questions back to the group first and wait ten to fifteen seconds after asking something before saying anything else.",
    },
    {
      type: "p",
      text: "That silence felt unbearable the first few times. It works though. Somebody almost always fills it. An answer from a peer sticks far better than one from me. When I do need to help, I ask questions instead of giving statements.",
    },
    {
      type: "code",
      lang: "python",
      text: `# a common week 3 bug: the loop never stops
count = 10
while count > 0:
    print(count)
count -= 1`,
    },
    {
      type: "p",
      text: "Faced with that code, I do not say 'your decrement is not indented'. I ask what the loop body contains, then what value count has after the first pass, then the second. By the third question the student has usually spotted it themselves and they will look for indentation first next time.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "If there is a room of nine or more, a jigsaw works well. With fewer, I switch to a 'you drive' activity: the room tells me what to type into [Thonny](https://thonny.org) for a fresh problem, using only what has been taught so far. I type exactly what they say, mistakes included.",
    },
    {
      type: "h2",
      text: "Electronics is different",
    },
    {
      type: "p",
      text: "Electronics sessions need a different approach because the hard part is usually a mental model rather than syntax. Students can recite Ohm's law but freeze when a circuit has two branches. What works best there is drawing: getting someone to redraw a circuit so all the nodes at the same voltage are visibly one line, then predicting a reading before checking it. Being wrong about a prediction teaches more than being told the answer.",
    },
    {
      type: "h2",
      text: "Preparation is most of the job",
    },
    {
      type: "p",
      text: "A good hour of PAL takes a lot more than an hour to prepare. Every week I build a worksheet with its own examples rather than reusing lab exercises, run every code snippet and every quiz answer before it goes anywhere and write a leader guide with the timings, the questions I plan to ask and the mistakes I expect to see. It sounds excessive, but a room of students will find an untested answer faster than any test suite.",
    },
    {
      type: "quote",
      text: "If you want to master something, teach it.",
      source: "A saying often attributed to Richard Feynman",
    },
    {
      type: "h2",
      text: "What it has done for me",
    },
    {
      type: "ul",
      items: [
        "My own understanding of Python basics is far deeper. Explaining why a list is mutable but a string is not forced me to really know it.",
        "I am much calmer speaking to a room, which carries over to presentations.",
        "Writing worksheets has made me better at technical writing: short instructions, exact file names and one idea per question.",
        "I notice when I am about to over-explain in other settings too, including team meetings.",
      ],
    },
    {
      type: "p",
      text: "If your university runs PAL or a similar scheme, such as the [Supplemental Instruction](https://info.umkc.edu/si/) model it grew from, go to a few sessions this term. And if you are asked to lead one later, say yes. It is one of the most useful things I do each week.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "International Center for Supplemental Instruction, University of Missouri-Kansas City: the model PAL schemes grew from", url: "https://info.umkc.edu/si/" },
        { text: "Aston University: Peer Assisted Learning", url: "https://www.aston.ac.uk/library/learning-services/pal" },
        { text: "CILE: Peer Assisted Learning, sharing Aston University's experience", url: "https://cile.ac.uk/2020/06/01/peer-assisted-learning-pal-sharing-aston-universitys-experience/" },
        { text: "Farnam Street: the Feynman technique", url: "https://fs.blog/feynman-technique/" },
        { text: "Thonny, the beginner-friendly Python IDE used in the sessions", url: "https://thonny.org" },
        { text: "Wayground, quizzes that students can take at their own pace", url: "https://wayground.com" },
        { text: "Kahoot, live quizzes for the room", url: "https://kahoot.com" },
      ],
    },
  ],
}

export default _running_pal_sessions
