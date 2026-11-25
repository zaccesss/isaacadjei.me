import type { TILEntry } from "../index"

const _docker_config_env: TILEntry = {
    id: "docker-config-env",
    title: "DOCKER_CONFIG points the Docker CLI at a different config folder",
    date: "2026-11-24",
    category: "DevOps",
    published: true,
    body: "The Docker CLI keeps its client configuration, including registry logins and credential helpers, in `~/.docker/config.json`. Setting the [`DOCKER_CONFIG`](https://docs.docker.com/reference/cli/docker/) environment variable or passing `--config` makes it read a different folder. The flag wins if both are set. That is handy in CI for a throwaway login that disappears with the job. It also keeps two registry accounts apart on one machine. A [credential helper](https://docs.docker.com/reference/cli/docker/login/) configured in the default folder is not used either, so a temporary folder starts with no stored secrets at all.",
    detail: [
      {
        type: "code",
        lang: "bash",
        code: `export DOCKER_CONFIG="$(mktemp -d)"
echo "$REGISTRY_TOKEN" | docker login ghcr.io -u "$REGISTRY_USER" --password-stdin
docker push ghcr.io/example/app:latest
rm -rf "$DOCKER_CONFIG"     # the login goes with the folder`,
        caption: "A login that only exists for one job",
      },
      {
        type: "note",
        text: "The CLI also looks for plugins such as Compose and Buildx in a `cli-plugins` folder inside the config folder. If `docker compose` vanishes after switching, the plugin was only installed in the old folder: system-wide plugin folders still work.",
      },
    ],
    tags: ["Docker", "CI", "DevOps"],
    source: { label: "Docker docs: docker CLI environment variables", url: "https://docs.docker.com/reference/cli/docker/" },
    series: "Docker housekeeping",
    seriesPart: 2,
  }

export default _docker_config_env
