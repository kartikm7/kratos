# Kratos

An agentic coding workflow that actually aims to assist you and not replace you.

<img width="937" height="665" alt="Image" src="https://github.com/user-attachments/assets/aff7a27a-d526-4669-8a4c-94b67640d1eb" />

## Getting Started

### Install Kratos:

1. MacOS/Linux

```bash
curl -sS https://raw.githubusercontent.com/kartikm7/kratos/refs/heads/main/scripts/install/install.sh | bash
```

2. Windows

```cmd
irm https://raw.githubusercontent.com/kartikm7/kratos/refs/heads/main/scripts/install/install.ps1 | iex
```

### Adding your first provider

1. Launch `kratos` in your Project directory
2. Type `/connect` on the input bar
3. Choose a provider and paste your API key if need be (incase of using locally running providers you might not need to pass an api key)
4. Now `/model` should show all the available models that your provider provides
5. Once you've selected a model via `/model`, you can start chatting!

## Why Kratos?

All the current Agentic AI solutions are aimed at being addictive, the long term effects of such tools are unknown but I do believe there's an atrophy in skill. I personally find it frustrating that we are all just focused on velocity, and not the details. Engineering solutions have impact not only from architectural decisions but also from code-level reasoning.

More so, I believe a lot of the learnings I got was from doing the grunt-work myself. It not only taught me things, but also gave me confidence that I could achieve something. This, is the biggest regression I see. Since, I don't write the code - I don't understand it as much.

Engineering is a joyous field, it's fun like really really fun and AI is supposed to make our lives easier. But, why let it do the tasks we don't understand? Kratos aims to only do repeatable tasks that the user already knows how to do.

## Current Task List

This is being maintained within `/docs`

## Setup Kratos

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

This project was created using `bun create tui`. [create-tui](https://git.new/create-tui) is the easiest way to get started with OpenTUI.
