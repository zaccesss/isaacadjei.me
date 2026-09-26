# Workflows

| Workflow | Runs | What it does |
| --- | --- | --- |
| [ci.yml](ci.yml) | Every push to main and every pull request targeting main | Installs dependencies, then lints, type checks, runs the tests and builds the site |

> [!NOTE]
> The build runs without any service keys. It confirms the site compiles and renders its empty states, which is what a reader running the code locally will see.
