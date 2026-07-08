// Set up Jest environment
jest.useFakeTimers();

// Mock modules
jest.mock('../src/models/Match', () => ({
  find: jest.fn(),
  insertMany: jest.fn()
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

const footballApiService = require('../src/services/api/footballApiService');
const geminiService = require('../src/services/ai/geminiService');
const matchController = require('../src/controllers/matchController');
const aiController = require('../src/controllers/aiController');
const supportController = require('../src/controllers/supportController');
const fanController = require('../src/controllers/fanController');
const Match = require('../src/models/Match');

describe('Backend Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('matchController.getMatches() Fallback Path', () => {
    it('should fallback to footballApiService when DB query fails', async () => {
      // Mock Match.find to throw an error (triggering the fallback path)
      Match.find.mockRejectedValue(new Error('Database query failure'));
      
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await matchController.getMatches(req, res, next);

      expect(Match.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          count: expect.any(Number),
          data: expect.any(Array)
        })
      );
    });
  });

  describe('geminiService Simulation-Mode Paths', () => {
    it('should generate simulated match analysis when API key is missing', async () => {
      const mockMatch = { matchId: 'arg-fra', homeTeam: 'Argentina', awayTeam: 'France' };
      const result = await geminiService.generateMatchAnalysis(mockMatch);
      
      expect(result).toBeDefined();
      expect(result.confidenceScore).toBe(0.70);
      expect(result.engine).toBe('Gemini Simulation Engine');
    });

    it('should return simulated fan sentiments', async () => {
      const positiveSentiment = await geminiService.analyzeFanSentiment('I love Lionel Messi, great win!');
      const negativeSentiment = await geminiService.analyzeFanSentiment('This match sucks, they will lose.');
      const neutralSentiment = await geminiService.analyzeFanSentiment('It was a standard game.');

      expect(positiveSentiment).toBe('POSITIVE');
      expect(negativeSentiment).toBe('NEGATIVE');
      expect(neutralSentiment).toBe('NEUTRAL');
    });

    it('should return simulated fan recommendations', async () => {
      const profile = { favoriteTeam: 'Argentina', favoritePlayer: 'Messi', reasonForSupport: 'Tactics' };
      const recommendations = await geminiService.generateFanRecommendations(profile);

      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBe(3);
      expect(recommendations[0].type).toBe('team');
    });
  });

  describe('footballApiService Cache & Fallback Logic', () => {
    it('should cache matches data and serve from cache on subsequent calls', async () => {
      // Reset cache timestamp to mock expired cache
      footballApiService.cache.matches = { data: null, timestamp: 0 };
      
      const firstCallMatches = await footballApiService.getAllMatches();
      expect(firstCallMatches).toBeInstanceOf(Array);
      
      // Seed cache explicitly to test serving from cache
      const cachedData = [{ matchId: 'cached-id', status: 'FINISHED' }];
      footballApiService.cache.matches = { data: cachedData, timestamp: Date.now() };

      const secondCallMatches = await footballApiService.getAllMatches();
      expect(secondCallMatches).toBe(cachedData);
    });

    it('should fallback to mock data when rapidApiKey and footballDataKey are absent', async () => {
      // Ensure key properties are falsy
      footballApiService.rapidApiKey = null;
      footballApiService.footballDataKey = null;

      const matches = await footballApiService.getAllMatches();
      expect(matches).toBeInstanceOf(Array);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation Edge Cases', () => {
    it('matchController.getMatchById should fail with 400 for invalid ID format', async () => {
      const req = { params: { id: 'invalid/path/manipulation!!' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await matchController.getMatchById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('aiController.postFanChat should fail with 400 when missing fields', async () => {
      const req = { body: {} }; // Missing username/message/matchId
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await aiController.postFanChat(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('supportController.castSupportVote should fail with 444 for unknown teamId', async () => {
      const req = { body: { teamId: 'unknown_country_team_abc' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await supportController.castSupportVote(req, res, next);
      expect(res.status).toHaveBeenCalledWith(444);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('fanController.getRecommendations should default gracefully if profile properties are missing', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await fanController.getRecommendations(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.any(Array) }));
    });
  });
});
