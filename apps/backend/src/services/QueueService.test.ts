import { QueueService, ACTION_TYPES } from './QueueService';

describe('QueueService', () => {
  let queueService: QueueService;

  beforeEach(() => {
    queueService = new QueueService();
  });

  describe('enqueue', () => {
    it('should add an action to the queue if it is valid', () => {
      queueService.enqueue('A');
      expect(queueService.getActions()).toEqual(['A']);
    });

    it('should throw an error if the action is invalid', () => {
      expect(() => queueService.enqueue('D')).toThrow();
    });
  });

  describe('shift', () => {
    it('should remove and return the first action in the queue if it has enough credits', () => {
      queueService.enqueue('A');
      const action = queueService.shift();
      expect(action).toBe('A');
      expect(queueService.getActions()).toEqual([]);
    });

    it('should throw an error if the queue is empty', () => {
      expect(() => queueService.shift()).toThrow();
    });

    it('should throw an error if the first action does not have enough credits', () => {
      const credits = queueService.getCredits();
      const creditsA = credits['A'];

      // Adding and shifting creditsA times the action to burn all the credits
      for (let i = 0; i < creditsA; i++) queueService.enqueue('A');
      for (let i = 0; i < creditsA; i++) queueService.shift();

      const newCredits = queueService.getCredits();
      const newCreditsA = newCredits['A'];

      queueService.enqueue('A');
      expect(newCreditsA).toBe(0);
      expect(() => queueService.shift()).toThrow('Not enough credits');
    });
  });

  describe('getActions', () => {
    it('should return the current queue of actions', () => {
      queueService.enqueue('A');
      queueService.enqueue('B');
      expect(queueService.getActions()).toEqual(['A', 'B']);
    });
  });

  describe('getCredits', () => {
    it('should return the current credits for all actions', () => {
      const credits = queueService.getCredits();
      expect(Object.keys(credits)).toEqual(ACTION_TYPES);
      for (const type of ACTION_TYPES) {
        expect(credits[type]).toBeGreaterThanOrEqual(0);
        expect(credits[type]).toBeLessThanOrEqual(15);
      }
    });
  });

  describe('recalculateCredits', () => {
    it('should reset credits and have the same actions', () => {
      const initialCredits = queueService.getCredits();
      queueService.recalculateCredits();
      const newCredits = queueService.getCredits();
      expect(
        Object.keys(newCredits).sort((a, b) => a.localeCompare(b))
      ).toEqual(Object.keys(initialCredits).sort((a, b) => a.localeCompare(b)));
    });
  });

  describe('private methods', () => {
    it('should generate random credits within the expected range', () => {
      const maxCredits = 10;
      const generateRandomCredit = (
        queueService as any
      ).generateRandomCredit.bind(queueService);
      for (let i = 0; i < 100; i++) {
        const credit = generateRandomCredit(maxCredits);
        expect(credit).toBeGreaterThanOrEqual(8);
        expect(credit).toBeLessThanOrEqual(10);
      }
    });
  });
});
