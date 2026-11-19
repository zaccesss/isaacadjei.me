import type { BlogPost } from "../index"

const _dual_booting_windows_ubuntu_wsl2: BlogPost = {
  slug: "dual-booting-windows-ubuntu-wsl2",
  title: "Dual Booting Fedora Beside Windows 11: BitLocker, GRUB and WSL2 on Two PCs",
  date: "2026-11-19",
  type: "report",
  cover_image: "/images/blog/covers/dual-booting-windows-ubuntu-wsl2-shot.webp",
  cover_alt: "A Linux terminal configuring the ArduPilot simulator build, with green results listed down the right-hand side",
  description:
    "How my ThinkPad came to dual boot Windows 11 and Fedora KDE Plasma while both Windows PCs run Ubuntu 26.04 in WSL2, what went wrong on the way and what I would do first next time.",
  tags: ["Setup", "Linux", "Windows", "Tools", "Terminal"],
  projectSlug: "dev-environment",
  published: true,
  content: [
    {
      type: "p",
      text: "On 18 October 2026 I sat down and decided which Linux each of my three machines would run. The Mac runs Ubuntu in OrbStack. The gaming PC and my ThinkPad P14s both run Windows 11, because labs, PAL sessions and tools like Proteus and Microchip Studio only exist there. The question was how much Linux to add to each and where it should live.",
    },
    {
      type: "p",
      text: "This post is the record of what I actually built over the following week: Ubuntu 26.04 in WSL2 on both Windows machines, Fedora KDE Plasma dual booted on the ThinkPad only and the gaming PC left without a dual boot on purpose. It covers the order I did things in, the four problems that cost me the most time and what I would do first if I started again. The shorter story of why Fedora is in my note [Putting Fedora beside Windows on my ThinkPad](/notes/fedora-beside-windows-on-my-thinkpad), so I will not repeat it here.",
    },
    {
      type: "h2",
      text: "Who runs what",
    },
    {
      type: "table",
      headers: ["Machine", "Windows", "Linux", "Why"],
      rows: [
        ["Gaming PC", "Windows 11 Pro", "Ubuntu 26.04 in WSL2, with CUDA", "Games stay on Windows. Development happens in WSL2, so there is nothing to gain from a second system on the disk"],
        ["ThinkPad P14s Gen 5 AMD", "Windows 11 Home", "Ubuntu 26.04 in WSL2, plus Fedora KDE Plasma 44 on its own partition", "Real Linux on real hardware: USB serial to my boards, a full systemd and the newest drivers for the Ryzen chip"],
        ["MacBook", "None", "Ubuntu 26.04 in OrbStack", "The lightest way to run Linux-only build tools and test scripts"],
      ],
      caption: "The plan from 18 October 2026, which is what now runs",
    },
    {
      type: "p",
      text: "Ubuntu 26.04 is everywhere because it matches my CI runners and the setup scripts. Fedora is the one exception and it is there to learn on. Windows stays the dependable side on both PCs, which is what made a dual boot feel low risk in the first place.",
    },
    {
      type: "h2",
      text: "WSL2 on both Windows machines",
    },
    {
      type: "p",
      text: "WSL2 (Windows Subsystem for Linux 2) runs a real Linux kernel in a small virtual machine that Windows manages. It went on first, because it gives me a working Linux terminal on each PC before anything risky happens to a disk. One command in an administrator terminal installs it.",
    },
    {
      type: "code",
      lang: "powershell",
      text: `wsl --install -d Ubuntu-26.04
wsl -l -v          # Ubuntu-26.04 should show VERSION 2
wsl --shutdown     # restart WSL after changing .wslconfig`,
    },
    {
      type: "p",
      text: "By default WSL2 can take a large share of the machine's memory. Each PC has its own .wslconfig in the Windows home folder that caps it. The gaming PC gets 10 GB and the ThinkPad 8 GB. On the gaming PC I run wsl --shutdown before a game so Windows gets all of its memory back.",
    },
    {
      type: "code",
      lang: "ini",
      text: `[wsl2]
memory=10GB
processors=8
swap=6GB
[experimental]
autoMemoryReclaim=gradual
sparseVhd=true`,
    },
    {
      type: "p",
      text: "Three rules from the setup that I would give anyone:",
    },
    {
      type: "ul",
      items: [
        "Keep code inside the Linux file system under the home folder, never under /mnt/c. [Files on the Windows drive](https://learn.microsoft.com/en-us/windows/wsl/filesystems) go through a translation layer and builds there are much slower.",
        "Turn on [systemd in WSL](https://learn.microsoft.com/en-us/windows/wsl/systemd). My setup script does it and ps -p 1 -o comm= printing systemd is the check.",
        "On the gaming PC the Windows NVIDIA driver is the only GPU driver. Never install a Linux NVIDIA driver inside WSL. Only the CUDA toolkit goes in, as [NVIDIA's CUDA on WSL guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) says.",
      ],
    },
    {
      type: "p",
      text: "One small surprise: Ubuntu 26.04 has no wslu package, which normally lets Linux open links in the Windows browser. Setting BROWSER=explorer.exe in the shell profile does the same job.",
    },
    {
      type: "h2",
      text: "Preparing the ThinkPad for Fedora",
    },
    {
      type: "p",
      text: "The dual boot was the step that could actually go wrong, so it went in a fixed order. Every step here exists because skipping it can lock you out of Windows or corrupt the disk.",
    },
    {
      type: "ol",
      items: [
        "Update the BIOS and firmware with Lenovo Vantage. Mine was already on Lenovo's latest.",
        "Check the BitLocker recovery key is saved in the Microsoft account, as [Find your BitLocker recovery key](https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key) explains. Never paste it anywhere.",
        "Turn Device Encryption off and wait on mains power. I did not touch the disk until Settings said Off.",
        "Turn off Fast Startup in Power Options. It leaves the Windows drive half hibernated.",
        "Free 150 GB of the 512 GB drive for Fedora and leave it unallocated.",
        "Write the [Fedora KDE Plasma Desktop](https://fedoraproject.org/kde/) image to a USB stick with Fedora Media Writer.",
      ],
    },
    {
      type: "p",
      text: "In the firmware, Secure Boot stayed on. The only change was switching on Allow Microsoft 3rd Party UEFI CA, the certificate the Linux boot loader is signed with. TPM 2.0 and AMD-V were already on.",
    },
    {
      type: "h2",
      text: "What went wrong",
    },
    {
      type: "h3",
      text: "Windows would not shrink its own partition",
    },
    {
      type: "p",
      text: "Disk Management stopped well short of 150 GB, because a part of the file system that Windows cannot move sat in the way. Rather than fight it from inside Windows, I booted the Fedora live USB and shrank the Windows partition with KDE Partition Manager. That left exactly 150 GB unallocated and Windows booted fine afterwards.",
    },
    {
      type: "p",
      text: "Getting into that USB was its own small detour. shutdown /r /fw failed on this laptop with error 203. Settings, System, Recovery, Advanced startup, then Use a device worked every time.",
    },
    {
      type: "h3",
      text: "The passphrase prompt was invisible",
    },
    {
      type: "p",
      text: "Fedora went onto an encrypted Btrfs partition with LUKS (Linux Unified Key Setup), sharing the existing EFI partition with Windows. With my external Samsung monitor plugged in, the graphical passphrase prompt stayed blank. The laptop just sat there waiting for a passphrase I could not see. Removing rhgb from the kernel command line turned the prompt into plain text that shows on every screen.",
    },
    {
      type: "code",
      lang: "bash",
      text: `# plain text boot so the LUKS prompt shows on any monitor
sudo grubby --update-kernel=ALL --remove-args="rhgb"`,
    },
    {
      type: "h3",
      text: "GRUB and BitLocker did not get along",
    },
    {
      type: "p",
      text: "Out of the box GRUB listed Fedora first and Windows last. I wanted Windows first, so I renamed a file to change GRUB's order, which is written up in the TIL [GRUB builds its menu in file name order](/til/grub-windows-first-on-fedora). It worked for a day. Then BitLocker started asking for its recovery key.",
    },
    {
      type: "p",
      text: "BitLocker checks what the TPM (the laptop's security chip) measured during boot. Starting Windows from GRUB changes that measurement, so Windows asked for its recovery key instead of starting. Whenever I missed the moment to pick Fedora, the default dropped me straight into that screen.",
    },
    {
      type: "p",
      text: "The fix was to stop asking GRUB to start Windows at all. Windows Boot Manager stays first in the firmware, so a normal restart goes straight to Windows. Fedora starts from the F12 boot menu. GRUB lists only Fedora and waits five seconds, so an older kernel is still reachable. The TIL has the exact commands.",
    },
    {
      type: "callout",
      tone: "important",
      text: "With BitLocker on, start Windows from the firmware and Linux from the boot menu. Never pick Windows from GRUB and never change the firmware boot order without suspending BitLocker first.",
    },
    {
      type: "p",
      text: "There is one leftover quirk. A restart straight after an F12 boot can land in Fedora once, because the F12 menu leaves Fedora set as the next boot. One more restart fixes it. So does sudo efibootmgr -n with the Windows Boot Manager entry number. The order itself never changes.",
    },
    {
      type: "h3",
      text: "Pasting commands as root",
    },
    {
      type: "p",
      text: "Kitty, my terminal on Fedora, split a long pasted command into separate lines. Once that started an IDE as root. Another time it turned a file move into nothing at all. Since then every admin step goes into a short script that I run with pkexec, which asks for the password through KDE's own dialog. It is slower to write and much harder to get wrong.",
    },
    {
      type: "h2",
      text: "Smaller things worth knowing",
    },
    {
      type: "ul",
      items: [
        "Windows keeps local time in the hardware clock while Linux expects UTC. timedatectl set-local-rtc 1 --adjust-system-clock on Fedora stops either system moving the clock by an hour.",
        "The first update after install was 2,241 packages. Do it before anything else, then add RPM Fusion for full multimedia and run fwupdmgr for firmware.",
        "On KDE, mysql8.0-server conflicts with the MariaDB server that KDE already pulls in. MariaDB covers MySQL for coursework, so I kept that.",
        "Without GVfs on KDE, gio trash fails. Files go to the freedesktop Trash folder instead and ktrash6 --empty empties it.",
        "Kitty needs the XCURSOR variables set to show my yellow pointer, which matters to me because I see with one eye.",
        "With only 150 GB, the big Windows tools (MATLAB, Vivado, LTspice, Proteus and Microchip Studio) stay on Windows. Fedora gets KiCad, Thonny, the Arduino IDE and Zotero. I keep at least 25 GB free.",
      ],
    },
    {
      type: "h2",
      text: "Keeping four Linux systems in step",
    },
    {
      type: "p",
      text: "WSL2 and Fedora on the same laptop share nothing. WSL2 lives in a virtual disk inside the Windows drive and Fedora sits on its own encrypted partition. Each has its own SSH keys, its own clones and its own GitHub sign-in. I never copy keys between them: each system makes its own and they are labelled by machine. The only things they share are GitHub and OneDrive, so the habit is to commit and push before switching.",
    },
    {
      type: "p",
      text: "What keeps this manageable is that none of it is clicked together by hand. The same [setup script](/blog/bootstrap-any-machine-one-command) runs in WSL2, on Fedora and in OrbStack. It learned a dnf path for Fedora during this setup and it links the same shell, editor and terminal configs everywhere. The KDE taskbar, themes and window keys are saved the same way. The keys match Rectangle on my Mac and are in my [KDE window keys gist](https://gist.github.com/zaccesss/9e4f6a3bbac0636f7117e0f567846a5d).",
    },
    {
      type: "diagram",
      code: `flowchart LR
    GH[GitHub and OneDrive] --- W1[Gaming PC: WSL2 Ubuntu 26.04]
    GH --- W2[ThinkPad: WSL2 Ubuntu 26.04]
    GH --- F[ThinkPad: Fedora KDE Plasma 44]
    GH --- O[Mac: OrbStack Ubuntu 26.04]`,
      caption: "Four Linux systems with their own keys and clones, meeting only through GitHub and OneDrive",
    },
    {
      type: "h2",
      text: "What I would do first next time",
    },
    {
      type: "ul",
      items: [
        "Start with WSL2. It covers most terminal work and costs nothing if it goes wrong.",
        "Dual boot only the machine that needs Linux on its hardware. The gaming PC never needed it.",
        "Decide how Windows will be started before turning BitLocker back on. Firmware for Windows and F12 for Linux saved me from the recovery screen.",
        "Expect Windows to refuse to shrink far enough and have the live USB ready to do it.",
        "Put admin commands in a script rather than pasting them.",
        "Write every step down as you go. The full Fedora run is now a guide I can follow on the next laptop. My [development environment project page](/projects/dev-environment) covers the rest of the setup.",
      ],
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Fedora KDE Plasma Desktop download", url: "https://fedoraproject.org/kde/" },
        { text: "Microsoft Learn: install WSL", url: "https://learn.microsoft.com/en-us/windows/wsl/install" },
        { text: "Microsoft Learn: advanced settings in .wslconfig", url: "https://learn.microsoft.com/en-us/windows/wsl/wsl-config" },
        { text: "Microsoft Learn: using systemd in WSL", url: "https://learn.microsoft.com/en-us/windows/wsl/systemd" },
        { text: "NVIDIA: CUDA on WSL user guide", url: "https://docs.nvidia.com/cuda/wsl-user-guide/index.html" },
        { text: "GNU GRUB manual: simple configuration", url: "https://www.gnu.org/software/grub/manual/grub/html_node/Simple-configuration.html" },
        { text: "My gist: GRUB with Windows first on Fedora", url: "https://gist.github.com/zaccesss/568ecf2734c45b061815deb9a029cf85" },
        { text: "WSL2 guide in my public dotfiles", url: "https://github.com/zaccesss/dotfiles/blob/main/setup/linux-bootstrap/docs/wsl2.md" },
      ],
    },
  ],
}

export default _dual_booting_windows_ubuntu_wsl2
