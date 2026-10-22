import type { TILEntry } from "../index"

const _floating_input_pull_up: TILEntry = {
    id: "floating-input-pull-up",
    title: "A floating digital input reads noise, so every input needs a pull-up or a pull-down",
    date: "2026-10-22",
    category: "Embedded",
    published: true,
    body: "A CMOS input draws almost no current: the [ATmega328P datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf) quotes at most 1 µA of leakage. With nothing driving it, the pin's voltage drifts with whatever couples onto it, so a button that is not pressed can read high, low or flicker between the two. Even touching the wire changes the answer. A resistor to the supply (a pull-up) or to ground (a pull-down) gives the pin a defined state whenever nothing else is driving it. Most microcontrollers have one built in: [`INPUT_PULLUP`](https://docs.arduino.cc/learn/microcontrollers/digital-pins/) on an Arduino Uno switches on a 20 to 50 kΩ pull-up.",
    detail: [
      {
        type: "code",
        lang: "cpp",
        code: `#include <Arduino.h>
const uint8_t BUTTON = 2;   // button wired from pin 2 to GND

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON, INPUT_PULLUP);   // internal 20 to 50 kΩ pull-up to 5 V
}

void loop() {
  bool pressed = digitalRead(BUTTON) == LOW;   // pull-up inverts the logic
  Serial.println(pressed ? "pressed" : "released");
  delay(100);
}`,
        caption: "A button to ground with the internal pull-up: no external parts, but pressed reads LOW",
      },
      {
        type: "p",
        text: "The value is a trade-off. A pressed button connects the pull-up straight across the supply, so 10 kΩ at 5 V costs 0.5 mA while held. A larger resistor saves current but makes the pin easier to disturb and slower to rise, which is why a long cable to a switch usually gets an external 10 kΩ or less instead of the weak internal one.",
      },
      {
        type: "note",
        text: "Unused pins float too. Enable the internal pull-up on them or set them as outputs, because a floating input that hovers near the switching threshold can draw extra current and inject noise.",
      },
    ],
    tags: ["embedded", "electronics", "GPIO", "Arduino"],
    source: { label: "SparkFun: pull-up resistors", url: "https://learn.sparkfun.com/tutorials/pull-up-resistors/all" },
    series: "Pull-up resistors",
    seriesPart: 1,
  }

export default _floating_input_pull_up
