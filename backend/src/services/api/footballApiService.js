const axios = require('axios');
const logger = require('../../utils/logger');
const matchesMock = require('../../mock/matchesMock.json');

const FLAG_MAP = {
  'Uruguay': '🇺🇾', 'Russia': '🇷🇺', 'Saudi Arabia': '🇸🇦', 'Egypt': '🇪🇬',
  'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Iran': '🇮🇷', 'Morocco': '🇲🇦',
  'France': '🇫🇷', 'Denmark': '🇩🇰', 'Peru': '🇵🇪', 'Australia': '🇦🇺',
  'Croatia': '🇭🇷', 'Argentina': '🇦🇷', 'Nigeria': '🇳🇬', 'Iceland': '🇮🇸',
  'Brazil': '🇧🇷', 'Switzerland': '🇨🇭', 'Serbia': '🇷🇸', 'Costa Rica': '🇨🇷',
  'Sweden': '🇸🇪', 'Mexico': '🇲🇽', 'South Korea': '🇰🇷', 'Germany': '🇩🇪',
  'Belgium': '🇧🇪', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Tunisia': '🇹🇳', 'Panama': '🇵🇦',
  'Colombia': '🇨🇴', 'Japan': '🇯🇵', 'Senegal': '🇸🇳', 'Poland': '🇵🇱',
  'Turkey': '🇹🇷', 'Austria': '🇦🇹', 'Uzbekistan': '🇺🇿', 'Ghana': '🇬🇭',
  'Canada': '🇨🇦', 'Ecuador': '🇪🇨', 'Qatar': '🇶🇦', 'South Africa': '🇿🇦',
  'Iraq': '🇮🇶', 'Algeria': '🇩🇿', 'Jordan': '🇯🇴', 'Ukraine': '🇺🇦',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Cameroon': '🇨🇲', 'Curaçao': '🇨🇼', 'Cape Verde Islands': '🇨🇻',
  'Bosnia-Herzegovina': '🇧🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Congo DR': '🇨🇩',
  'United States': '🇺🇸', 'Netherlands': '🇳🇱', 'Norway': '🇳🇴', 'Paraguay': '🇵🇾'
};

class FootballApiService {
  constructor() {
    // Supporter keys for RapidAPI (API-Football) and direct free provider (football-data.org)
    this.rapidApiKey = process.env.FOOTBALL_API_KEY;
    this.footballDataKey = process.env.FOOTBALL_DATA_ORG_KEY;
    
    this.rapidApiUrl = process.env.FOOTBALL_API_URL || 'https://api-football-v1.p.rapidapi.com/v3';
    this.footballDataUrl = 'https://api.football-data.org/v4';
    
    // In-memory cache to prevent hitting 10 req/min rate limits of football-data.org
    this.cache = {
      matches: { data: null, timestamp: 0 },
      standings: { data: null, timestamp: 0 },
      teams: { data: null, timestamp: 0 }
    };

    // In-memory array to simulate active live feeds and scores when API keys are not active
    this.liveMatches = JSON.parse(JSON.stringify(matchesMock));
    this._startRealtimeSimulation();
  }

