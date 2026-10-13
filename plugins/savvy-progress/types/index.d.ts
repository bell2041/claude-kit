export type Phase = 'plan' | 'design' | 'delegate' | 'review' | 'close'

export type PlannedTask = {
  title: string
  tier: string
  after: number[]
}

export type Flow = {
  title: string
  total: number
  done: number
  running: number
  phase: Phase
  isFinished: boolean
  tasks: PlannedTask[]
}

export type AgentStatus = 'running' | 'done' | 'failed'

export type AgentRun = {
  id: string
  agentId?: string
  type: string
  description: string
  model: string
  effort?: string
  status: AgentStatus
  startedAt: number
  endedAt?: number
  contextTokens: number
  contextMax: number
  tokens: number
  costUsd: number
  steps: number
  round: number
  /** Self-reported by the worker through the `step` tool. */
  stepDone?: number
  stepTotal?: number
  stepNote?: string
}

export type Panel = {
  isCompact: boolean
  isDoneCollapsed: boolean
  autoOpenedFor: string
  /** Finished shells folded under their toggle; absent in state saved before shells existed. */
  isShellsDoneCollapsed?: boolean
}

export type ShellStatus = 'running' | 'done' | 'failed'

/** One Bash call that runs ssh, scp, sftp or rsync over ssh. Never counted in the agents' totals. */
export type ShellRun = {
  /** The Bash call's tool_use_id. */
  id: string
  /** The loop that ran it: a subagent's id, absent on main. */
  agentId?: string
  host: string
  /** The command from the ssh/scp/rsync word on, whitespace collapsed and cut short. */
  command: string
  status: ShellStatus
  isBackground: boolean
  /** The background task's id, from the Bash result. */
  taskId?: string
  /** Where a background shell's output is written, from the Bash result's text. */
  outputPath?: string
  /** The output file's mtime when last read, so an unchanged file is not read again. */
  outputMtime?: number
  /** Set when the shell dies with its subagent's final answer (no notification follows). */
  endsWithAgent?: string
  startedAt: number
  endedAt?: number
  exitCode?: number
  /** Why it ended without an exit code: stopped, interrupted, ended with its agent. */
  endNote?: string
  lastLine?: string
  /** 0-100 from the last line's percentage, when it has one. */
  percent?: number
  /** An N/M counter from the last line, when it has no percentage. */
  countDone?: number
  countTotal?: number
}

declare module 'claude-code' {
  interface PluginState {
    'savvy-progress': {
      flow: Flow | null
      agents: AgentRun[]
      panel: Panel
      now: number
      shells: ShellRun[]
    }
  }
}
