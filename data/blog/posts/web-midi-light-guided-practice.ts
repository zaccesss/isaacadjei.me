import type { BlogPost } from "../index"

const _web_midi_light_guided_practice: BlogPost = {
  slug: "web-midi-light-guided-practice",
  title: "Building Light-Guided Practice in the Browser with Web MIDI",
  date: "2026-11-01",
  type: "blog",
  cover_image: "/images/blog/covers/web-midi-light-guided-practice.webp",
  cover_alt: "MELOPHOS Studio with an on-screen piano keyboard, one key lit amber, playing Ode to Joy with the next note shown as E4",
  description:
    "How the MELOPHOS Studio reads a real keyboard through Web MIDI, lights the next note in amber and scores every note for pitch and timing, all in a browser tab.",
  tags: ["TypeScript", "JavaScript", "Web", "Hardware", "Accessibility", "Open Source"],
  projectSlug: "melophos",
  published: true,
  content: [
    {
      type: "p",
      text: "[MELOPHOS](https://melophos.com) is an open instrument learning platform I am building. The long-term plan is a small [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3) hub that drives LED bars above a keyboard and lights the next notes to play. Hardware takes time though. I wanted to test the practice idea itself before ordering a single PCB. So I built the Studio first: a browser app that connects to a real MIDI keyboard, shows a strip of virtual LEDs above an on-screen keyboard and scores what I play.",
    },
    {
      type: "p",
      text: "The surprising part was how little code it needed. The browser already speaks MIDI.",
    },
    {
      type: "h2",
      text: "Web MIDI in thirty lines",
    },
    {
      type: "p",
      text: "The [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) gives a web page access to MIDI devices plugged into the computer. You ask for access, the browser asks the user for permission and you get back a map of inputs and outputs. Each input fires a midimessage event with the raw bytes.",
    },
    {
      type: "code",
      lang: "typescript",
      text: `export async function connectMidi(onNote: (m: NoteMessage) => void): Promise<string[]> {
  if (!("requestMIDIAccess" in navigator)) {
    throw new Error("This browser has no WebMIDI. Use Chrome or Edge.");
  }
  const access = await navigator.requestMIDIAccess();
  const names: string[] = [];
  for (const input of access.inputs.values()) {
    names.push(input.name ?? "MIDI input");
    input.onmidimessage = (event) => {
      if (!event.data) return;
      const message = parseNoteMessage(event.data);
      if (message) onNote(message);
    };
  }
  return names;
}`,
    },
    {
      type: "callout",
      tone: "warning",
      text: "Browser support is uneven. Web MIDI works in Chrome, Edge and desktop Firefox 108 and later, where Firefox asks the user to install a site permission add-on the first time. Safari and Firefox for Android do not support it. Every browser requires a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts), so https:// or localhost.",
    },
    {
      type: "h2",
      text: "Reading the bytes",
    },
    {
      type: "p",
      text: "A MIDI note message is three bytes. The first is the status byte: the top four bits say what kind of message it is and the bottom four bits give the channel. The second byte is the note number and the third is the velocity, which is how hard the key was struck.",
    },
    {
      type: "table",
      headers: ["Byte", "Bits", "Meaning"],
      rows: [
        ["Status", "1001 nnnn (0x90)", "Note on, channel nnnn"],
        ["Status", "1000 nnnn (0x80)", "Note off, channel nnnn"],
        ["Data 1", "0kkk kkkk", "Note number 0 to 127, where 60 is middle C"],
        ["Data 2", "0vvv vvvv", "Velocity 0 to 127"],
      ],
    },
    {
      type: "code",
      lang: "typescript",
      text: `export function parseNoteMessage(data: Uint8Array): NoteMessage | null {
  if (data.length < 3) return null;
  const [status = 0, note = 0, velocity = 0] = data;
  const type = status & 0xf0;
  const channel = status & 0x0f;
  if (type === 0x90) return { note, velocity, channel };
  if (type === 0x80) return { note, velocity: 0, channel };
  return null;
}`,
    },
    {
      type: "p",
      text: "There is one trap here that cost me a confused evening. Many keyboards never send a note-off message at all. Instead they send a note-on with a velocity of 0, which the [MIDI specification](https://midi.org/summary-of-midi-1-0-messages) defines as meaning note-off. It saves a byte in a stream of messages using running status. If your code treats every 0x90 as a key press, every release looks like a second press. The Studio handles it by treating velocity 0 as a release whatever the status byte says. The note-off case also returns velocity 0 so both paths look the same downstream.",
    },
    {
      type: "h2",
      text: "Separating the scoring from everything else",
    },
    {
      type: "p",
      text: "The most useful design decision was making the practice logic a plain class with no knowledge of MIDI, the DOM or timers. It is given a song and receives played notes with timestamps. It knows which note is expected next, whether each played note was right and how far it landed from the beat.",
    },
    {
      type: "code",
      lang: "typescript",
      text: `play(note: number, atMs: number): Result | null {
  if (this.finished) return null;
  if (this.startedAt === null) this.startedAt = atMs;
  const expected = this.song.notes[this.index]!.note;
  const result = {
    expected,
    played: note,
    correct: note === expected,
    offsetMs: Math.round(atMs - this.startedAt - this.expectedTimeMs(this.index)),
  };
  this.results.push(result);
  // a wrong note is marked and the guide waits on the same note, as a teacher would
  if (result.correct) this.index += 1;
  return result;
}`,
    },
    {
      type: "p",
      text: "Because it is pure logic, it is easy to unit test. Three different sources drive exactly the same code: the MIDI keyboard, clicks on the on-screen keyboard and a demo player.",
    },
    {
      type: "diagram",
      code: `flowchart LR
    K["MIDI keyboard"] --> H["Note handler"]
    C["On-screen keys"] --> H
    D["Demo player"] --> H
    H --> P["Practice: expected note,<br/>right or wrong, timing"]
    P --> L["Guide lights"]
    P --> F["Feedback text"]
    P --> S["Summary"]`,
      caption: "Every input path feeds the same scoring, so the demo shows the real behaviour.",
    },
    {
      type: "h3",
      text: "A demo that plays like a person",
    },
    {
      type: "p",
      text: "I wanted a Play demo button so anyone without a keyboard could see the idea. A perfect robotic playback would hide what the scoring does, so the demo player adds up to 60 ms of jitter either side of each beat from a seeded random generator and makes one deliberate slip a third of the way through, pressing the neighbouring key before correcting itself. The summary at the end therefore shows a realistic accuracy and timing rather than a suspicious 100%.",
    },
    {
      type: "clip",
      src: "/videos/projects/melophos/practice.mp4",
      poster: "/videos/projects/melophos/practice.webp",
      alt: "The MELOPHOS Studio playing Ode to Joy with a simulated player: an amber light above the on-screen keyboard moves to each next note and a line below reports whether each note was right and how many milliseconds early or late it landed.",
      caption: "The demo player working through Ode to Joy, with the amber guide light and the timing feedback below.",
    },
    {
      type: "h2",
      text: "Designing the guide light",
    },
    {
      type: "p",
      text: "The guide is a strip above the keys with one small LED per key, mirroring what the real hardware will do. The next note glows in bright amber and the two after it glow dimly, so you can see where your hand is going without the strip turning into a light show.",
    },
    {
      type: "ul",
      items: [
        "Amber (#ffb000) on near-black has very high contrast and stays distinct for the common types of colour vision deficiency.",
        "Brightness, not only colour, separates the next note from the ones after it, so the guide still works in greyscale.",
        "Every result is also announced as text in a polite [live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions), for example 'E4: right, 23 ms late', so a screen reader user gets the same feedback.",
        "Transitions only run when the user has not asked for reduced motion.",
      ],
    },
    {
      type: "p",
      text: "A wrong note turns the pressed key red, but the amber light stays where it is. That mirrors how a teacher works: the lesson does not move on until the right note is played.",
    },
    {
      type: "h2",
      text: "From browser to hardware",
    },
    {
      type: "p",
      text: "The Studio is a prototype of the hub's behaviour, not a replacement for it. The plan is for the ESP32-S3 hub to take notes from USB-MIDI, Bluetooth MIDI or a 3.5 mm MIDI jack and drive LED bars sized for 61, 76 and 88-key keyboards. Instrument profiles describe each keyboard's range, so supporting a new one is a configuration change. Proving the practice loop in a browser first means that when the hardware arrives, the only new question is whether the LEDs light up, not whether the idea works.",
    },
    {
      type: "p",
      text: "If you have a MIDI keyboard and Chrome or Edge, the whole thing runs locally with npm install and npm run dev in the studio folder of the repository, which is also published on its own as [melophos/studio](https://github.com/melophos/studio). The wider project is on the [MELOPHOS project page](/projects/melophos).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "MDN: Web MIDI API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API" },
        { text: "W3C: Web MIDI API specification", url: "https://www.w3.org/TR/webmidi/" },
        { text: "MIDI Association: summary of MIDI 1.0 messages", url: "https://midi.org/summary-of-midi-1-0-messages" },
        { text: "Can I use: Web MIDI browser support", url: "https://caniuse.com/midi" },
        { text: "MELOPHOS project site", url: "https://melophos.com" },
        { text: "melophos/studio: the Studio source code", url: "https://github.com/melophos/studio" },
      ],
    },
  ],
}

export default _web_midi_light_guided_practice
