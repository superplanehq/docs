---
title: Runners
description: How SuperPlane runs shell commands and scripts on remote machines as part of workflows.
---

**Runners** are worker machines that execute custom scripts from your workflows. SuperPlane provides components for
executing shell commands, bash scripts, JavaScript, and Python scripts.

- [Running Shell Commands](#running-shell-commands)
- [Running Bash Scripts](#running-bash-scripts)
- [Running JavaScript](#running-javascript)
- [Running Python](#running-python)

## Running Shell Commands

Runs shell commands on a runner machine. Commands execute in order. The task succeeds when the last
command exits with code **0**, or fails if any command exits with a non-zero code.

Example:

```sh
git clone https://github.com/example/repo.git
cd repo
docker build -t example-image .
docker push example-image
```

### Passing output to the next node

To pass output from the commands to the next node on the canvas, write valid JSON to the
**`$SUPERPLANE_RESULT_FILE`** file — the path the runner sets for your task.

```sh
git clone https://github.com/example/repo.git
cd repo

export IMAGE_TAG=example-image-$(git rev-parse HEAD)
docker build -t $IMAGE_TAG .
docker push $IMAGE_TAG

echo "{\"image\": \"$IMAGE_TAG\"}" > $SUPERPLANE_RESULT_FILE
```

## Running Bash Scripts

Runs a Bash script on a runner machine. The task succeeds when the script exits with code **0**, or fails if the
script exits with a non-zero code.

Example:

```sh
#!/bin/bash

set -euo pipefail

for i in {1..10}; do
  echo "Hello, world! $i"
done
```

### Passing output to the next node

To pass output from the script to the next node on the canvas, write valid JSON to the
**`$SUPERPLANE_RESULT_FILE`** file — the path the runner sets for your task.

```sh
#!/bin/bash

set -euo pipefail

git clone https://github.com/example/repo.git
cd repo

docker build -t example-image .
docker push example-image

export IMAGE_TAG=example-image-$(git rev-parse HEAD)
docker build -t $IMAGE_TAG .
docker push $IMAGE_TAG

echo "{\"message\":\"Hello, world!\"}" > $SUPERPLANE_RESULT_FILE
```

## Running JavaScript

Runs a JavaScript script on a runner machine.

Example:

```javascript
function main() {
  return { message: "Hello, world!" };
}
```

### Reading payloads from previous nodes

The script can read payloads from previous nodes using the `$` object.

Example:

```javascript
function main() {
  const commitSHA = $["On Git Push"].data.after;
  const commitMessage = $["On Git Push"].data.message;

  const imageTag = `example-image-${commitSHA}`;

  return { imageTag: imageTag };
}
```

### Passing output to the next node

The script returns a JSON object that is passed to the next node on the canvas.

```javascript
function main() {
  return { message: "Hello, world!" };
}
```

### Installing node packages

Before executing the script, the runner can install node packages using the `npm install` command as part
of the setup commands.

Setup commands:

```bash
npm install @octokit/rest
```

Script:

```javascript
function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'octokit',
    repo: 'octokit.js',
    path: 'README.md',
  });

  return { contents: response.data };
}
```

## Running Python

Runs a Python script on a runner machine.

Example:

```python
def main():
  return { message: "Hello, world!" }
```

### Reading payloads from previous nodes

The script can read payloads from previous nodes using the `$` object.

Example:

```python
def main():
  const commitSHA = $["On Git Push"].data.after;
  const commitMessage = $["On Git Push"].data.message;

  const imageTag = `example-image-${commitSHA}`;

  return { imageTag: imageTag };
}
```

### Passing output to the next node

The script returns a JSON object that is passed to the next node on the canvas.

```python
def main():
  return { message: "Hello, world!" }
```

### Installing Python packages

Before executing the script, the runner can install Python packages using the `pip install` command as part
of the setup commands.

Setup commands:

```bash
pip install @octokit/rest
```

Script:

```python
import octokit
def main():
  octokit = octokit.Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'octokit',
    repo: 'octokit.js',
    path: 'README.md',
  })

  return { contents: response.data }
```

## Machine types

Every runner node requires a **machine type** that will run your script. Pick one
that matches the architecture and size your workload needs.

| Machine type     | Architecture | vCPUs | Memory |
| ---------------- | ------------ | ----- | ------ |
| `e1-large-amd64` | AMD64        | 4     | 16GB   |
| `e1-large-arm64` | ARM64        | 4     | 16GB   |
| `e1-tiny-amd64`  | AMD64        | 0.5   | 1GB    |
| `e1-tiny-arm64`  | ARM64        | 0.5   | 1GB    |

## Host and Docker modes

Every task runs in one of two execution modes:

| Execution mode | Where work runs                          |
| -------------- | ---------------------------------------- |
| **Host**       | Directly on the runner machine (default) |
| **Docker**     | Inside a container image you choose      |

Use **Docker** when you need an isolated environment or a specific toolchain image.

## When to use runners

Use runner components when a workflow step needs code or shell that SuperPlane integrations do not cover:

- Run build scripts, linters, or custom tooling on dedicated machines
- Transform upstream payload data with JavaScript or Python and pass structured output downstream
- Execute in a specific container image without managing SSH or long-lived hosts

For remote commands on a host you manage directly, consider [SSH Command](/components/core/#ssh-command)
instead. For HTTP or API calls, use [HTTP Request](/components/core/#http-request).

For more on how payloads flow between nodes, see [Data Flow](/concepts/data-flow). For expression
syntax inside runner scripts and node configuration, see [Expressions](/concepts/expressions).
