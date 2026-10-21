import type { NotePost } from "../index"

const post: NotePost = {
  slug: "fedora-beside-windows-on-my-thinkpad",
  title: "Putting Fedora beside Windows on my ThinkPad",
  date: "2026-10-21",
  description:
    "Why my ThinkPad now dual boots Windows 11 and Fedora KDE Plasma, what I kept from Windows and how the whole setup is saved so the next laptop is quick to build.",
  tags: ["Engineering", "Tools", "Learning"],
  published: true,
  content: [
    { type: "p", text: "My ThinkPad P14s used to be a Windows laptop with Linux running inside it through WSL2. That covers most tooling, but it is still Linux as a guest. I wanted the real thing on the real hardware: USB serial straight to my microcontroller boards, a proper systemd to learn on and a desktop I could break and fix without risking the machine I depend on." },
    { type: "h2", text: "Why Fedora" },
    { type: "p", text: "I looked hard at Arch, Debian and Mint. Fedora won for a dual boot I need every day. It ships new kernels and KDE Plasma releases quickly, it works with Secure Boot out of the box and Red Hat Enterprise Linux is built from it, so what I learn carries straight over to the servers many companies run. Arch stays on my list, but it lives in WSL for now, where breaking it costs nothing." },
    { type: "h2", text: "The disk and the boot menu" },
    { type: "ul", items: [
      "Fedora has 150 GB of its own on an encrypted Btrfs partition. It shares the existing EFI partition with Windows.",
      "Windows could not shrink its own partition far enough, so I shrank it from the Fedora live USB with KDE Partition Manager.",
      "Secure Boot stays on. The only firmware change was allowing the Microsoft third-party UEFI certificate, which Linux's boot loader is signed with.",
      "The boot menu lists Windows first and starts it by default, with Fedora right underneath and a ten-second timeout.",
      "I removed the graphical boot splash, so the disk passphrase prompt is plain text. The splash hid it completely whenever my external monitor was plugged in.",
      "Both systems keep the hardware clock in local time, so neither one shifts the other's clock by an hour.",
    ] },
    { type: "h2", text: "A desktop that feels like home" },
    { type: "p", text: "I tried a Mac-style dock first and it did not suit me. The desktop now copies Windows 11 instead: one taskbar along the bottom with the start menu and pinned apps in the middle, the tray and a 24-hour clock on the right. The window keys I use with Rectangle on my Mac work here too, so a window snaps to a half or a quarter with the same keys on every machine." },
    { type: "p", text: "Colour matters to me more than most, because I see with one eye. KDE runs my own high-contrast light and dark themes and switches between them by time of day. Kitty is the terminal, with Ctrl+C and Ctrl+V copying and pasting as they do on Windows. My OneDrive mounts as a folder and my wallpaper set rotates every half hour." },
    { type: "h2", text: "Everything is written down" },
    { type: "p", text: "None of this is clicked together by hand and forgotten. The themes, the taskbar, the shortcuts and the terminal are all saved as config files with a setup script. A written guide covers the install from start to finish. The next laptop should be an afternoon's work rather than a weekend's." },
    { type: "p", text: "The live status card on my [now page](/now) shows which side is running as ZACCESS-LNV-WIN or ZACCESS-LNV-FED. When the laptop is off it falls back to plain ZACCESS-LNV." },
  ],
}

export default post