  /**
   * Starts a background simulation interval representing real-time match events,
   * score progression, and timeline events for live fixtures.
   */
  _startRealtimeSimulation() {
    logger.info('Initializing real-time World Cup match feed simulation...');
    
    setInterval(() => {
      // Only tick simulation state in memory if no external API key is active
      if (this.rapidApiKey || this.footballDataKey) return;

      this.liveMatches.forEach(match => {
        if (match.status === 'LIVE') {
          // Progress minute
          match.minute += 1;
          
          if (match.minute >= 90) {
            match.status = 'FINISHED';
            logger.info(`[Live Feed] Match Finished: ${match.homeTeam} ${match.score.home} - ${match.score.away} ${match.awayTeam}`);
            return;
          }

          // 8% chance of trigger events (Goal or Card booking)
          if (Math.random() < 0.08) {
            const isGoal = Math.random() < 0.6; // 60% goal probability, 40% card
            const isHome = Math.random() < 0.5;

            if (isGoal) {
              if (isHome) {
                match.score.home += 1;
              } else {
                match.score.away += 1;
              }

              const scorers = isHome 
                ? (match.homeTeam === 'Argentina' ? ['Lionel Messi', 'Lautaro Martinez', 'Julian Alvarez'] : ['Kylian Mbappe', 'Antoine Griezmann'])
                : (match.awayTeam === 'Brazil' ? ['Vinicius Jr', 'Rodrygo', 'Raphinha'] : ['Lamine Yamal', 'Nico Williams']);
              
              const scorer = scorers[Math.floor(Math.random() * scorers.length)];

              match.events.push({
                time: match.minute,
                type: 'GOAL',
                player: scorer,
                team: isHome ? 'home' : 'away'
              });

              logger.info(`[Live Feed] GOAL! ${scorer} scored. ${match.homeTeam} ${match.score.home} - ${match.score.away} ${match.awayTeam}`);
            } else {
              const cardType = Math.random() < 0.8 ? 'YELLOW CARD' : 'RED CARD';
              const cardPlayers = isHome
                ? (match.homeTeam === 'Argentina' ? ['Rodrigo De Paul', 'Cristian Romero'] : ['Aurelien Tchouameni', 'Theo Hernandez'])
                : (match.awayTeam === 'Brazil' ? ['Casemiro', 'Marquinhos'] : ['Dani Carvajal', 'Rodri']);

              const player = cardPlayers[Math.floor(Math.random() * cardPlayers.length)];

              match.events.push({
                time: match.minute,
                type: cardType === 'YELLOW CARD' ? 'YELLOW_CARD' : 'RED_CARD',
                player: player,
                team: isHome ? 'home' : 'away'
              });

              logger.info(`[Live Feed] ${cardType} issued to ${player} (${isHome ? match.homeTeam : match.awayTeam})`);
            }
          }
        } else if (match.status === 'SCHEDULED' && Math.random() < 0.005) {
          // 0.5% chance to kickoff scheduled games
          match.status = 'LIVE';
          match.minute = 1;
          logger.info(`[Live Feed] KICK-OFF! Match ${match.matchId} (${match.homeTeam} vs ${match.awayTeam}) has started!`);
        }
      });
    }, 8000); // Ticks progress every 8 seconds
  }

