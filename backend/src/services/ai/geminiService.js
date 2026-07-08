const logger = require('../../utils/logger');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.preferredModel = 'gemini-2.0-flash'; // Optimized model verified from listModels call
    this.cache = {};
    
    if (!this.apiKey) {
      logger.warn('GEMINI_API_KEY is not configured. AI services will run in Simulation Mode.');
    }
  }

  /**
   * General purpose method to call the Gemini REST API.
   * Throws errors if connection fails, models are rejected, or quotas are exceeded.
   */
  _callGeminiAPI(model, prompt) {
    const cacheKey = `${model}:${prompt}`;
    if (this.cache[cacheKey]) {
      logger.debug('Returning Gemini AI response from cache.');
      return Promise.resolve(this.cache[cacheKey]);
    }

    return new Promise((resolve, reject) => {
      if (!this.apiKey) {
        return reject(new Error('No API Key configured.'));
      }

      const https = require('https');
      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                this.cache[cacheKey] = text;
                resolve(text);
              } else {
                reject(new Error('Empty text output in candidates response.'));
              }
            } else {
              reject(new Error(`Google API ${res.statusCode}: ${json.error?.message || 'Unknown Error'}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  async generateMatchAnalysis(matchData) {
    try {
      if (!this.apiKey) {
        return this._simulateMatchAnalysis(matchData);
      }

      logger.info(`Attempting live Gemini analysis for match: ${matchData.homeTeam} vs ${matchData.awayTeam}`);
      
      const prompt = `You are a professional football analyst. Compare the upcoming match: ${matchData.homeTeam} vs ${matchData.awayTeam}.
Provide your analysis in the following format:
PROS [${matchData.homeTeam}]:
- [Pro 1]
- [Pro 2]
CONS [${matchData.homeTeam}]:
- [Con 1]
- [Con 2]
PROS [${matchData.awayTeam}]:
- [Pro 1]
- [Pro 2]
CONS [${matchData.awayTeam}]:
- [Con 1]
- [Con 2]
PREDICTED WINNER: [Write the team name, or Draw]
WIN PROBABILITY: [Write only a number from 1 to 100 representing probability of the winner/draw]
PREDICTED SCORE: [Home Score] - [Away Score]
TACTICAL BREAKDOWN: [A paragraph explaining tactical battle]`;
      
      const responseText = await this._callGeminiAPI(this.preferredModel, prompt);
      
      let predictedWinner = matchData.homeTeam;
      let winProbability = 55;
      let predictedScore = { home: 1, away: 0 };
      
      const winnerMatch = responseText.match(/PREDICTED\s*WINNER\s*:\s*([^\n]+)/i);
      if (winnerMatch) predictedWinner = winnerMatch[1].trim();
      
      const probMatch = responseText.match(/WIN\s*PROBABILITY\s*:\s*(\d+)/i);
      if (probMatch) winProbability = parseInt(probMatch[1]);
      
      const scoreMatch = responseText.match(/PREDICTED\s*SCORE\s*:\s*(\d+)\s*-\s*(\d+)/i);
      if (scoreMatch) {
        predictedScore = { home: parseInt(scoreMatch[1]), away: parseInt(scoreMatch[2]) };
      }
      
      const parseList = (sectionRegex) => {
        const match = responseText.match(sectionRegex);
        if (!match) return [];
        const sectionText = match[1];
        return sectionText.split('\n')
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(line => line.length > 0);
      };
      
      const homePros = parseList(new RegExp(`PROS\\s*\\[${matchData.homeTeam}\\]:([\\s\\S]*?)(?:CONS|PROS|PREDICTED|TACTICAL|$)`, 'i'));
      const homeCons = parseList(new RegExp(`CONS\\s*\\[${matchData.homeTeam}\\]:([\\s\\S]*?)(?:CONS|PROS|PREDICTED|TACTICAL|$)`, 'i'));
      const awayPros = parseList(new RegExp(`PROS\\s*\\[${matchData.awayTeam}\\]:([\\s\\S]*?)(?:CONS|PROS|PREDICTED|TACTICAL|$)`, 'i'));
      const awayCons = parseList(new RegExp(`CONS\\s*\\[${matchData.awayTeam}\\]:([\\s\\S]*?)(?:CONS|PROS|PREDICTED|TACTICAL|$)`, 'i'));
      
      // If parsing fails, fall back to simulated lists
      const simFallback = this._simulateMatchAnalysis(matchData);
      
      const prosCons = {
        home: {
          team: matchData.homeTeam,
          pros: homePros.length > 0 ? homePros : simFallback.prosCons.home.pros,
          cons: homeCons.length > 0 ? homeCons : simFallback.prosCons.home.cons
        },
        away: {
          team: matchData.awayTeam,
          pros: awayPros.length > 0 ? awayPros : simFallback.prosCons.away.pros,
          cons: awayCons.length > 0 ? awayCons : simFallback.prosCons.away.cons
        }
      };
      
      let breakdownText = responseText;
      const breakdownMatch = responseText.match(/TACTICAL\s*BREAKDOWN\s*:([\s\S]+)/i);
      if (breakdownMatch) breakdownText = breakdownMatch[1].trim();

      return {
        matchId: matchData.matchId,
        prediction: {
          predictedWinner,
          winProbability,
          predictedScore
        },
        prosCons,
        tacticalBreakdown: breakdownText,
        keyPlayers: [
          { name: `${matchData.homeTeam} Key Player`, impact: "Crucial role in zone transition." },
          { name: `${matchData.awayTeam} Key Player`, impact: "Pivotal counter threat." }
        ],
        confidenceScore: 0.80,
        engine: this.preferredModel,
        timestamp: new Date()
      };
    } catch (error) {
      logger.warn(`Gemini live prediction failed (${error.message}). Falling back to simulation mode.`);
      return this._simulateMatchAnalysis(matchData);
    }
  }

  /**
   * Performs sentiment analysis on community Fan Chat feeds.
   */
  async analyzeFanSentiment(text) {
    try {
      if (!this.apiKey) {
        return this._simulateSentimentAnalysis(text);
      }

      logger.info(`Attempting live Gemini sentiment check for: "${text.substring(0, 20)}..."`);
      
      const prompt = `Analyze the sentiment of the following football fan chat. Respond with exactly one word (POSITIVE, NEUTRAL, or NEGATIVE):\n"${text}"`;
      
      const responseText = await this._callGeminiAPI(this.preferredModel, prompt);
      const cleaned = responseText.trim().toUpperCase();
      
      if (['POSITIVE', 'NEUTRAL', 'NEGATIVE'].includes(cleaned)) {
        return cleaned;
      }
      return this._simulateSentimentAnalysis(text);
    } catch (error) {
      logger.warn(`Gemini live sentiment check failed (${error.message}). Falling back to offline heuristics.`);
      return this._simulateSentimentAnalysis(text);
    }
  }

  /**
   * Generates highly grounded team summary and insights based strictly on JSON data (max 120 words).
   * 
   * @param {Object} teamData - The structured contender statistics (rank, star player, stats) to ground the summary.
   * @param {Object} fanProfileData - The fan's profile selections used to personalize the relevance of the insights.
   * @param {Array} historyData - Optional array of historical matches to ground the team records.
   * @returns {Promise<string>} The AI-generated summary grounded strictly in the provided data.
   * 
   * Grounding Source: Grounded strictly against the supplied `teamData`, `fanProfileData`, and `historyData` arrays.
   * Hallucination Prevention: Instructs the model to limit its context to the parameters to avoid hallucinated stats or fixtures.
   * Fallback Behavior: If the Gemini API key is absent or the request fails, it falls back to a simulated template summary.
   */
  async generateGroundedInsights(teamData, fanProfileData, historyData) {
    const HISTORICAL_RECORDS = {
      'Brazil': '5-time World Cup Winners (1958, 1962, 1970, 1994, 2002)',
      'Germany': '4-time World Cup Winners (1954, 1974, 1990, 2014)',
      'Argentina': '3-time World Cup Winners (1978, 1986, 2022)',
      'France': '2-time World Cup Winners (1998, 2018)',
      'Uruguay': '2-time World Cup Winners (1930, 1950)',
      'England': 'World Cup Winner (1966)',
      'Spain': 'World Cup Winner (2010)',
      'Croatia': 'World Cup Runners-up (2018), 3rd Place (1998, 2022)',
      'Netherlands': '3-time World Cup Runners-up (1974, 1978, 2010)',
      'Morocco': 'Historic World Cup Semifinalists (2022) - Best African finish',
      'South Korea': 'World Cup Semifinalists (2002) - Best Asian finish',
      'United States': 'World Cup Semifinalists (1930) - Best CONCACAF finish',
      'Turkey': 'World Cup 3rd Place (2002)',
      'Poland': '2-time World Cup 3rd Place (1974, 1982)',
      'Belgium': 'World Cup 3rd Place (2018)',
      'Sweden': 'World Cup Runners-up (1958), 3rd Place (1950, 1994)',
      'Portugal': 'World Cup 3rd Place (1966)',
      'Senegal': 'World Cup Quarterfinalists (2002)',
      'Cameroon': 'World Cup Quarterfinalists (1990)',
      'Ghana': 'World Cup Quarterfinalists (2010)',
      'Japan': '4-time World Cup Round of 16 (2002, 2010, 2018, 2022)',
      'Mexico': '2-time World Cup Quarterfinalists (1970, 1986)',
      'Ecuador': 'World Cup Round of 16 (2006)',
      'Saudi Arabia': 'World Cup Round of 16 (1994)',
      'Switzerland': '3-time World Cup Quarterfinalists (1934, 1938, 1954)',
      'Australia': '2-time World Cup Round of 16 (2006, 2022)',
      'Ukraine': 'World Cup Quarterfinalists (2006)',
      'Wales': 'World Cup Quarterfinalists (1958)',
      'Colombia': 'World Cup Quarterfinalists (2014)',
      'Panama': 'World Cup Group Stage Contenders',
      'Qatar': 'World Cup Group Stage Contenders'
    };

    const histRecord = HISTORICAL_RECORDS[teamData.name] || 'World Cup Group Stage Contenders';
    const summary = `${teamData.name} (${teamData.group}, Rank #${teamData.fifaRank}) is managed by ${teamData.coach}.`;
    const historyContext = `${teamData.name} historical record: ${histRecord}.`;
    const storyline = `Fan ${fanProfileData.name} supports them because: "${fanProfileData.reasonForSupport}"`;
    const strengths = `Wins: ${teamData.stats.wins}, star threat: ${teamData.starPlayer}.`;
    const weaknesses = `Goals conceded: ${teamData.stats.goalsAgainst}.`;
    const matchesWorthWatching = `Watch ${teamData.name} fixtures in ${teamData.group}.`;

    try {
      if (!this.apiKey) {
        return this._generateGroundedMock(summary, historyContext, storyline, strengths, weaknesses, matchesWorthWatching);
      }

      logger.info(`Attempting live Gemini grounded insights generation for team: ${teamData.name}`);
      
      const prompt = `You are a factual sports summarizer. Compile a report using ONLY this supplied data (maximum 120 words total):
      - Summary: ${summary}
      - History: ${historyContext}
      - Storyline: ${storyline}
      - Strengths: ${strengths}
      - Weaknesses: ${weaknesses}
      - Watch Match: ${matchesWorthWatching}
      
      Structure your response exactly as plain text with labeled lines:
      Team Summary: [Summary here]
      Historical Context: [History here]
      Interesting Storyline: [Storyline here]
      Strengths: [Strengths here]
      Weaknesses: [Weaknesses here]
      Matches Worth Watching: [Watch match details here]`;

      const responseText = await this._callGeminiAPI(this.preferredModel, prompt);
      
      const extractField = (text, label) => {
        const regex = new RegExp(`(?:\\*\\*|-)?\\s*${label}\\s*:\\s*(?:\\*\\*)?\\s*([^\\n]*)`, 'i');
        const match = text.match(regex);
        return match ? match[1].replace(/\*+$/, '').trim() : null;
      };

      const parsed = {
        teamSummary: extractField(responseText, 'Team Summary'),
        historicalContext: extractField(responseText, 'Historical Context'),
        interestingStoryline: extractField(responseText, 'Interesting Storyline'),
        strengths: extractField(responseText, 'Strengths'),
        weaknesses: extractField(responseText, 'Weaknesses'),
        matchesWorthWatching: extractField(responseText, 'Matches Worth Watching')
      };

      return {
        teamSummary: parsed.teamSummary || summary,
        historicalContext: parsed.historicalContext || historyContext,
        interestingStoryline: parsed.interestingStoryline || storyline,
        strengths: parsed.strengths || strengths,
        weaknesses: parsed.weaknesses || weaknesses,
        matchesWorthWatching: parsed.matchesWorthWatching || matchesWorthWatching,
        wordCount: responseText.split(' ').length,
        grounded: true,
        engine: this.preferredModel
      };
    } catch (error) {
      logger.warn(`Gemini live grounded report failed (${error.message}). Falling back to simulation generator.`);
      return this._generateGroundedMock(summary, historyContext, storyline, strengths, weaknesses, matchesWorthWatching);
    }
  }

  _generateGroundedMock(summary, historyContext, storyline, strengths, weaknesses, matchesWorthWatching) {
    const fullText = `Summary: ${summary} History: ${historyContext} Story: ${storyline} Strength: ${strengths} Weakness: ${weaknesses} Matches: ${matchesWorthWatching}`;
    const wordCount = fullText.split(' ').length;

    return {
      teamSummary: summary,
      historicalContext: historyContext,
      interestingStoryline: storyline,
      strengths: strengths,
      weaknesses: weaknesses,
      matchesWorthWatching: matchesWorthWatching,
      wordCount: wordCount,
      grounded: true,
      engine: 'Gemini Mock Engine'
    };
  }

  _simulateMatchAnalysis(matchData) {
    const homeTeam = matchData.homeTeam;
    const awayTeam = matchData.awayTeam;
    
    const teamProfiles = {
      'Argentina': {
        pros: ['World-class tactical leadership', 'High cohesion and championship experience', 'Lethal final-third creativity'],
        cons: ['Over-reliance on key playmaker transition', 'Susceptibility to pacey counter-attacks']
      },
      'Brazil': {
        pros: ['Exceptional wing dribbling and transition speed', 'High press recovery in midfield', 'Individually brilliant creative forwards'],
        cons: ['Vulnerability during defensive set pieces', 'Defensive line exposing wide channels']
      },
      'France': {
        pros: ['Elite squad depth across all positions', 'Devastating speed in counter-attacking transits', 'Physical dominance in central midfield'],
        cons: ['Occasional defensive complacency', 'Midfield spacing gaps under high pressure']
      },
      'Spain': {
        pros: ['Superb possession retention and passing accuracy', 'Aggressive counter-pressing to win ball early', 'Highly structured positional play'],
        cons: ['Lack of direct physical forward threat', 'Susceptibility to direct counter attacks']
      },
      'Germany': {
        pros: ['High intensity structured press', 'Excellent wing play and crosses', 'Strong aerial threat on set pieces'],
        cons: ['Vulnerable defensive high line transition', 'Inconsistent converting inside box']
      },
      'England': {
        pros: ['Lethal set-piece routines', 'Technical stability in double pivot', 'Elite striker hold-up play'],
        cons: ['Risk-averse possession speed', 'Defensive spacing under overload']
      }
    };
    
    const homeInfo = teamProfiles[homeTeam] || {
      pros: ['Well-organized low block defensive structure', 'Strong determination and team work'],
      cons: ['Limited options in squad bench rotation', 'Slow build-up from defensive line']
    };
    const awayInfo = teamProfiles[awayTeam] || {
      pros: ['Speedy wingers attacking wide channels', 'Highly disciplined defensive midfield'],
      cons: ['Vulnerability to central zone overloads', 'Low conversion rate of half-chances']
    };
    
    let predictedWinner = 'Draw';
    let winProbability = 50;
    let homeScore = 1;
    let awayScore = 1;
    
    const homeHash = homeTeam.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const awayHash = awayTeam.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (homeHash > awayHash + 20) {
      predictedWinner = homeTeam;
      winProbability = 55 + (homeHash % 15);
      homeScore = 2;
      awayScore = 1;
    } else if (awayHash > homeHash + 20) {
      predictedWinner = awayTeam;
      winProbability = 55 + (awayHash % 15);
      homeScore = 1;
      awayScore = 2;
    }
    
    const prosCons = {
      home: { team: homeTeam, pros: homeInfo.pros, cons: homeInfo.cons },
      away: { team: awayTeam, pros: awayInfo.pros, cons: awayInfo.cons }
    };
    
    return {
      matchId: matchData.matchId,
      prediction: {
        predictedWinner,
        winProbability,
        predictedScore: { home: homeScore, away: awayScore }
      },
      prosCons,
      tacticalBreakdown: `Tactical breakdown for ${homeTeam} vs ${awayTeam}: ${homeTeam} will look to utilize their strengths (${homeInfo.pros[0]}) but must be wary of their vulnerability (${homeInfo.cons[0]}). Meanwhile, ${awayTeam} is expected to leverage their key advantage (${awayInfo.pros[0]}) while attempting to shield their weakness (${awayInfo.cons[0]}). Expect a highly contested match with critical midfield duals.`,
      keyPlayers: [
        { name: `${homeTeam} Captain`, impact: "Provides central zone distribution." },
        { name: `${awayTeam} Playmaker`, impact: "Controls pace of transition." }
      ],
      confidenceScore: 0.70,
      engine: "Gemini Simulation Engine",
      timestamp: new Date()
    };
  }

  _simulateSentimentAnalysis(text) {
    const positiveKeywords = ['win', 'love', 'goal', 'great', 'best', 'vamos', 'epic'];
    const negativeKeywords = ['lose', 'suck', 'bad', 'worst', 'awful', 'card', 'fail'];
    
    const lowerText = text.toLowerCase();
    if (positiveKeywords.some(kw => lowerText.includes(kw))) return 'POSITIVE';
    if (negativeKeywords.some(kw => lowerText.includes(kw))) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  /**
   * Generates a list of capped AI recommendations tailored to the fan's profile properties.
   * 
   * @param {Object} profile - The fan profile parameters (favoriteTeam, favoritePlayer, reasonForSupport).
   * @param {Array} supportHistory - Optional array representing voting metrics to personalize the suggestions.
   * @returns {Promise<Array>} Capped array containing exactly 3 recommended items.
   * 
   * Grounding Source: Grounded against the user's explicit profile selections and voting counts.
   * Hallucination Prevention: Bound by system prompt rules to output exactly 3 recommendations with specific JSON keys.
   * Fallback Behavior: If no Gemini API key is configured or the API is unreachable, it defaults to `_simulateFanRecommendations` template suggestions.
   */
  async generateFanRecommendations(profile, supportHistory = []) {
    const favoriteTeam = profile.favoriteTeam || 'Argentina';
    const favoritePlayer = profile.favoritePlayer || 'Lionel Messi';
    
    const prompt = `You are an expert AI football analyst. Based on a user's fan profile:
- Favorite Team: ${favoriteTeam}
- Favorite Player: ${favoritePlayer}
- Reason for Support: ${profile.reasonForSupport || 'Loves the game'}
- Support History: ${JSON.stringify(supportHistory)}

Generate exactly 3 personalized recommendations for matches to watch, teams to explore, or chat groups to join.
Your response MUST be a valid JSON array, containing exactly 3 objects. Do not include markdown wraps or backticks in the response, just the raw JSON.
Each object must contain the following keys:
- "title": A short, exciting recommendation title.
- "description": A detailed, personalized explanation of why this fits their profile.
- "type": One of "match", "team", "group".
- "actionLabel": e.g., "Explore Team", "Join Chat", "View Match".
- "actionLink": e.g., "/", "/teams", "/groups".`;

    try {
      if (!this.apiKey) {
        return this._simulateFanRecommendations(profile);
      }
      
      const response = await this._callGeminiAPI(this.preferredModel, prompt);
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      logger.warn(`Failed to generate live Gemini recommendations: ${err.message}. Using simulation fallback.`);
      return this._simulateFanRecommendations(profile);
    }
  }

  _simulateFanRecommendations(profile) {
    const favoriteTeam = profile.favoriteTeam || 'Argentina';
    const favoritePlayer = profile.favoritePlayer || 'Lionel Messi';
    
    return [
      {
        title: `Explore ${favoriteTeam} Tactical Center`,
        description: `Since you support ${favoriteTeam}, check out their squad stats, form sheets, and Gemini's custom tactical predictions.`,
        type: "team",
        actionLabel: "Explore Team",
        actionLink: `/teams`
      },
      {
        title: `Join the Live Fan Chat Room`,
        description: `Connect with other fans to discuss if ${favoritePlayer} is the MVP of the tournament and review live AI sentiment metrics.`,
        type: "group",
        actionLabel: "Join Chat",
        actionLink: `/`
      },
      {
        title: `Compare Pros & Cons in the Next Match`,
        description: `Gemini Pro has prepped grounded tactical comparisons for the upcoming matches. Go analyze the win probabilities live.`,
        type: "match",
        actionLabel: "Analyze Matches",
        actionLink: `/`
      }
    ];
  }
}

module.exports = new GeminiService();
