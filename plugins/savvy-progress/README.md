# savvy-progress

A Claude Code mod: a progress bar above the prompt and a live panel of subagents. Made for the [savvy-flow](../savvy-flow) skill, and useful with any subagents.

- **Progress bar**: the flow's title, phase, accepted tasks out of planned, and a button with the crew size that opens the panel. It appears once something reports progress (savvy-flow does) or a `savvy-*` worker starts.
- **Agents panel** (`/agents-info` toggles it; `/agents-info open` opens it or brings it forward without toggling): running, finished and planned subagents with model, effort, task progress, context, estimated cost and time. Working crabs walk, and each savvy tier animates its prop: the astronaut floats, the detective sweeps the magnifier, the engineer turns the wrench, the chef tosses the omelette, the racer runs with a fluttering flag. `prefers-reduced-motion` stops them.
- **SSH shells**: a Bash call whose command runs `ssh`, `scp`, `sftp` or `rsync` to a remote host gets a row under its own **Shells** heading in the panel: host, the command cut short, a running / ok / error mark, elapsed time, and the last line of output. A percentage (`rsync --info=progress2`, `pv -f`) or an `N/M` counter in that line draws a bar; otherwise the row shows elapsed time only. While any runs, a line above the prompt says `ssh: 2 running · anny 3m12s`, under the flow's bar when there is one; pressing it opens the panel. Shells are never counted in the agents' cost and token totals. Finished shells fold like finished agents, and the last 200 are kept.

  What it can see: the command's own text (an `ssh` inside a script it calls is not seen). A foreground command's output reaches a mod only when it ends, so its last line and bar appear then; a background command (`run_in_background`, Ctrl+B, or one past its timeout) is followed live from its output file once a second and ends when its task notification arrives. `scp` and `pv` print no meter without a terminal (`pv -f` forces one).

## Tools it adds

- `mcp__savvy-progress__progress`: the orchestrator reports the plan, phase and accepted tasks. Only the main session can: a call from a subagent is ignored, so a worker cannot rename, finish or reset the flow.
- `mcp__savvy-progress__step`: a worker reports its own steps (`done`, `total`, `note`). A worker that does not report shows its context fill in grey instead. The tool is listed up front rather than behind ToolSearch, and each `savvy-*` worker gets one line at the end of its brief asking for these reports.

Cost is a rough estimate from token counts and a built-in per-model price table (`PRICES` in `hooks/register.tsx`, list prices as of 2026-10-10), not a bill. Cache writes are priced at the 1-hour rate, which is what Claude Code writes on a subscription; a session that writes 5-minute entries is overestimated there.

## Settings

`language`: `auto` (default), `en`, `ru` or `he`. Hebrew draws the bar and the panel right to left. `auto` follows Claude Code's `language` setting, then the system locale, and falls back to English. Set it in `/config`, or, for a mod loaded by hand, in `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "savvy-progress": { "options": { "language": "ru" } } } }
```

`autoOpen`: `savvy` (default) or `any`. With `savvy` the panel opens by itself when a `savvy-*` worker starts or a plan is reported. With `any` it also opens, once per session, when any other subagent starts. `/agents-info` toggles it either way.

Install instructions are in the [repository README](../../README.md).
