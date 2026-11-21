import type { TILEntry } from "../index"

const _wsl2_real_linux_kernel: TILEntry = {
    id: "wsl2-real-linux-kernel",
    title: "WSL2 runs a real Linux kernel in a lightweight VM",
    date: "2026-11-21",
    category: "Linux",
    published: true,
    body: "[WSL 1 translated Linux system calls](https://learn.microsoft.com/en-us/windows/wsl/compare-versions) into Windows ones, while WSL 2 runs an actual Linux kernel inside a lightweight utility virtual machine. That gives full system call compatibility, which is why Docker and other tools that need real kernel features work. The trade-off is that files on the Windows side, under `/mnt/c`, are [much slower to reach](https://learn.microsoft.com/en-us/windows/wsl/filesystems) from Linux than files in the Linux file system. So projects belong in your Linux home folder.",
    detail: [
      {
        type: "code",
        lang: "powershell",
        code: `wsl --list --verbose     # VERSION column shows 1 or 2 per distro
wsl --set-version Ubuntu 2
wsl --update             # updates WSL, including its Linux kernel`,
        caption: "Checking and switching versions from PowerShell",
      },
      {
        type: "code",
        lang: "bash",
        code: `uname -r          # ends in -microsoft-standard-WSL2
mkdir -p ~/dev && cd ~/dev     # repositories here are fast, /mnt/c is slow`,
        caption: "Inside the distro: confirm the kernel and keep repositories under ~",
      },
      {
        type: "note",
        text: "WSL 2 sits behind NAT by default, so its IP address changes on restart. Reach a server running inside it from Windows on `localhost` rather than a hard-coded address.",
      },
    ],
    tags: ["WSL", "Linux", "Windows"],
    source: { label: "Microsoft Learn: comparing WSL versions", url: "https://learn.microsoft.com/en-us/windows/wsl/compare-versions" },
  }

export default _wsl2_real_linux_kernel
