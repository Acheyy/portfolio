export type Variables = {
  trust: number
  insight: number
  approach: number
}

export type Condition = {
  variable: keyof Variables
  op: '>=' | '<=' | '=='
  value: number
}

export type Choice = {
  text: string
  next: string
  effects?: Partial<Variables>
  condition?: Condition
  style?: 'empathetic' | 'aggressive' | 'neutral'
}

export type DialogueNode = {
  id: string
  speaker: 'player' | 'elara' | 'narrator' | 'thought'
  text: string
  emotion?: string
  choices?: Choice[]
  next?: string
  effects?: Partial<Variables>
  ending?: 'empathetic' | 'cold' | 'understanding'
}

export const INITIAL_VARIABLES: Variables = {
  trust: 20,
  insight: 0,
  approach: 0,
}

export const dialogueTree: Record<string, DialogueNode> = {
  // ─── ACT 1: BRIEFING ─────────────────────────────────────────

  'act1-start': {
    id: 'act1-start',
    speaker: 'narrator',
    text: 'Nexus Labs. One of the most advanced AI research facilities in the world. You\'ve been called here for a reason.',
    next: 'act1-brief-1',
  },
  'act1-brief-1': {
    id: 'act1-brief-1',
    speaker: 'narrator',
    text: 'You are a Mind Hacker — someone who can interface directly with human consciousness. Corporations pay you to find the truth when words aren\'t enough.',
    next: 'act1-brief-2',
  },
  'act1-brief-2': {
    id: 'act1-brief-2',
    speaker: 'narrator',
    text: 'Your target: Dr. Elara Voss. Lead AI researcher. Brilliant. Respected. And recently... unstable.',
    next: 'act1-brief-3',
  },
  'act1-brief-3': {
    id: 'act1-brief-3',
    speaker: 'narrator',
    text: 'Missed deadlines. Erratic behavior. Encrypted personal files on company servers. Management suspects corporate espionage.',
    next: 'act1-brief-4',
  },
  'act1-brief-4': {
    id: 'act1-brief-4',
    speaker: 'narrator',
    text: 'Your job: get inside her head — figuratively at first, literally if needed — and find out what she\'s hiding.',
    next: 'act1-brief-5',
  },
  'act1-brief-5': {
    id: 'act1-brief-5',
    speaker: 'narrator',
    text: 'You step into her office. She\'s already waiting, arms crossed. She knows why you\'re here.',
    next: 'act2-meet',
  },

  // ─── ACT 2: FIRST CONTACT ────────────────────────────────────

  'act2-meet': {
    id: 'act2-meet',
    speaker: 'elara',
    text: 'So. You\'re the one they sent to "evaluate" me. Let me guess — I should just relax and answer your questions?',
    emotion: 'defensive',
    choices: [
      {
        text: 'I\'m not here to judge you. I just want to understand what\'s going on.',
        next: 'act2-empathetic-1',
        effects: { trust: 10, approach: 8 },
        style: 'empathetic',
      },
      {
        text: 'I\'m here to do my job. The sooner you cooperate, the sooner this is over.',
        next: 'act2-direct-1',
        effects: { trust: -5, approach: -8 },
        style: 'aggressive',
      },
      {
        text: 'You seem tense. Has something been bothering you lately?',
        next: 'act2-neutral-1',
        effects: { trust: 5, insight: 5 },
        style: 'neutral',
      },
    ],
  },

  'act2-empathetic-1': {
    id: 'act2-empathetic-1',
    speaker: 'elara',
    text: '... That\'s a first. Usually people start with the accusations.',
    emotion: 'surprised',
    effects: { trust: 5 },
    next: 'act2-common-1',
  },

  'act2-direct-1': {
    id: 'act2-direct-1',
    speaker: 'elara',
    text: 'Right. Of course. Just another cog in the machine. Fine — ask your questions.',
    emotion: 'bitter',
    next: 'act2-common-1',
  },

  'act2-neutral-1': {
    id: 'act2-neutral-1',
    speaker: 'elara',
    text: 'Bothering me? That\'s... an understatement. But I don\'t see how that\'s relevant to your "evaluation."',
    emotion: 'guarded',
    effects: { insight: 5 },
    next: 'act2-common-1',
  },

  'act2-common-1': {
    id: 'act2-common-1',
    speaker: 'narrator',
    text: 'She shifts in her chair. Her eyes dart to a locked drawer in her desk, then back to you.',
    effects: { insight: 5 },
    next: 'act2-question-1',
  },

  'act2-question-1': {
    id: 'act2-question-1',
    speaker: 'elara',
    text: 'Look, I know what they think. That I\'m selling secrets or something. It\'s not like that.',
    emotion: 'frustrated',
    choices: [
      {
        text: 'Then tell me what it IS like. I\'m listening.',
        next: 'act2-listen',
        effects: { trust: 10, approach: 5 },
        style: 'empathetic',
      },
      {
        text: 'The encrypted files on the company server — what\'s in them?',
        next: 'act2-confront',
        effects: { trust: -5, insight: 10, approach: -5 },
        style: 'aggressive',
      },
      {
        text: 'I noticed you looked at that drawer just now. What\'s in there?',
        next: 'act2-observe',
        effects: { insight: 15, approach: -2 },
        style: 'neutral',
      },
    ],
  },

  'act2-listen': {
    id: 'act2-listen',
    speaker: 'elara',
    text: 'I... I\'ve been working on something. Something important. And I realized it could be used in ways I never intended. Ways that could hurt people.',
    emotion: 'vulnerable',
    effects: { trust: 10, insight: 10 },
    next: 'act2-deeper',
  },

  'act2-confront': {
    id: 'act2-confront',
    speaker: 'elara',
    text: 'That\'s none of your — it\'s research notes. Personal observations. Nothing that violates my NDA.',
    emotion: 'angry',
    effects: { trust: -5 },
    next: 'act2-deeper',
  },

  'act2-observe': {
    id: 'act2-observe',
    speaker: 'elara',
    text: 'You\'re... observant. It\'s nothing. Just... personal effects.',
    emotion: 'nervous',
    effects: { insight: 5 },
    next: 'act2-deeper',
  },

  'act2-deeper': {
    id: 'act2-deeper',
    speaker: 'narrator',
    text: 'Her composure is cracking. There\'s something beneath the surface — something she desperately wants to say but can\'t bring herself to.',
    next: 'act2-choice-enter',
  },

  'act2-choice-enter': {
    id: 'act2-choice-enter',
    speaker: 'elara',
    text: 'You want the truth? Words aren\'t going to cut it. You\'re a Mind Hacker, aren\'t you? Then... hack.',
    emotion: 'resigned',
    choices: [
      {
        text: 'Are you sure? This is a deeply personal process. I need your consent.',
        next: 'act2-consent',
        effects: { trust: 15, approach: 10 },
        style: 'empathetic',
      },
      {
        text: 'Finally. Let\'s see what you\'re really hiding.',
        next: 'act2-force-enter',
        effects: { trust: -10, approach: -10 },
        style: 'aggressive',
      },
    ],
  },

  'act2-consent': {
    id: 'act2-consent',
    speaker: 'elara',
    text: 'I... yes. I consent. Maybe it\'s time someone knew. Just... be careful in there.',
    emotion: 'afraid',
    effects: { trust: 10 },
    next: 'act3-enter',
  },

  'act2-force-enter': {
    id: 'act2-force-enter',
    speaker: 'elara',
    text: 'Of course. Just another person who takes what they want.',
    emotion: 'bitter',
    next: 'act3-enter',
  },

  // ─── ACT 3: ENTERING THE MIND ────────────────────────────────

  'act3-enter': {
    id: 'act3-enter',
    speaker: 'narrator',
    text: 'You close your eyes and initiate the neural link. The world dissolves. When you open your eyes, you\'re somewhere else entirely.',
    next: 'act3-mindscape',
  },

  'act3-mindscape': {
    id: 'act3-mindscape',
    speaker: 'narrator',
    text: 'Elara\'s mind is structured like a research lab — clean, organized, precise. But the walls are cracking. Fragments of memory leak through like light through shattered glass.',
    next: 'act3-first-memory',
  },

  'act3-first-memory': {
    id: 'act3-first-memory',
    speaker: 'thought',
    text: '"They\'ll find out I\'m not good enough. They always do. Every award, every paper — just luck. Just timing."',
    effects: { insight: 10 },
    next: 'act3-reaction-1',
  },

  'act3-reaction-1': {
    id: 'act3-reaction-1',
    speaker: 'elara',
    text: 'You shouldn\'t be seeing this. These are... private.',
    emotion: 'embarrassed',
    choices: [
      {
        text: 'Imposter syndrome. It\'s more common than you think. Even among the brilliant.',
        next: 'act3-comfort',
        effects: { trust: 10, approach: 8 },
        style: 'empathetic',
      },
      {
        text: 'Interesting. What else are you hiding behind this perfectionist facade?',
        next: 'act3-push',
        effects: { trust: -5, insight: 10, approach: -8 },
        style: 'aggressive',
      },
    ],
  },

  'act3-comfort': {
    id: 'act3-comfort',
    speaker: 'elara',
    text: 'You really think so? Sometimes I feel like the whole world is waiting for me to fail.',
    emotion: 'vulnerable',
    effects: { trust: 5 },
    next: 'act3-second-memory',
  },

  'act3-push': {
    id: 'act3-push',
    speaker: 'elara',
    text: 'You don\'t pull any punches, do you? Fine. Keep looking. You\'ll find what you\'re after eventually.',
    emotion: 'cold',
    next: 'act3-second-memory',
  },

  'act3-second-memory': {
    id: 'act3-second-memory',
    speaker: 'narrator',
    text: 'Another memory surfaces. A phone call. A voice you don\'t recognize.',
    next: 'act3-phone-memory',
  },

  'act3-phone-memory': {
    id: 'act3-phone-memory',
    speaker: 'thought',
    text: '"Dr. Voss, we at Helix Corp would love to discuss an opportunity. Your work on neural mapping is... extraordinary. We can offer you full autonomy. No oversight. No ethical review board breathing down your neck."',
    effects: { insight: 15 },
    next: 'act3-phone-react',
  },

  'act3-phone-react': {
    id: 'act3-phone-react',
    speaker: 'elara',
    text: 'I turned them down. I want you to know that. I turned them down because I believed in what we were building here.',
    emotion: 'defensive',
    choices: [
      {
        text: 'I believe you. But something changed after that call, didn\'t it?',
        next: 'act4-transition',
        effects: { trust: 10, insight: 10, approach: 5 },
        style: 'empathetic',
      },
      {
        text: 'Did you? Or did you keep talking to them behind closed doors?',
        next: 'act4-transition-cold',
        effects: { trust: -10, insight: 5, approach: -10 },
        style: 'aggressive',
      },
      {
        text: 'The ethical review board... what were they reviewing?',
        next: 'act4-transition-insight',
        effects: { insight: 20, approach: 2 },
        style: 'neutral',
        condition: { variable: 'insight', op: '>=', value: 30 },
      },
    ],
  },

  // ─── ACT 4: THE CORE ─────────────────────────────────────────

  'act4-transition': {
    id: 'act4-transition',
    speaker: 'narrator',
    text: 'The mindscape shifts. The clean lab walls crumble, revealing something raw underneath. You\'re getting closer to the core.',
    next: 'act4-core-memory',
  },

  'act4-transition-cold': {
    id: 'act4-transition-cold',
    speaker: 'narrator',
    text: 'Her mental defenses spike — walls of data and noise. But you push through. You\'re trained for this.',
    effects: { trust: -5 },
    next: 'act4-core-memory',
  },

  'act4-transition-insight': {
    id: 'act4-transition-insight',
    speaker: 'elara',
    text: 'You caught that? Most people don\'t... The review board was looking at Project MIRROR. My life\'s work. They wanted to weaponize it.',
    emotion: 'desperate',
    effects: { trust: 5, insight: 10 },
    next: 'act4-core-memory',
  },

  'act4-core-memory': {
    id: 'act4-core-memory',
    speaker: 'narrator',
    text: 'The deepest memory emerges. It\'s dark here, heavy with guilt. This is what she\'s been hiding from everyone — including herself.',
    next: 'act4-the-secret',
  },

  'act4-the-secret': {
    id: 'act4-the-secret',
    speaker: 'thought',
    text: '"I copied the MIRROR source code. I sent it to a journalist. An anonymous tip. If they weaponize it, at least the public will know. At least someone will fight back."',
    effects: { insight: 20 },
    next: 'act4-reveal',
  },

  'act4-reveal': {
    id: 'act4-reveal',
    speaker: 'elara',
    text: 'Now you know. I leaked my own research. Not to a competitor. To the press. Because what they wanted to do with MIRROR... you can\'t let something like that exist in the dark.',
    emotion: 'broken',
    choices: [
      {
        text: 'You did what you thought was right. That took incredible courage.',
        next: 'act4-ending-empathetic',
        effects: { trust: 15, approach: 15 },
        style: 'empathetic',
        condition: { variable: 'trust', op: '>=', value: 40 },
      },
      {
        text: 'You violated your NDA and leaked proprietary technology. I have to report this.',
        next: 'act4-ending-cold',
        effects: { approach: -15 },
        style: 'aggressive',
      },
      {
        text: 'The journalist... did they publish? Did MIRROR actually get stopped?',
        next: 'act4-ending-insight',
        effects: { insight: 15 },
        style: 'neutral',
        condition: { variable: 'insight', op: '>=', value: 50 },
      },
      {
        text: 'I understand why you did it. But was leaking really the only option?',
        next: 'act4-ending-empathetic',
        effects: { trust: 10, approach: 10 },
        style: 'empathetic',
      },
    ],
  },

  // ─── ENDINGS ──────────────────────────────────────────────────

  'act4-ending-empathetic': {
    id: 'act4-ending-empathetic',
    speaker: 'elara',
    text: 'I\'ve been carrying this alone for months. You\'re the first person who didn\'t immediately want to punish me for it.',
    emotion: 'grateful',
    effects: { trust: 10 },
    next: 'ending-empathetic',
  },

  'ending-empathetic': {
    id: 'ending-empathetic',
    speaker: 'narrator',
    text: 'You disconnect from the neural link. Elara is crying quietly, but there\'s relief in her eyes. You help her draft a statement — on her own terms, in her own words. She comes forward voluntarily. It\'s not easy, but for the first time in months, she can breathe.',
    ending: 'empathetic',
  },

  'act4-ending-cold': {
    id: 'act4-ending-cold',
    speaker: 'elara',
    text: 'I knew it. You\'re just like them. You don\'t care about the truth — just the rules.',
    emotion: 'betrayed',
    next: 'ending-cold',
  },

  'ending-cold': {
    id: 'ending-cold',
    speaker: 'narrator',
    text: 'You disconnect and file your report. Every detail, every memory. Elara is terminated within the week. The MIRROR project continues, reclassified under military contract. Six months later, you see the headlines. She was right to be afraid.',
    ending: 'cold',
  },

  'act4-ending-insight': {
    id: 'act4-ending-insight',
    speaker: 'elara',
    text: 'Yes. They published. The exposé forced a congressional hearing. MIRROR was shelved — permanently. The data I leaked... it saved lives. I know it did.',
    emotion: 'resolute',
    effects: { insight: 10, trust: 10 },
    next: 'ending-understanding',
  },

  'ending-understanding': {
    id: 'ending-understanding',
    speaker: 'narrator',
    text: 'You disconnect. For a long moment, neither of you speaks. Then you close your case file and mark it: "No actionable findings." She looks at you, stunned. You nod. Some truths are better left unhacked. MIRROR stays dead, and Elara Voss keeps building — this time, on her own terms.',
    ending: 'understanding',
  },
}

export const ENDINGS = {
  empathetic: {
    title: 'The Confessor',
    description: 'You helped Elara come forward on her own terms. Empathy over protocol.',
    color: '#34d399',
  },
  cold: {
    title: 'The Professional',
    description: 'You followed procedure. The truth came out — but at what cost?',
    color: '#f87171',
  },
  understanding: {
    title: 'The Ally',
    description: 'You saw the full picture. Sometimes justice means looking the other way.',
    color: '#60a5fa',
  },
} as const
