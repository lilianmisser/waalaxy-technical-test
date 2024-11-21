export const ACTION_TYPES = ['A', 'B', 'C'];

const MAX_CREDITS_TYPE = {
  A: 10,
  B: 10,
  C: 15,
};

export class QueueService {
  private queue: string[] = [];
  private credits: Map<string, number> = this.computeCredits();

  enqueue(action: string): void {
    if (!ACTION_TYPES.includes(action)) {
      throw new Error('Invalid action');
    }
    this.queue.push(action);
  }

  shift() {
    if (this.queue.length === 0) {
      throw new Error('Queue is empty');
    }
    const actionCredits = this.credits.get(this.queue[0]);
    if (!actionCredits || actionCredits < 1) {
      throw new Error('Not enough credits');
    }
    this.credits.set(this.queue[0], actionCredits - 1);
    return this.queue.shift();
  }

  getActions() {
    return this.queue;
  }

  getCredits() {
    return Object.fromEntries(this.credits);
  }

  recalculateCredits() {
    this.credits = this.computeCredits();
  }

  private computeCredits() {
    const result = new Map();
    for (const action of ACTION_TYPES) {
      result.set(action, this.generateRandomCredit(MAX_CREDITS_TYPE[action]));
    }
    return result;
  }

  private generateRandomCredit(maxCredits: number): number {
    return Math.round((Math.random() * 0.2 + 0.8) * maxCredits);
  }
}
