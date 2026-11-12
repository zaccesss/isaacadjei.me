import type { BlogPost } from "../index"

const _therac_25_software_safety: BlogPost = {
  slug: "therac-25-software-safety",
  title: "The Therac-25: What a Deadly Radiation Machine Teaches About Software Safety",
  date: "2026-11-12",
  type: "article",
  cover_image: "/images/blog/covers/therac-25-software-safety.webp",
  cover_credit: "Photo: liz west, CC BY 2.0, via Wikimedia Commons",
  cover_alt: "A radiotherapy treatment room with a medical linear accelerator beside the patient couch",
  description:
    "How a race condition, a one-byte counter and too much trust in software led a radiation therapy machine to massively overdose six patients between 1985 and 1987.",
  tags: ["Embedded", "Software Engineering", "Security", "Health Tech", "C"],
  published: true,
  content: [
    {
      type: "p",
      text: "Most software bugs cost time or money. Some cost lives. The Therac-25 is the case study that almost every software engineering and embedded systems course eventually reaches. The more closely I read it, the less it looks like a single bug. It is a chain of decisions, each reasonable on its own, that together removed every safety net.",
    },
    {
      type: "h2",
      text: "The machine",
    },
    {
      type: "p",
      text: "The Therac-25 was a medical linear accelerator built by Atomic Energy of Canada Limited (AECL) and used to treat cancer. It was dual-mode. In electron mode, a low-current beam of electrons was spread out by scanning magnets and aimed directly at the patient. In X-ray mode, a beam roughly a hundred times stronger hit a tungsten target, producing X-rays that were then flattened into an even field. A turntable rotated the right equipment into the beam path for each mode.",
    },
    {
      type: "p",
      text: "The danger is obvious once it is written down. If the machine ever produced the high-current X-ray beam without the target and flattener in place, the patient would receive a concentrated electron beam far beyond any safe dose.",
    },
    {
      type: "h2",
      text: "The design decision that mattered most",
    },
    {
      type: "p",
      text: "The earlier Therac-6 and Therac-20 machines had independent hardware interlocks: physical circuits that made it impossible to fire the beam in an unsafe configuration, whatever the software did. The Therac-25 was designed to be controlled by computer from the start. Most of those hardware protections were removed. Safety now depended on the software.",
    },
    {
      type: "p",
      text: "Part of that software was reused from the Therac-20. Investigators later found that some of the same bugs had existed in the Therac-20 all along. They had never hurt anyone because the hardware interlocks caught them, at worst blowing a fuse. Remove the hardware and the old bugs became lethal.",
    },
    {
      type: "h2",
      text: "Bug one: a race condition in the editor",
    },
    {
      type: "p",
      text: "Operators entered a treatment prescription on a terminal. Experienced operators typed fast. If an operator selected X-ray mode, then quickly moved the cursor up and changed it to electron mode, the screen showed the corrected prescription. But setting the bending magnets took about eight seconds. The task doing that work only checked for edits at certain points. Under the wrong timing, the machine ended up with an inconsistent mix of settings while the display said everything was fine.",
    },
    {
      type: "p",
      text: "The machine would then halt with a message reading 'Malfunction 54'. The manual did not explain what that meant. Operators saw frequent harmless malfunctions and had learned to press P to proceed. At the East Texas Cancer Center in Tyler, the hospital physicist and an operator spent a great deal of effort reproducing the fault. They found that the speed of editing was the key. Once he could trigger it at will, he measured the dose under the error condition: well over 4,000 rads, where a typical single treatment is a small fraction of that.",
    },
    {
      type: "callout",
      tone: "warning",
      text: "The manufacturer's engineers initially could not reproduce the fault because they typed the edits too slowly. A bug that only appears when an expert user works quickly is the hardest kind to find in testing. It is also the easiest to dismiss as user error.",
    },
    {
      type: "h2",
      text: "Bug two: a counter that rolled over",
    },
    {
      type: "p",
      text: "A different accident in Yakima, Washington had a different cause. During setup, a routine repeatedly ran while the turntable was moving into position. Each pass, it incremented a shared one-byte variable called Class3. A nonzero value meant 'something is inconsistent, check the collimator before treating'. Zero meant no check was needed.",
    },
    {
      type: "p",
      text: "A one-byte variable holds values from 0 to 255. On every 256th pass, incrementing it [wrapped it round to zero](https://cwe.mitre.org/data/definitions/190.html). If the operator pressed the set button at exactly that moment, the safety check was skipped.",
    },
    {
      type: "code",
      lang: "c",
      text: `/* the pattern that failed: a flag kept as an incrementing counter */
uint8_t class3 = 0;

void setup_test(void) {
    class3++;              /* 255 + 1 wraps to 0 on every 256th pass */
    if (class3 != 0) {
        check_collimator();
    }
    /* when class3 is 0, the check above silently never runs */
}

/* the fix: set the flag to a fixed nonzero value instead */
void setup_test_fixed(void) {
    class3 = 1;
    check_collimator();
}`,
    },
    {
      type: "p",
      text: "The code above is my simplified illustration rather than the original, which was written in assembly. The real fix was exactly this idea: set the flag to a fixed nonzero value instead of incrementing it. It is a one-line bug. It is also exactly the kind of shortcut that is tempting in firmware: using a counter as a convenient 'something happened' flag.",
    },
    {
      type: "h2",
      text: "The bugs were not the whole story",
    },
    {
      type: "p",
      text: "In their [1993 investigation](https://www.cs.columbia.edu/~junfeng/08fa-e6998/sched/readings/therac25.pdf), Nancy Leveson and Clark Turner argued that fixing the individual bugs missed the point. Six known accidents involving massive overdoses happened between June 1985 and January 1987. Several patients died from their injuries. For much of that time the manufacturer responded to reports by saying an overdose was impossible.",
    },
    {
      type: "table",
      headers: ["Factor", "What went wrong"],
      rows: [
        ["Overconfidence in software", "Hardware interlocks were removed because the software was assumed to be safe"],
        ["Reused code", "Code proven on a machine with hardware interlocks was trusted on one without"],
        ["Error messages", "'Malfunction 54' gave operators no idea of the danger"],
        ["Alarm fatigue", "Frequent harmless malfunctions taught operators to proceed"],
        ["No independent review", "The software was not independently analysed for safety"],
        ["Incident handling", "Early reports were not taken seriously, so the same faults recurred"],
      ],
    },
    {
      type: "h2",
      text: "What I take into my own work",
    },
    {
      type: "h3",
      text: "Keep a hardware safety net",
    },
    {
      type: "p",
      text: "When I design anything that can hurt someone, even a small [CNC controller](/projects/cnc-control) or a [goods lift model](/projects/goods-lift), a physical interlock or emergency stop should be able to stop it whatever the code is doing. Software can be one layer of protection. It should not be the only one.",
    },
    {
      type: "h3",
      text: "Make error messages say what they mean",
    },
    {
      type: "p",
      text: "A cryptic code is not a safety mechanism. A message should tell the operator what happened, how serious it is and what to do. If a condition is dangerous, the system should not offer a one-key way to carry on.",
    },
    {
      type: "h3",
      text: "Treat shared state with suspicion",
    },
    {
      type: "p",
      text: "Both bugs involved state shared between concurrent tasks with no proper synchronisation, the classic [race condition](https://cwe.mitre.org/data/definitions/362.html). On a microcontroller the same thing happens between an interrupt and the main loop. Use proper flags, critical sections or queues. Test timing as deliberately as you test values.",
    },
    {
      type: "p",
      text: "Medical device software is now developed under standards such as [IEC 62304](https://webstore.iec.ch/en/publication/6792), which require risk analysis and traceable verification. The Therac-25 is a large part of why such standards exist. It is a hard story to read, but I think every engineer who writes code for physical machines should read it at least once.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Nancy Leveson and Clark Turner: An Investigation of the Therac-25 Accidents (IEEE Computer, 1993)", url: "https://www.cs.columbia.edu/~junfeng/08fa-e6998/sched/readings/therac25.pdf" },
        { text: "The same paper on IEEE Xplore", url: "https://ieeexplore.ieee.org/document/274940/" },
        { text: "MITRE CWE-362: race conditions from shared resources without proper synchronisation", url: "https://cwe.mitre.org/data/definitions/362.html" },
        { text: "MITRE CWE-190: integer overflow or wraparound", url: "https://cwe.mitre.org/data/definitions/190.html" },
        { text: "IEC 62304: medical device software, software life cycle processes", url: "https://webstore.iec.ch/en/publication/6792" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "nU5HbUOtyqk",
      title: "Fascinating Horror: The Therac-25 accidents, a short documentary",
    },
    {
      type: "spotify",
      episodeId: "6uTQVFKsMxhHcmEBhQ41G7",
      title: "Causality, episode 39: Therac-25",
    },
  ],
}

export default _therac_25_software_safety
