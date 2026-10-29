import type { TILEntry } from "../index"

const _midi_note_on_velocity_zero: TILEntry = {
    id: "midi-note-on-velocity-zero",
    title: "A MIDI note-on with velocity 0 means note-off",
    date: "2026-10-29",
    category: "Music",
    published: true,
    body: "A note-on message is three bytes: status `0x9n` for channel n + 1, the note number and a velocity from 0 to 127. The [MIDI 1.0 specification](https://midi.org/midi-1-0-core-specifications) says a note can be turned off either with a note-off or with a note-on at velocity 0. The zero velocity form lets a device use running status, sending a long stream of note and velocity pairs without repeating the status byte. Many keyboards and apps send that form instead of `0x8n`, so code that only listens for note-off leaves notes stuck on. For a light-guided keyboard like MELOPHOS that is the difference between a key's light going out on release and staying lit.",
    detail: [
      {
        type: "code",
        lang: "js",
        code: `function onMIDIMessage({ data }) {
  const [status, note, velocity] = data
  const command = status & 0xf0

  if (command === 0x90 && velocity > 0) {
    noteOn(note, velocity)
  } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
    noteOff(note)
  }
}`,
        caption: "Handle both forms of note-off in a [Web MIDI](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) listener",
      },
      {
        type: "note",
        text: "Masking with `0xf0` drops the channel from the low four bits, so one check covers all 16 channels.",
      },
    ],
    tags: ["MIDI", "music", "Web MIDI", "JavaScript"],
    source: { label: "MIDI Association: zero velocity note-on", url: "https://midi.org/community/midi-specifications/zero-velocity-note-on" },
    project: { name: "MELOPHOS", url: "https://melophos.com", slug: "melophos" },
    series: "MIDI basics",
    seriesPart: 1,
  }

export default _midi_note_on_velocity_zero
