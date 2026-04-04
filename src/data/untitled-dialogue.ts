export type DialogueTrigger =
  | { type: 'start' }
  | { type: 'position'; x: number }
  | { type: 'goal' }
  | { type: 'after'; afterId: string; delay: number }
  | { type: 'at-death-spot' }
  | { type: 'idle'; duration: number }

export type DialogueCondition =
  | { type: 'deaths'; min: number }
  | { type: 'no-deaths' }

export type DialogueLine = {
  id: string
  text: string
  trigger: DialogueTrigger
  duration: number
  blocking?: boolean
  condition?: DialogueCondition
  requireGround?: boolean
}

export type ActiveDialogue = {
  id: string
  text: string
  elapsed: number
  duration: number
  charsRevealed: number
  blocking: boolean
}

export const DIALOGUE: Record<number, DialogueLine[]> = {
  0: [
    {
      id: 'l1-wake',
      text: 'Where am I?',
      trigger: { type: 'start' },
      duration: 300,
      blocking: true,
    },
    {
      id: 'l1-wake2',
      text: 'Have I been here this whole time?',
      trigger: { type: 'after', afterId: 'l1-wake', delay: 60 },
      duration: 280,
      blocking: true,
    },
    {
      id: 'l1-empty',
      text: 'It feels... empty.',
      trigger: { type: 'position', x: 700 },
      duration: 280,
      blocking: true,
    },
    {
      id: 'l1-door',
      text: "A door... Maybe there's something on the other side.",
      trigger: { type: 'goal' },
      duration: 320,
    },
  ],

  1: [
    {
      id: 'l2-start',
      text: "I'm still here.",
      trigger: { type: 'start' },
      duration: 260,
      blocking: true,
    },
    {
      id: 'l2-familiar',
      text: 'Why does this feel familiar?',
      trigger: { type: 'after', afterId: 'l2-start', delay: 60 },
      duration: 280,
      blocking: true,
      condition: { type: 'no-deaths' },
    },
    {
      id: 'l2-fallen',
      text: "...I think I've fallen here before.",
      trigger: { type: 'at-death-spot' },
      duration: 300,
      condition: { type: 'deaths', min: 1 },
      requireGround: true,
    },
    {
      id: 'l2-why',
      text: 'Why do I keep trying?',
      trigger: { type: 'position', x: 300 },
      duration: 300,
      condition: { type: 'deaths', min: 3 },
      requireGround: true,
    },
    {
      id: 'l2-door',
      text: 'Another door.',
      trigger: { type: 'goal' },
      duration: 240,
    },
  ],

  2: [
    {
      id: 'l3-start',
      text: 'This feels different.',
      trigger: { type: 'start' },
      duration: 260,
      blocking: true,
    },
    {
      id: 'l3-start-2',
      text: "...No, it doesn't.",
      trigger: { type: 'after', afterId: 'l3-start', delay: 40 },
      duration: 260,
      blocking: true,
    },
    {
      id: 'l3-remember',
      text: 'I think I remember this part.',
      trigger: { type: 'position', x: 400 },
      duration: 280,
    },
    {
      id: 'l3-remember-2',
      text: "But that doesn't make sense.",
      trigger: { type: 'after', afterId: 'l3-remember', delay: 50 },
      duration: 260,
    },
    {
      id: 'l3-death',
      text: "That shouldn't have happened.",
      trigger: { type: 'at-death-spot' },
      duration: 260,
      condition: { type: 'deaths', min: 1 },
      requireGround: true,
    },
    {
      id: 'l3-death-2',
      text: '...or maybe it always does.',
      trigger: { type: 'after', afterId: 'l3-death', delay: 40 },
      duration: 280,
    },
    {
      id: 'l3-self',
      text: 'Was I trying to get somewhere?',
      trigger: { type: 'position', x: 1800 },
      duration: 300,
    },
    {
      id: 'l3-self-2',
      text: 'Or just... moving?',
      trigger: { type: 'after', afterId: 'l3-self', delay: 50 },
      duration: 260,
    },
    {
      id: 'l3-stop',
      text: 'If I stop...',
      trigger: { type: 'idle', duration: 180 },
      duration: 240,
    },
    {
      id: 'l3-stop-2',
      text: '...does it stop too?',
      trigger: { type: 'after', afterId: 'l3-stop', delay: 40 },
      duration: 260,
    },
    {
      id: 'l3-door',
      text: 'Another door.',
      trigger: { type: 'goal' },
      duration: 240,
    },
    {
      id: 'l3-door-2',
      text: "I think I've seen this before.",
      trigger: { type: 'after', afterId: 'l3-door', delay: 40 },
      duration: 260,
    },
    {
      id: 'l3-end',
      text: "I don't think it matters.",
      trigger: { type: 'after', afterId: 'l3-door-2', delay: 60 },
      duration: 300,
    },
  ],
}

