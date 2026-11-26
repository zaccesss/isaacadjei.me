import type { BlogPost } from "../index"

const _how_usb_c_power_delivery_negotiates: BlogPost = {
  slug: "how-usb-c-power-delivery-negotiates",
  title: "How USB-C Power Delivery Negotiates Its Voltage",
  date: "2026-11-26",
  type: "article",
  cover_image: "/images/blog/covers/how-usb-c-power-delivery-negotiates.webp",
  cover_credit: "Photo: Mishaal Zahed (Meschael Zah\u00e8de), Unsplash Licence, via Unsplash",
  cover_alt: "A white USB-C cable with its metal connector in sharp focus against a black background",
  description:
    "Why a USB-C charger gives you 5 V until something asks for more: the resistors on the CC pins, the messages that agree a power contract and the mistakes that leave a homemade board stuck without power.",
  tags: ["Electronics", "Hardware", "Embedded", "Protocols", "Learning"],
  published: true,
  content: [
    {
      type: "p",
      text: "The same USB-C charger can run a phone at 5 V and a laptop at 20 V. Plug a cheap cable into a board you designed yourself and it might give you nothing at all. Both behaviours come from the same idea: a USB-C power source is not allowed to put a high voltage on the cable until the device on the other end has asked for it.",
    },
    {
      type: "p",
      text: "Powering a project from a USB-C laptop charger instead of a bench supply is genuinely useful, so it is worth knowing how this works. This explainer goes from the two resistors that start everything to the short conversation that agrees on a voltage.",
    },
    {
      type: "h2",
      text: "Step one: detecting that something is plugged in",
    },
    {
      type: "p",
      text: "A [USB-C](https://www.usb.org/usbc) plug has two Configuration Channel pins, CC1 and CC2. A source, such as a charger, pulls its CC pins up through a resistor called Rp. A sink, such as a phone or your board, pulls its CC pins down to ground through a resistor called Rd, which is 5.1 kΩ. When a cable connects them, one CC wire links Rp to Rd and forms a voltage divider. The source sees its CC voltage drop and knows a sink is attached. Only then does it switch on VBUS.",
    },
    {
      type: "p",
      text: "Because only one CC wire runs through a normal cable, the source can also tell which way round the plug went in by checking which of its two CC pins saw the drop. That is how a reversible connector routes the high-speed data pairs correctly.",
    },
    {
      type: "h3",
      text: "Advertising current with a resistor",
    },
    {
      type: "p",
      text: "The value of Rp is itself a message. A source can choose one of three pull-up values. The sink measures the CC voltage to read how much current it may draw at 5 V without any further negotiation.",
    },
    {
      type: "table",
      headers: ["Rp pulled up to 5 V", "Current the sink may draw at 5 V"],
      rows: [
        ["56 kΩ", "Default USB current"],
        ["22 kΩ", "1.5 A"],
        ["10 kΩ", "3.0 A"],
      ],
      caption: "Rp values for a source pulling up to 5 V. Sources can also use other pull-up voltages with matching resistors",
    },
    {
      type: "callout",
      tone: "warning",
      text: "The most common mistake on a homemade USB-C board is leaving out the two 5.1 kΩ Rd resistors. A close second is sharing one resistor between CC1 and CC2. Without Rd on each CC pin a compliant charger never sees a sink and never turns on VBUS. The board works from an old USB-A to C cable and fails on a proper USB-C charger, which is confusing until you know why.",
    },
    {
      type: "h2",
      text: "Step two: asking for more than 5 V",
    },
    {
      type: "p",
      text: "Resistors only get you to 5 V at up to 3 A, which is 15 W. Anything more needs [USB Power Delivery](https://www.usb.org/usb-charger-pd), a digital protocol that runs over the same CC wire using biphase mark coding. The two ends exchange a [short series of messages](https://www.ti.com/lit/an/slva842/slva842.pdf) to agree a power contract.",
    },
    {
      type: "diagram",
      code: `sequenceDiagram
    participant S as Source (charger)
    participant K as Sink (device)
    S->>K: Source_Capabilities (list of PDOs)
    K->>S: Request (pick one PDO and a current)
    S->>K: Accept
    Note over S: ramps VBUS to the new voltage
    S->>K: PS_RDY
    Note over K: may now draw the agreed power`,
      caption: "A simplified PD negotiation. Each message is also acknowledged with a GoodCRC",
    },
    {
      type: "ol",
      items: [
        "The source sends Source_Capabilities: a list of Power Data Objects (PDOs). Each fixed PDO says something like 9 V at up to 3 A.",
        "The sink picks the PDO it wants and replies with a Request naming that object's position in the list and the current it needs.",
        "If the source can supply it, it replies Accept, changes VBUS to the new voltage and then sends PS_RDY to say the supply is ready.",
        "If anything goes wrong, the sink keeps running at 5 V. The first PDO is always 5 V, so the safe fallback is built in.",
      ],
    },
    {
      type: "h3",
      text: "What is inside a PDO",
    },
    {
      type: "p",
      text: "A PDO is a 32-bit word. For a fixed supply, the top two bits say it is a fixed supply, ten bits hold the voltage in 50 mV units and the bottom ten bits hold the maximum current in 10 mA units. Decoding one by hand is a good exercise in reading bit fields.",
    },
    {
      type: "code",
      lang: "c",
      text: `#include <stdint.h>
#include <stdio.h>

// decode a fixed-supply PDO: bits 19-10 are voltage in 50 mV units,
// bits 9-0 are maximum current in 10 mA units
void print_fixed_pdo(uint32_t pdo) {
    if ((pdo >> 30) != 0) { printf("not a fixed supply\\n"); return; }
    uint32_t mv = ((pdo >> 10) & 0x3FF) * 50;
    uint32_t ma = (pdo & 0x3FF) * 10;
    printf("%lu mV at up to %lu mA\\n", (unsigned long)mv, (unsigned long)ma);
}

int main(void) {
    // 9 V is 180 units of 50 mV, 3 A is 300 units of 10 mA
    uint32_t pdo = (180u << 10) | 300u;
    print_fixed_pdo(pdo);   // 9000 mV at up to 3000 mA
    return 0;
}`,
    },
    {
      type: "h2",
      text: "The voltages you will meet",
    },
    {
      type: "table",
      headers: ["Range", "Voltages", "Maximum power"],
      rows: [
        ["Standard Power Range", "Fixed 5, 9, 15 and 20 V", "100 W (20 V at 5 A)"],
        ["Programmable Power Supply", "3.3 to 21 V in 20 mV steps", "Set by the source's capabilities"],
        ["Extended Power Range (PD 3.1)", "Adds 28, 36 and 48 V", "240 W (48 V at 5 A)"],
      ],
    },
    {
      type: "p",
      text: "The Programmable Power Supply option is clever. Instead of picking from a fixed list, the sink can ask for a voltage in small steps and update it as it goes. Phones use it for fast charging, so the charger does part of the voltage conversion and less heat is made inside the phone.",
    },
    {
      type: "h2",
      text: "The cable is part of the system",
    },
    {
      type: "p",
      text: "Current above 3 A needs a cable rated for it. Cables that can carry 5 A contain a small chip called an [electronic marker](https://hackaday.com/2023/01/04/all-about-usb-c-resistors-and-emarkers/) (e-marker) powered from the spare CC pin, which is used as VCONN. The source asks the cable what it can handle before offering more than 3 A. A cable without an e-marker limits the contract to 3 A, which is why the same charger can deliver 60 W with one cable and 100 W with another.",
    },
    {
      type: "h2",
      text: "Using PD in your own projects",
    },
    {
      type: "p",
      text: "You do not need to implement the protocol yourself to use it. There are three common routes.",
    },
    {
      type: "ul",
      items: [
        "A ready-made PD trigger board, which negotiates a fixed voltage set by jumpers or a button and gives you two output pads. The quickest way to get 12 V or 20 V from a laptop charger.",
        "A standalone sink controller chip that negotiates by itself from settings stored in it. ST's STUSB4500 is a common example.",
        "A full port controller driven by a microcontroller over I2C, when the device needs to change its request at run time or act as both source and sink.",
      ],
    },
    {
      type: "p",
      text: "Whichever route you take, design for the fallback. If negotiation fails, the board gets 5 V. Make sure nothing is damaged by that and ideally show the user that the higher voltage was not granted. Then measure VBUS with a meter before connecting anything expensive.",
    },
    {
      type: "h2",
      text: "Why I like this design",
    },
    {
      type: "p",
      text: "USB-C power is a good example of safe defaults. Nothing dangerous happens until both ends have proved what they are and agreed what they want. Every failure falls back to 5 V. That is a pattern worth copying in any system where a mistake could damage hardware.",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "USB-IF: USB Charger and USB Power Delivery", url: "https://www.usb.org/usb-charger-pd" },
        { text: "USB-IF: USB Type-C specification", url: "https://www.usb.org/usbc" },
        { text: "Texas Instruments application report SLVA842: USB PD Power Negotiations (PDF)", url: "https://www.ti.com/lit/an/slva842/slva842.pdf" },
        { text: "Texas Instruments: A primer on USB Type-C and USB Power Delivery (PDF)", url: "https://www.ti.com/lit/pdf/slyy109" },
        { text: "Hackaday, All About USB-C: resistors and e-markers", url: "https://hackaday.com/2023/01/04/all-about-usb-c-resistors-and-emarkers/" },
        { text: "Hackaday, All About USB-C: Power Delivery", url: "https://hackaday.com/2023/01/09/all-about-usb-c-power-delivery/" },
        { text: "Hackaday, All About USB-C: talking low-level PD", url: "https://hackaday.com/2023/02/14/all-about-usb-c-talking-low-level-pd/" },
      ],
    },
    {
      type: "h2",
      text: "Watch or listen",
    },
    {
      type: "video",
      youtubeId: "W13HNsoHj7A",
      title: "Phil's Lab #104: USB-C Power Delivery hardware design",
    },
  ],
}

export default _how_usb_c_power_delivery_negotiates
