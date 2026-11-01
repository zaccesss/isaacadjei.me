import type { TILEntry } from "../index"

const _midi_note_number_frequency: TILEntry = {
    id: "midi-note-number-frequency",
    title: "MIDI note 60 is middle C and each semitone multiplies the frequency by the twelfth root of two",
    date: "2026-11-01",
    category: "Music",
    published: true,
    body: "MIDI [numbers notes in semitones](https://newt.phys.unsw.edu.au/jw/notes.html), with 69 as the A above middle C at 440 Hz and 60 as middle C. Each step multiplies the frequency by 2^(1/12), about 1.059, so twelve steps double it to make an octave. That gives f = 440 x 2^((n - 69) / 12), which puts middle C at about 261.63 Hz. Turning it round gives the nearest note for a measured pitch, which is the first step of a tuner.",
    detail: [
      {
        type: "code",
        lang: "js",
        code: `const freq = (n) => 440 * 2 ** ((n - 69) / 12)

freq(21)   // 27.50   A0, the lowest key on an 88-key piano
freq(60)   // 261.63  middle C
freq(69)   // 440.00  A4
freq(72)   // 523.25  C5, one octave above middle C
freq(108)  // 4186.01 C8, the highest key on an 88-key piano`,
        caption: "One formula covers every key on the keyboard",
      },
      {
        type: "code",
        lang: "js",
        code: `const note = (f) => Math.round(69 + 12 * Math.log2(f / 440))

note(261.63)  // 60  middle C
note(82.41)   // 40  the low E string on a guitar
note(1000)    // 83  B5: freq(83) is 987.77, so 1 kHz is a little sharp of it`,
        caption: "The inverse: the nearest MIDI note to any frequency",
      },
      {
        type: "note",
        text: "Manufacturers disagree on octave names: some call note 60 C4 and others C3. The number is the reliable part, so store and compare numbers and only turn them into names for display.",
      },
    ],
    tags: ["MIDI", "music", "maths"],
    source: { label: "UNSW Music Acoustics: note names, MIDI numbers and frequencies", url: "https://newt.phys.unsw.edu.au/jw/notes.html" },
    project: { name: "MELOPHOS", url: "https://melophos.com", slug: "melophos" },
    series: "MIDI basics",
    seriesPart: 2,
  }

export default _midi_note_number_frequency
