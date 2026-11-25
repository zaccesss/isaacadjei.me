import type { TILEntry } from "../index"

const _led_pwm_gamma_correction: TILEntry = {
    id: "led-pwm-gamma-correction",
    title: "Half PWM duty does not look half as bright, so LED brightness needs gamma correction",
    date: "2026-11-25",
    category: "Embedded",
    published: true,
    body: "PWM changes an LED's average light output linearly with duty cycle, but the eye's response is closer to a power law, so 50% duty looks far brighter than half and most of a fade happens in the bottom quarter of the range. Gamma correction maps the brightness you want onto the duty you need with out = in^γ. [Adafruit's gamma guide](https://learn.adafruit.com/led-tricks-gamma-correction) uses γ = 2.8 for its NeoPixel table, which makes \"half brightness\" a duty of about 37 out of 255. It matters most for colour mixing: an orange made from full red and half green looks yellow without it, because the green appears much brighter than intended.",
    detail: [
      {
        type: "code",
        lang: "python",
        code: `gamma = 2.8
table = [round(255 * (i / 255) ** gamma) for i in range(256)]

print(table[64], table[128], table[192], table[255])   # 5 37 115 255
print(sum(v == 0 for v in table), "of 256 inputs map to 0")   # 28`,
        caption: "Build the lookup table once on the host, then store it as a 256-byte array in flash",
      },
      {
        type: "note",
        text: "With only 8 bits of PWM the bottom of the corrected curve collapses: 28 inputs all become 0, so slow fades step visibly. A 12 or 16-bit timer keeps dim levels smooth. So does temporal dithering, which [FastLED](https://fastled.io/docs/) uses.",
      },
    ],
    tags: ["embedded", "LEDs", "PWM", "electronics"],
    source: { label: "Adafruit: LED tricks, gamma correction", url: "https://learn.adafruit.com/led-tricks-gamma-correction" },
    series: "Driving LEDs",
    seriesPart: 1,
  }

export default _led_pwm_gamma_correction
