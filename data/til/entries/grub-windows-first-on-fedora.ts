import type { TILEntry } from "../index"

const _grub_windows_first_on_fedora: TILEntry = {
    id: "grub-windows-first-on-fedora",
    title: "GRUB builds its menu in the file name order of /etc/grub.d, so renaming 30_os-prober to 09_os-prober lists Windows first",
    date: "2026-10-21",
    category: "Linux",
    published: true,
    body: "After dual booting Fedora 44 beside Windows 11, the boot menu listed Windows last. `grub2-mkconfig` runs the scripts in `/etc/grub.d` in file name order and pastes their output together, so `10_linux` always wins over `30_os-prober`, the script that finds Windows. Renaming it to `09_os-prober` moves Windows above Fedora. Setting `GRUB_DEFAULT=0` then boots the first entry, which is now Windows, as described in the [GRUB manual](https://www.gnu.org/software/grub/manual/grub/html_node/Simple-configuration.html).",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `sudo mv /etc/grub.d/30_os-prober /etc/grub.d/09_os-prober
sudo sed -i 's/^GRUB_DEFAULT=.*/GRUB_DEFAULT=0/' /etc/default/grub
sudo sed -i 's/^UPDATEDEFAULT=.*/UPDATEDEFAULT=no/' /etc/sysconfig/kernel
sudo grub2-mkconfig -o /boot/grub2/grub.cfg`,
        caption: "The four commands, run on Fedora 44 with grub2 2.12",
      },
      {
        type: "code",
        lang: "text",
        code: `$ ls /etc/grub.d
00_header
00_tuned
01_users
08_fallback_counting
09_os-prober
10_linux
...

$ sudo grep -E "^menuentry|^blscfg|^insmod blscfg" /boot/grub2/grub.cfg
menuentry 'Windows Boot Manager (on /dev/nvme0n1p1)'
insmod blscfg
blscfg`,
        caption: "The Windows entry now comes before blscfg, which draws Fedora's own entries",
      },
      {
        type: "note",
        text: "Fedora keeps its kernel entries as Boot Loader Specification files, read at boot by the `blscfg` line, so they always sit wherever `10_linux` puts that line. `UPDATEDEFAULT=no` stops kernel-install making each new kernel the default, so a kernel update never quietly moves the default back to Fedora.",
      },
    ],
    tags: ["Linux", "systems", "tooling", "GRUB"],
    source: { label: "GNU GRUB manual: Simple configuration", url: "https://www.gnu.org/software/grub/manual/grub/html_node/Simple-configuration.html" },
}

export default _grub_windows_first_on_fedora
