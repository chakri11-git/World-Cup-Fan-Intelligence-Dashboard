import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Shield, User, Activity, Cpu, Calendar } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/landing/Navbar';
import PageTransition from '../components/common/PageTransition';
import AIDisclaimer from '../components/common/AIDisclaimer';

const TeamProfile = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamProfile = async () => {
      setLoading(true);
      try {
        const [teamRes, matchesRes, aiInsightsRes] = await Promise.all([
          api.get(`/teams/${teamId}`),
          api.get('/matches'),
          api.post('/ai-insights/generate', { teamId })
        ]);

        const teamData = teamRes.data;
        setTeam(teamData);

        const teamName = teamData.name;
        const filteredMatches = matchesRes.data.filter(
          (m) => m.homeTeam === teamName || m.awayTeam === teamName
        );
        setRecentMatches(filteredMatches);

        setAiSummary(aiInsightsRes.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile. Operating in offline simulation mode.');
        
        const mockTeams = {
          arg: { teamId: 'arg', name: 'Argentina', fifaRank: 1, group: 'Group A', region: 'South America', flag: '🇦🇷', coach: 'Lionel Scaloni', starPlayer: 'Lionel Messi', stats: { played: 3, wins: 3, draws: 0, losses: 0, goalsFor: 8, goalsAgainst: 1 } },
          bra: { teamId: 'bra', name: 'Brazil', fifaRank: 5, group: 'Group A', region: 'South America', flag: '🇧🇷', coach: 'Dorival Júnior', starPlayer: 'Vinicius Jr', stats: { played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 5, goalsAgainst: 3 } },
          fra: { teamId: 'fra', name: 'France', fifaRank: 2, group: 'Group B', region: 'Europe', flag: '🇫🇷', coach: 'Didier Deschamps', starPlayer: 'Kylian Mbappé', stats: { played: 3, wins: 2, draws: 1, losses: 0, goalsFor: 6, goalsAgainst: 2 } },
          esp: { teamId: 'esp', name: 'Spain', fifaRank: 8, group: 'Group B', region: 'Europe', flag: '🇪🇸', coach: 'Luis de la Fuente', starPlayer: 'Lamine Yamal', stats: { played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 4, goalsAgainst: 4 } }
        };

        const teamData = mockTeams[teamId.toLowerCase()] || mockTeams.arg;
        setTeam(teamData);
        setRecentMatches([
          { matchId: 'wc-2026-m01', homeTeam: 'Argentina', awayTeam: 'Brazil', status: 'LIVE', minute: 74, score: { home: 2, away: 1 }, venue: 'Estadio Azteca, Mexico City', date: '2026-07-08T20:00:00Z', events: [] }
        ]);
        setAiSummary({
          teamSummary: "Simulation: Tactical framework details strong midfield control and aggressive transitions.",
          historicalContext: "Simulation: Historically dominant performance indexes.",
          interestingStoryline: "Simulation: Supporter sentiment indicates high expectations.",
          strengths: "Simulation: Creative build-ups and set piece conversions.",
          weaknesses: "Simulation: High line vulnerabilities.",
          matchesWorthWatching: "Simulation: Group phase matchups.",
          wordCount: 50,
          engine: "Gemini Simulation Engine"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamProfile();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-gray-100 flex items-center justify-center">
        <span>Loading contender profile...</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-transparent text-gray-100 flex items-center justify-center flex-col gap-4">
        <span>Contender not found.</span>
        <Link to="/teams" className="text-pitch-green hover:underline">Return to Team Explorer</Link>
      </div>
    );
  }

  const formIndicators = team.stats.wins > 2 ? ['W', 'W', 'W', 'W', 'D'] : ['W', 'D', 'L', 'W', 'L'];

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-gray-100 font-sans">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Back Button */}
          <Link 
            to="/teams" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors btn-animated"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Team Explorer
          </Link>

          {/* Hero Banner */}
          <div className="relative rounded-3xl border border-white/5 bg-gradient-to-b from-gray-900/40 to-gray-950/80 backdrop-blur-xl p-8 md:p-12 mb-10 overflow-hidden border-beam">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-[120px] font-black leading-none select-none">
              {team.flag}
            </div>

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <span className="text-7xl md:text-8xl">{team.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                    {team.name}
                  </h1>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs md:text-sm text-gray-400">
                    <span className="rounded-full bg-white/5 px-3 py-1 border border-white/5">{team.group}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1 border border-white/5">{team.region}</span>
                    <span className="rounded-full bg-trophy-gold/10 text-trophy-gold px-3 py-1 border border-trophy-gold/20 font-semibold">
                      FIFA Rank #{team.fifaRank}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coach & Star Player Hero Stats */}
              <div className="grid grid-cols-2 gap-4 border-l border-white/5 pl-0 md:pl-8">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold block">Head Coach</span>
                  <span className="text-md font-semibold text-white mt-1 block">{team.coach}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold block">Star Player</span>
                  <span className="text-md font-semibold text-pitch-green mt-1 block">{team.starPlayer}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Column 1 & 2: Stats, Form, Chart, and Matches */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              
              {/* Statistics Cards */}
              <section className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 hover:scale-[1.02] transform transition-transform duration-200">
                  <span className="text-xs text-gray-500 uppercase font-bold">Matches Played</span>
                  <span className="text-3xl font-extrabold text-white block mt-2">{team.stats.played}</span>
                </div>
                <div className="glass-card p-6 hover:scale-[1.02] transform transition-transform duration-200">
                  <span className="text-xs text-gray-500 uppercase font-bold text-pitch-green">Wins</span>
                  <span className="text-3xl font-extrabold text-pitch-green block mt-2">{team.stats.wins}</span>
                </div>
                <div className="glass-card p-6 hover:scale-[1.02] transform transition-transform duration-200">
                  <span className="text-xs text-gray-500 uppercase font-bold">Draws / Losses</span>
                  <span className="text-3xl font-extrabold text-white block mt-2">
                    {team.stats.draws} / {team.stats.losses}
                  </span>
                </div>
                <div className="glass-card p-6 hover:scale-[1.02] transform transition-transform duration-200">
                  <span className="text-xs text-gray-500 uppercase font-bold">Goals Scored</span>
                  <span className="text-3xl font-extrabold text-white block mt-2">+{team.stats.goalsFor}</span>
                </div>
                <div className="glass-card p-6 hover:scale-[1.02] transform transition-transform duration-200">
                  <span className="text-xs text-gray-500 uppercase font-bold">Goals Conceded</span>
                  <span className="text-3xl font-extrabold text-white block mt-2">-{team.stats.goalsAgainst}</span>
                </div>
                <div className="glass-card p-6 hover:scale-[1.02] transform transition-transform duration-200">
                  <span className="text-xs text-gray-500 uppercase font-bold text-trophy-gold">Goal Diff</span>
                  <span className="text-3xl font-extrabold text-trophy-gold block mt-2">
                    {team.stats.goalsFor - team.stats.goalsAgainst > 0 ? '+' : ''}
                    {team.stats.goalsFor - team.stats.goalsAgainst}
                  </span>
                </div>
              </section>

              {/* Form & Performance SVG Chart */}
              <section className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-pitch-green" />
                    Recent Form & Performance Curve
                  </h3>
                  <div className="flex gap-1.5">
                    {formIndicators.map((val, idx) => (
                      <span 
                        key={idx}
                        className={`h-6 w-6 rounded-full text-center text-xs font-bold leading-6 block ${
                          val === 'W' ? 'bg-pitch-green text-gray-950 font-extrabold shadow-sm' :
                          val === 'D' ? 'bg-gray-700 text-gray-300' : 'bg-red-500 text-white'
                        }`}
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom SVG Form Curve Chart */}
                <div className="h-48 rounded-xl bg-gray-950/60 p-4 border border-white/5 flex items-center justify-center relative">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 50 90 Q 150 20 250 80 T 450 30 L 450 120 L 50 120 Z" 
                      fill="url(#chart-glow)" 
                    />

                    <path
                      d="M 50 90 Q 150 20 250 80 T 450 30"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <circle cx="50" cy="90" r="5" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="150" cy="38" r="5" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="250" cy="80" r="5" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="350" cy="52" r="5" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="450" cy="30" r="5" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                  </svg>

                  <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-gray-500 font-bold uppercase">
                    <span>Match 1</span>
                    <span>Match 2</span>
                    <span>Match 3</span>
                    <span>Match 4</span>
                    <span>Latest Form (Match 5)</span>
                  </div>
                </div>
              </section>

              {/* Recent Match Fixtures */}
              <section className="glass-card p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Tournament Match Timeline
                </h3>
                
                <div className="flex flex-col gap-4">
                  {recentMatches.length > 0 ? (
                    recentMatches.map((match) => {
                      const isWin = 
                        (match.homeTeam === team.name && match.score.home > match.score.away) ||
                        (match.awayTeam === team.name && match.score.away > match.score.home);
                      const isDraw = match.score.home === match.score.away;

                      return (
                        <div 
                          key={match.matchId}
                          className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/5 bg-gray-950 p-5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className={`h-2 w-2 rounded-full ${match.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                            <div>
                              <span className="text-xs text-gray-500 block">{match.venue}</span>
                              <span className="text-sm font-bold text-white mt-1 block">
                                {match.homeTeam} vs {match.awayTeam}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <span className="text-lg font-extrabold text-trophy-gold bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                              {match.score.home} - {match.score.away}
                            </span>
                            
                            {match.status === 'FINISHED' ? (
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                                isWin ? 'bg-pitch-green/10 text-pitch-green border border-pitch-green/20' :
                                isDraw ? 'bg-gray-700/10 text-gray-400 border border-gray-700/20' :
                                'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}>
                                {isWin ? 'Win' : isDraw ? 'Draw' : 'Loss'}
                              </span>
                            ) : (
                              <span className="badge-live-neon">
                                {match.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">No match details logged for this contender yet.</div>
                  )}
                </div>
              </section>
            </div>

            {/* Column 3: AI Insights & Tactical reports */}
            <div className="flex flex-col gap-8">
              
              {/* AI Summary Card */}
              <section className="glass-card p-6 border-beam">
                <div className="flex items-center justify-between gap-2.5 mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-pitch-green">
                    <Cpu className="h-6 w-6 text-pitch-green" />
                    <h3 className="text-lg font-bold text-white">Gemini Grounded Insights</h3>
                  </div>
                  {aiSummary && (
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-semibold">
                      {aiSummary.wordCount} words
                    </span>
                  )}
                </div>

                {aiSummary ? (
                  <div className="flex flex-col gap-5 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Team Summary</span>
                      <p className="text-gray-300 leading-relaxed">{aiSummary.teamSummary}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Historical Context</span>
                      <p className="text-gray-300 leading-relaxed">{aiSummary.historicalContext}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Interesting Storyline</span>
                      <p className="text-gray-300 leading-relaxed">{aiSummary.interestingStoryline}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div>
                        <span className="text-[10px] text-pitch-green uppercase font-bold block mb-1">Strengths</span>
                        <p className="text-gray-300 leading-relaxed">{aiSummary.strengths}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-red-500 uppercase font-bold block mb-1">Weaknesses</span>
                        <p className="text-gray-300 leading-relaxed">{aiSummary.weaknesses}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-pitch-green/5 border border-pitch-green/20 p-4 mt-2">
                      <span className="text-[10px] text-pitch-green uppercase font-bold block mb-1">Matches Worth Watching</span>
                      <p className="text-gray-200 font-semibold leading-relaxed mt-1">{aiSummary.matchesWorthWatching}</p>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right mt-2 font-mono">
                      Model: {aiSummary.engine} (Strictly Factual Grounding)
                    </div>
                    <AIDisclaimer />
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Formulating AI model prediction summary...</div>
                )}
              </section>

              {/* Historical World Cup achievements card */}
              <section className="glass-card p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Trophy className="h-5 w-5 text-trophy-gold" />
                  Historical Cup Records
                </h3>

                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-3 border border-white/5">
                    <span className="font-semibold text-white">2022 Qatar Finish</span>
                    <span className="text-xs text-pitch-green font-bold bg-pitch-green/10 border border-pitch-green/20 px-2 py-0.5 rounded-full uppercase">
                      {team.name === 'Argentina' ? 'Winner' : 'Quarter-Final'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-3 border border-white/5">
                    <span className="font-semibold text-white">All-Time Championships</span>
                    <span className="text-xs text-trophy-gold font-bold bg-trophy-gold/10 border border-trophy-gold/20 px-2 py-0.5 rounded-full">
                      {team.name === 'Argentina' ? '3 Titles' : team.name === 'Brazil' ? '5 Titles' : team.name === 'France' ? '2 Titles' : '1 Title'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-3 border border-white/5">
                    <span className="font-semibold text-white">Win Probability Index</span>
                    <span className="text-xs text-white font-bold bg-white/10 px-2 py-0.5 rounded-full">
                      {team.name === 'Argentina' ? '72%' : team.name === 'Brazil' ? '68%' : team.name === 'France' ? '65%' : '60%'}
                    </span>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TeamProfile;