const TYPEWRITER_SPEED = 3

export type DialogueState = {
  active: ActiveDialogue | null
  shownIds: Set<string>
  pendingDelay: number
  pendingLine: DialogueLine | null
  levelDeaths: number
  lastDeathX: number | null
  idleFrames: number
}

export function createDialogueState(): DialogueState {
  return {
    active: null,
    shownIds: new Set(),
    pendingDelay: 0,
    pendingLine: null,
    levelDeaths: 0,
    lastDeathX: null,
    idleFrames: 0,
  }
}

export function recordDeath(
  state: DialogueState,
  x: number,
  levelIdx: number,
) {
  state.levelDeaths += 1
  state.lastDeathX = x
  const lines = DIALOGUE[levelIdx]
  if (lines) {
    for (const line of lines) {
      if (line.trigger.type === 'at-death-spot') {
        state.shownIds.delete(line.id)
      }
    }
  }
}

export function tickDialogue(active: ActiveDialogue): ActiveDialogue {
  const maxChars = active.text.length
  const newChars = Math.min(
    maxChars,
    active.charsRevealed + (active.elapsed % TYPEWRITER_SPEED === 0 ? 1 : 0),
  )
  return {
    ...active,
    elapsed: active.elapsed + 1,
    charsRevealed: newChars,
  }
}

export function isDialogueFinished(active: ActiveDialogue): boolean {
  return active.elapsed >= active.duration
}

export function startDialogue(line: DialogueLine): ActiveDialogue {
  return {
    id: line.id,
    text: line.text,
    elapsed: 0,
    duration: line.duration,
    charsRevealed: 0,
    blocking: line.blocking ?? false,
  }
}

export function isBlocking(state: DialogueState): boolean {
  if (state.active?.blocking) return true
  if (state.pendingLine?.blocking) return true
  return false
}

function meetsCondition(
  condition: DialogueCondition | undefined,
  state: DialogueState,
): boolean {
  if (!condition) return true
  switch (condition.type) {
    case 'deaths':
      return state.levelDeaths >= condition.min
    case 'no-deaths':
      return state.levelDeaths === 0
  }
}

export function checkTriggers(
  levelIdx: number,
  playerX: number,
  goalX: number,
  state: DialogueState,
  isStart: boolean,
  onGround?: boolean,
): DialogueLine | null {
  const lines = DIALOGUE[levelIdx]
  if (!lines) return null

  for (const line of lines) {
    if (state.shownIds.has(line.id)) continue
    if (!meetsCondition(line.condition, state)) continue
    if (line.requireGround && !onGround) continue

    switch (line.trigger.type) {
      case 'start':
        if (isStart) return line
        break
      case 'position':
        if (playerX >= line.trigger.x) return line
        break
      case 'goal':
        if (playerX >= goalX - 600) return line
        break
      case 'after':
        if (state.shownIds.has(line.trigger.afterId)) return line
        break
      case 'at-death-spot':
        if (state.lastDeathX !== null && playerX >= state.lastDeathX - 40)
          return line
        break
      case 'idle':
        if (state.idleFrames >= line.trigger.duration) return line
        break
    }
  }
  return null
}
