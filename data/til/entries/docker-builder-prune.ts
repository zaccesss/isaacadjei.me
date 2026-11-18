import type { TILEntry } from "../index"

const _docker_builder_prune: TILEntry = {
    id: "docker-builder-prune",
    title: "docker builder prune clears the build cache that image pruning leaves behind",
    date: "2026-11-18",
    category: "DevOps",
    published: true,
    body: "BuildKit keeps its own cache of layers and build mounts that is separate from images. [`docker system df`](https://docs.docker.com/reference/cli/docker/system/df/) lists it as Build Cache. `docker image prune` does not touch it, so a disk can fill up even after the images are gone. [`docker builder prune`](https://docs.docker.com/reference/cli/docker/builder/prune/) removes dangling cache, `-a` removes all unused cache and `--filter until=24h` keeps anything newer than a day. `docker system prune` skips most of it too unless `-a` is added.",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `docker system df                         # see how much is build cache
docker builder prune --filter until=24h  # keep the last day of cache
docker builder prune -a                  # clear all unused cache`,
        caption: "Look first, then prune as much as you need",
      },
      {
        type: "note",
        text: "The next build after a full prune starts cold, so dependency installs run again. A time filter keeps day-to-day builds fast while still clearing months of leftovers.",
      },
    ],
    tags: ["Docker", "DevOps", "disk space"],
    source: { label: "Docker docs: docker builder prune", url: "https://docs.docker.com/reference/cli/docker/builder/prune/" },
    series: "Docker housekeeping",
    seriesPart: 1,
  }

export default _docker_builder_prune