  /**
   * Fetches latest match details from simulated live feed or third-party APIs.
   * @param {string} matchId - Target match ID
   */
  async getMatchDetails(matchId) {
    try {
      // 1. Direct free provider (football-data.org)
      if (this.footballDataKey) {
        logger.info(`Fetching details for match ${matchId} from football-data.org`);
        const response = await axios.get(`${this.footballDataUrl}/matches/${matchId}`, {
          headers: { 'X-Auth-Token': this.footballDataKey },
          timeout: 4000
        });
        if (response.data) {
          return this._formatFootballDataMatch(response.data);
        }
      }

      // 2. RapidAPI (API-Football)
      if (this.rapidApiKey) {
        logger.info(`Fetching details for match ${matchId} from API-Football (RapidAPI)`);
        const response = await axios.get(`${this.rapidApiUrl}/fixtures`, {
          params: { id: matchId },
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          },
          timeout: 4000
        });
        if (response.data && response.data.response && response.data.response.length > 0) {
          return this._formatExternalFixture(response.data.response[0]);
        }
      }

      // 3. Fallback to simulation
      logger.debug(`Retrieving match details for ${matchId} from live simulation.`);
      const match = this.liveMatches.find(m => m.matchId === matchId);
      if (!match) throw new Error('Match not found in live feed.');
      return match;

    } catch (error) {
      logger.error(`Error in Football API Service details fetching: ${error.message}. Falling back to simulation.`);
      const match = this.liveMatches.find(m => m.matchId === matchId);
      if (match) return match;
      throw error;
    }
  }

  /**
   * Fetches list of all matches.
   */
  async getAllMatches() {
    const now = Date.now();
    if (this.cache.matches.data && (now - this.cache.matches.timestamp < 30000)) {
      logger.debug('Returning matches list from in-memory cache.');
      return this.cache.matches.data;
    }

    try {
      // 1. Direct free provider (football-data.org)
      if (this.footballDataKey) {
        logger.info(`Fetching World Cup matches list from football-data.org: ${this.footballDataUrl}/competitions/WC/matches`);
        const response = await axios.get(`${this.footballDataUrl}/competitions/WC/matches`, {
          headers: { 'X-Auth-Token': this.footballDataKey },
          timeout: 4000
        });
        if (response.data && response.data.matches && response.data.matches.length > 0) {
          const mapped = response.data.matches.map(m => this._formatFootballDataMatch(m));
          this.cache.matches = { data: mapped, timestamp: now };
          return mapped;
        } else {
          logger.warn('Empty matches response from football-data.org. Loading simulation fallback.');
          return this.liveMatches;
        }
      }

      // 2. RapidAPI (API-Football)
      if (this.rapidApiKey) {
        logger.info(`Fetching matches list from API-Football: ${this.rapidApiUrl}/fixtures?league=1&season=2026`);
        const response = await axios.get(`${this.rapidApiUrl}/fixtures`, {
          params: { league: 1, season: 2026 },
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          },
          timeout: 4000
        });
        if (response.data && response.data.response && response.data.response.length > 0) {
          return response.data.response.map(f => this._formatExternalFixture(f));
        } else {
          logger.warn('Empty response listing fixtures from API-Football. Loading simulation fallback.');
          return this.liveMatches;
        }
      }

      // 3. Fallback to simulation
      logger.debug('Listing simulated live matches feed.');
      return this.liveMatches;

    } catch (error) {
      logger.error(`Error listing matches from live APIs: ${error.message}. Loading simulation fallback.`);
      return this.liveMatches;
    }
  }

  /**
   * Helper to format external Football API schema to our unified Dashboard schema.
   */
  _formatExternalFixture(data) {
    const { fixture, teams, goals, events } = data;
    
    // Map status types
    let mappedStatus = 'LIVE';
    if (fixture.status.short === 'NS') {
      mappedStatus = 'SCHEDULED';
    } else if (['FT', 'AET', 'PEN', 'P'].includes(fixture.status.short)) {
      mappedStatus = 'FINISHED';
    }

    return {
      matchId: String(fixture.id),
      homeTeam: teams.home.name,
      awayTeam: teams.away.name,
      status: mappedStatus,
      minute: fixture.status.elapsed || 0,
      score: {
        home: goals.home !== null ? goals.home : 0,
        away: goals.away !== null ? goals.away : 0
      },
      venue: fixture.venue.name || 'TBD Stadium',
      date: fixture.date,
      events: events ? events.map(e => ({
        time: e.time.elapsed,
        type: e.type ? e.type.toUpperCase() : 'EVENT',
        player: e.player ? e.player.name : 'Unknown Player',
        team: e.team.name === teams.home.name ? 'home' : 'away'
      })) : []
    };
  }

  /**
   * Helper to format football-data.org match schema to our unified Dashboard schema.
   */
  _formatFootballDataMatch(match) {
    let mappedStatus = 'LIVE';
    if (match.status === 'TIMED' || match.status === 'SCHEDULED') {
      mappedStatus = 'SCHEDULED';
    } else if (match.status === 'FINISHED') {
      mappedStatus = 'FINISHED';
    }

    // Set mock timeline events using score indices if events are not returned on free matches endpoint
    const mockEvents = [];
    const homeGoals = (match.score && match.score.fullTime && match.score.fullTime.home) || 0;
    const awayGoals = (match.score && match.score.fullTime && match.score.fullTime.away) || 0;
    
    for (let i = 0; i < homeGoals; i++) {
      mockEvents.push({ time: 10 + i * 20, type: 'GOAL', player: 'Home Scorer', team: 'home' });
    }
    for (let i = 0; i < awayGoals; i++) {
      mockEvents.push({ time: 15 + i * 20, type: 'GOAL', player: 'Away Scorer', team: 'away' });
    }

    return {
      matchId: String(match.id),
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      status: mappedStatus,
      minute: match.status === 'IN_PLAY' ? 45 : 0, // Fallback elapsed minutes for free tier live states
      score: {
        home: homeGoals,
        away: awayGoals
      },
      venue: match.venue || 'World Cup Arena',
      date: match.utcDate,
    };
  }

  /**
   * Fetches standings/groups details.
   */
  async getStandings() {
    const now = Date.now();
    if (this.cache.standings.data && (now - this.cache.standings.timestamp < 300000)) {
      logger.debug('Returning standings from in-memory cache.');
      return this.cache.standings.data;
    }

    try {
      if (this.footballDataKey) {
        logger.info(`Fetching standings from football-data.org: ${this.footballDataUrl}/competitions/WC/standings`);
        const response = await axios.get(`${this.footballDataUrl}/competitions/WC/standings`, {
          headers: { 'X-Auth-Token': this.footballDataKey },
          timeout: 4000
        });
        if (response.data && response.data.standings) {
          const mapped = this._formatFootballDataStandings(response.data.standings);
          this.cache.standings = { data: mapped, timestamp: now };
          return mapped;
        }
      }
      return require('../../mock/groupsMock.json');
    } catch (error) {
      logger.error(`Error fetching standings: ${error.message}`);
      return require('../../mock/groupsMock.json');
    }
  }



  /**
   * Fetches all teams list.
   */
  async getTeams() {
    const now = Date.now();
    if (this.cache.teams.data && (now - this.cache.teams.timestamp < 600000)) {
      logger.debug('Returning teams list from in-memory cache.');
      return this.cache.teams.data;
    }

    try {
      if (this.footballDataKey) {
        logger.info(`Fetching teams from football-data.org: ${this.footballDataUrl}/competitions/WC/teams`);
        
        // Fetch both teams and standings concurrently to resolve group name and team stats
        // We call getStandings() which uses the standings cache if warm!
        const [teamsRes, standings] = await Promise.all([
          axios.get(`${this.footballDataUrl}/competitions/WC/teams`, {
            headers: { 'X-Auth-Token': this.footballDataKey },
            timeout: 4000
          }),
          this.getStandings().catch(err => {
            logger.warn(`Failed to fetch standings for team enrichment: ${err.message}`);
            return [];
          })
        ]);

        const rawTeams = (teamsRes.data && teamsRes.data.teams) || [];

        // Build a lookup map of team statistics and groups from standings
        const teamInfoMap = {};
        if (Array.isArray(standings)) {
          standings.forEach(g => {
            if (Array.isArray(g.standings)) {
              g.standings.forEach(t => {
                teamInfoMap[t.teamId] = {
                  group: g.name,
                  stats: {
                    played: t.played || 0,
                    wins: t.wins || 0,
                    draws: t.draws || 0,
                    losses: t.losses || 0,
                    goalsFor: 0,
                    goalsAgainst: 0
                  }
                };
              });
            }
          });
        }

        const mapped = this._formatFootballDataTeams(rawTeams, teamInfoMap);
        this.cache.teams = { data: mapped, timestamp: now };
        return mapped;
      }
      return require('../../mock/teamsMock.json');
    } catch (error) {
      logger.error(`Error fetching teams: ${error.message}`);
      return require('../../mock/teamsMock.json');
    }
  }

  /**
   * Helper to format standings from football-data.org.
   */
  _formatFootballDataStandings(standings) {
    const groupStandings = standings.filter(s => s.type === 'TOTAL');
    return groupStandings.map(s => {
      const groupName = s.group.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      const groupId = s.group.toLowerCase().replace('_', '-');
      
      return {
        groupId,
        name: groupName,
        standings: s.table.map(t => ({
          position: t.position,
          teamId: String(t.team.id),
          teamName: t.team.name,
          played: t.playedGames,
          points: t.points,
          goalDifference: t.goalDifference,
          wins: t.won,
          losses: t.lost,
          draws: t.draw,
          flag: FLAG_MAP[t.team.name] || '🏳️'
        }))
      };
    });
  }

  /**
   * Helper to format teams from football-data.org.
   */
  _formatFootballDataTeams(teams, teamInfoMap = {}) {
    const FIFA_RANKS = {
      'Argentina': 1, 'France': 2, 'Spain': 3, 'England': 4, 'Brazil': 5,
      'Belgium': 6, 'Netherlands': 7, 'Portugal': 8, 'Colombia': 9,
      'Uruguay': 11, 'Croatia': 12, 'Germany': 13, 'Morocco': 14, 'Switzerland': 15,
      'United States': 16, 'Mexico': 17, 'Senegal': 18, 'Japan': 19, 'South Korea': 22,
      'Australia': 24, 'Ukraine': 25, 'Turkey': 26, 'Poland': 28, 'Sweden': 29,
      'Wales': 30, 'Ecuador': 31, 'Egypt': 36, 'Scotland': 39, 'Canada': 40,
      'Panama': 43, 'Cameroon': 49, 'Iraq': 55, 'Saudi Arabia': 56, 'South Africa': 59,
      'Uzbekistan': 60, 'Congo DR': 62, 'Cape Verde Islands': 65, 'Jordan': 68,
      'Bosnia-Herzegovina': 75, 'Haiti': 85, 'Qatar': 35, 'Curaçao': 80
    };

    const COACHES = {
      'Argentina': 'Lionel Scaloni', 'France': 'Didier Deschamps', 'Spain': 'Luis de la Fuente',
      'England': 'Thomas Tuchel', 'Brazil': 'Dorival Júnior', 'Belgium': 'Domenico Tedesco',
      'Netherlands': 'Ronald Koeman', 'Portugal': 'Roberto Martínez', 'Colombia': 'Néstor Lorenzo',
      'Uruguay': 'Marcelo Bielsa', 'Croatia': 'Zlatko Dalić', 'Germany': 'Julian Nagelsmann',
      'Morocco': 'Walid Regragui', 'Switzerland': 'Murat Yakin', 'United States': 'Mauricio Pochettino',
      'Mexico': 'Javier Aguirre', 'Senegal': 'Aliou Cissé', 'Japan': 'Hajime Moriyasu',
      'South Korea': 'Hong Myung-bo', 'Australia': 'Tony Popovic', 'Ukraine': 'Serhiy Rebrov',
      'Turkey': 'Vincenzo Montella', 'Poland': 'Michał Probierz', 'Sweden': 'Jon Dahl Tomasson',
      'Wales': 'Craig Bellamy', 'Ecuador': 'Sebastián Beccacece', 'Egypt': 'Hossam Hassan',
      'Cameroon': 'Marc Brys', 'Canada': 'Jesse Marsch', 'Saudi Arabia': 'Hervé Renard',
      'South Africa': 'Hugo Broos', 'Iraq': 'Jesús Casas', 'Cape Verde Islands': 'Bubista',
      'Bosnia-Herzegovina': 'Sergej Barbarez', 'Haiti': 'Sébastien Migné', 'Qatar': 'Tintín Márquez',
      'Uzbekistan': 'Srečko Katanec', 'Congo DR': 'Sébastien Desabre', 'Scotland': 'Steve Clarke',
      'Panama': 'Thomas Christiansen'
    };

    const STAR_PLAYERS = {
      'Argentina': 'Lionel Messi', 'France': 'Kylian Mbappé', 'Spain': 'Lamine Yamal',
      'England': 'Jude Bellingham', 'Brazil': 'Vinícius Júnior', 'Belgium': 'Kevin De Bruyne',
      'Netherlands': 'Virgil van Dijk', 'Portugal': 'Cristiano Ronaldo', 'Colombia': 'Luis Díaz',
      'Uruguay': 'Federico Valverde', 'Croatia': 'Luka Modrić', 'Germany': 'Florian Wirtz',
      'Morocco': 'Achraf Hakimi', 'Switzerland': 'Granit Xhaka', 'United States': 'Christian Pulisic',
      'Mexico': 'Santiago Giménez', 'Senegal': 'Sadio Mané', 'Japan': 'Kaoru Mitoma',
      'South Korea': 'Son Heung-min', 'Australia': 'Nestory Irankunda', 'Ukraine': 'Artem Dovbyk',
      'Turkey': 'Arda Güler', 'Poland': 'Robert Lewandowski', 'Sweden': 'Alexander Isak',
      'Wales': 'Brennan Johnson', 'Ecuador': 'Moisés Caicedo', 'Egypt': 'Mohamed Salah',
      'Cameroon': 'André Onana', 'Canada': 'Alphonso Davies', 'Saudi Arabia': 'Salem Al-Dawsari',
      'South Africa': 'Percy Tau', 'Iraq': 'Aymen Hussein', 'Cape Verde Islands': 'Ryan Mendes',
      'Bosnia-Herzegovina': 'Edin Džeko', 'Haiti': 'Frantzdy Pierrot', 'Qatar': 'Akram Afif',
      'Uzbekistan': 'Eldor Shomurodov', 'Congo DR': 'Chancel Mbemba', 'Scotland': 'Scott McTominay',
      'Panama': 'Adalberto Carrasquilla'
    };

    return teams.map((t, idx) => {
      const teamIdStr = String(t.id);
      const info = teamInfoMap[teamIdStr] || {
        group: 'Group Stage',
        stats: { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
      };

      return {
        teamId: teamIdStr,
        name: t.name,
        fifaRank: FIFA_RANKS[t.name] || (idx % 10) + 30,
        group: info.group,
        region: t.area ? t.area.name : 'International',
        flag: FLAG_MAP[t.name] || '🏳️',
        coach: COACHES[t.name] || 'TBD Coach',
        starPlayer: STAR_PLAYERS[t.name] || 'TBD Star Player',
        stats: info.stats
      };
    });
  }
}

module.exports = new FootballApiService();
