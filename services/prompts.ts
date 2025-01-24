const WRITING_PROMPTS = [
  {
    steps: 20,
    prompts: [
      "What's been on your mind during this walk?",
    ]
  },
  {
    steps: 500,
    prompts: [
      "Think about a challenge you're facing. How might movement help you solve it?",
    ]
  },
  {
    steps: 1000,
    prompts: [
      "What's something you'd like to learn more about?",
    ]
  },
  {
    steps: 2000,
    prompts: [
      "What's a small win you've had recently?",
    ]
  }
] as const;

export function getPromptForSteps(steps: number, previousSteps: number): string | null {
  for (const { steps: threshold, prompts } of WRITING_PROMPTS) {
    // Check if we've crossed the threshold between previous and current steps
    if (previousSteps < threshold && steps >= threshold) {
      return prompts[Math.floor(Math.random() * prompts.length)];
    }
  }
  return null;
} 