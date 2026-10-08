import type { TILEntry } from "../index"

const _apt_acquire_retries: TILEntry = {
    id: "apt-acquire-retries",
    title: "apt retries failed downloads with Acquire::Retries, which has defaulted to 3 since apt 2.3.2",
    date: "2026-10-01",
    category: "Linux",
    published: true,
    body: "[`Acquire::Retries`](https://manpages.debian.org/unstable/apt/apt.conf.5.en.html) sets how many times apt retries a file that failed to download. [apt 2.3.2](https://lists.debian.org/deity/2021/08/msg00014.html) turned it on with a default of 3, so Ubuntu 22.04 and later already retry a little, but a busy mirror on a CI runner can still beat that. Passing `-o Acquire::Retries=5` raises it for one command without touching any config file. A retry only starts once a request has failed, so pairing it with `Acquire::http::Timeout` makes a stalled connection give up sooner and actually reach the retry. The CV PDF workflows on this site set both on every apt call.",
    detail: [
      {
        type: "code",
        lang: "yaml",
        code: `- name: Install PDF tools
  timeout-minutes: 5
  run: |
    sudo apt-get -o Acquire::Retries=5 -o Acquire::http::Timeout=30 update
    sudo apt-get -o Acquire::Retries=5 install -y --no-install-recommends ghostscript`,
        caption: "Retries for flaky mirrors, a short timeout for stalled ones and a step limit as the last line of defence",
      },
      {
        type: "code",
        lang: "bash",
        code: `# the same settings for every apt call on the machine
printf 'Acquire::Retries "5";\\nAcquire::http::Timeout "30";\\n' | sudo tee /etc/apt/apt.conf.d/80-retries`,
        caption: "A drop-in file in apt.conf.d applies to every later apt command",
      },
      {
        type: "note",
        text: "A hung step on a runner is usually a connection that never failed, not one that failed and gave up. Retries alone do not fix that, which is why the timeout matters as much as the retry count.",
      },
    ],
    tags: ["Linux", "apt", "CI"],
    source: { label: "apt.conf(5) manual page", url: "https://manpages.debian.org/unstable/apt/apt.conf.5.en.html" },
    project: { name: "isaacadjei.me", url: "https://isaacadjei.me", slug: "isaacadjei-me" },
  }

export default _apt_acquire_retries
