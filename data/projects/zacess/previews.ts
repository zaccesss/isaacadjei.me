export type PreviewId = "zacess-themes" | "zacess-scenes" | "zacess-games"

export interface FrameClip {
  id: string
  label: string
  description: string
  src: string
}

export interface PreviewStill {
  src: string
  alt: string
  width: number
  height: number
}

export const SCENE_CLIPS: FrameClip[] = [
  {
    id: "koi-pond",
    label: "koi-pond, a pass scene",
    description: "A garden pond from above, drawn in text characters, with koi gliding on slow curves under lily pads, drifting flecks and a slow ripple now and then",
    src: "/frames/zacess/scenes/koi-pond.json",
  },
  {
    id: "lanterns",
    label: "lanterns, a pass scene",
    description: "Paper lanterns rising slowly from a dark lake at three depths, each with a reflection that slides down the water as it climbs",
    src: "/frames/zacess/scenes/lanterns.json",
  },
  {
    id: "fog",
    label: "fog, a fail scene",
    description: "A road with signs, lamps and pines where a fog bank rolls in and the signs fade from view, glimpsed through gaps",
    src: "/frames/zacess/scenes/fog.json",
  },
]

export const GAME_CLIPS: FrameClip[] = [
  {
    id: "stackline",
    label: "Stackline",
    description: "Stackline: circuit parts fall into Well A and the fourth one completes a row of wire across the rails, which clears and pushes a feedback row into Well B",
    src: "/frames/zacess/games/stackline.json",
  },
  {
    id: "termle",
    label: "Termle",
    description: "Termle: the guesses TESLA and CLASS narrow down the daily term from the clue Signals, then PHASE solves it in three tries",
    src: "/frames/zacess/games/termle.json",
  },
  {
    id: "through-ball",
    label: "Through Ball",
    description: "Through Ball: a pass and a return pass work the ball into the box past the defenders, then a low shot beats the keeper for a goal",
    src: "/frames/zacess/games/through-ball.json",
  },
  {
    id: "slipstream",
    label: "Slipstream",
    description: "Slipstream: a car changes lanes through traffic on a coast road, takes the pit lane to fill its tank, then rejoins the road",
    src: "/frames/zacess/games/slipstream.json",
  },
  {
    id: "touch-typing",
    label: "Touch Typing",
    description: "Touch Typing: the first lesson's line of F and J is typed with one slip fixed with Backspace, while the on-screen keyboard marks the finger for the next key",
    src: "/frames/zacess/games/touch-typing.json",
  },
  {
    id: "learn-to-code",
    label: "Learn to Code",
    description: "Learn to Code: the Python track is opened from the list of fifteen tracks and the blank in its first level is filled in, so the program prints Hello, world",
    src: "/frames/zacess/games/learn-to-code.json",
  },
]

export const GAMES_STILL: PreviewStill = {
  src: "/images/projects/zacess/games/menu.webp",
  alt: "The Zacess Games menu in Zacess Deep Contrast Dark: a cyan box headed Pick a game lists the fourteen games in two columns, each with its own symbol and colour, from Stackline to Learn to Code. Stackline is selected and described underneath as Join rails across two wells. The header shows FX 35% and Music 20% and two key lines run along the bottom",
  width: 1736,
  height: 1136,
}
