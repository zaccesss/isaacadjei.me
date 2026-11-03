import type { TILEntry } from "../index"

const _op_amp_slew_rate: TILEntry = {
    id: "op-amp-slew-rate",
    title: "An op-amp's slew rate caps how big a signal it can pass at high frequency",
    date: "2026-11-03",
    category: "Electronics",
    published: true,
    body: "Slew rate is the fastest an op-amp's output can change, in volts per microsecond. A sine wave of peak voltage Vp at frequency f changes fastest at its zero crossing, at 2πf x Vp, so the largest undistorted frequency is f = SR / (2π x Vp). Above that the output turns into a triangle wave even though the gain-bandwidth product says the amplifier should cope. The [LM358 datasheet](https://www.ti.com/lit/ds/symlink/lm358.pdf) lists 0.3 V/µs for the original part, which runs out at under 5 kHz for a 10 V peak signal.",
    detail: [
      {
        type: "code",
        lang: "python",
        code: `from math import pi

def full_power_bandwidth(slew_v_per_us: float, peak_v: float) -> float:
    return slew_v_per_us * 1e6 / (2 * pi * peak_v)

print(f"{full_power_bandwidth(0.3, 1):,.0f} Hz")    # LM358, 1 V peak:  47,746 Hz
print(f"{full_power_bandwidth(0.3, 10):,.0f} Hz")   # LM358, 10 V peak:  4,775 Hz
print(f"{full_power_bandwidth(20, 10):,.0f} Hz")    # TL072, 10 V peak: 318,310 Hz`,
        caption: "The same 10 V signal: an audio-friendly limit on one part, barely audible on the other",
      },
      {
        type: "p",
        text: "Gain-bandwidth sets the limit for small signals and slew rate for large ones, so a datasheet check needs both. The [TL072](https://www.ti.com/lit/ds/symlink/tl072.pdf) quotes 20 V/µs, which is why it turns up in audio circuits that the LM358 would distort.",
      },
      {
        type: "note",
        text: "Slew limiting shows on a scope as straight-sided edges that get worse as the amplitude goes up. A distortion that grows with level but not with gain setting points at slew rate rather than bandwidth.",
      },
    ],
    tags: ["electronics", "op-amps", "analogue"],
    source: { label: "Texas Instruments: Understanding Operational Amplifier Specifications (SLOA011B)", url: "https://www.ti.com/lit/an/sloa011b/sloa011b.pdf" },
    series: "Op-amp basics",
    seriesPart: 1,
  }

export default _op_amp_slew_rate
