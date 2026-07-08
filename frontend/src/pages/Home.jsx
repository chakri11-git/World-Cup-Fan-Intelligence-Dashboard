import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, RefreshCw, Calendar, Cpu, MessageSquare, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { useLiveScores } from '../hooks/useLiveScores';
import { getMatchPrediction, submitFanChat } from '../services/aiService';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import PageTransition from '../components/common/PageTransition';

const Home = () => {
  const { matches, loading, error, refetch } = useLiveScores(15000);
  const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [profileName, setProfileName] = useState('Fan_10');

  useEffect(() => {
    api.get('/fan-profile')
      .then(res => {
        if (res.data && res.data.name) {
          setProfileName(res.data.name);
        }
      })
      .catch(err => {
        console.warn('Failed to load profile for chat username, falling back to default.', err.message);
      });
  }, []);
  
  // Score predictions input states
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const [chats, setChats] = useState([
    { username: 'MessiFan', message: 'Argentina will sweep the board this year!', sentiment: 'POSITIVE', prediction: { homeScorePrediction: 2, awayScorePrediction: 0 } },
    { username: 'TacticsGuru', message: 'Brazil midfield needs stability.', sentiment: 'NEGATIVE', prediction: { homeScorePrediction: 1, awayScorePrediction: 1 } }
  ]);

  // Establish WebSockets client connection and map incoming broadcasts
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to WebSockets server successfully.');
    });

    socket.on('new_message', (newMessage) => {
      setChats((prev) => {
        // Prevent double insertion if we already have this message locally
        const exists = prev.some(
          (c) => c.message === newMessage.message && c.username === newMessage.username
        );
        if (exists) return prev;
        return [newMessage, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePredict = async (matchId) => {
    setLoadingAI(true);
    setAiInsight(null);
    try {
      const response = await getMatchPrediction(matchId);
      setAiInsight(response.data);
    } catch (err) {
      console.error(err);
      setAiInsight({
        tacticalBreakdown: "Fallback Prediction: Tactical simulations suggest a highly competitive game with high probability of wing-based counters leading to a draw.",
        confidenceScore: 0.70,
        engine: "Gemini Simulation Engine"
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSelectHub = (matchId) => {
    const matched = matches.find(m => m.matchId === matchId);
    setSelectedMatch(matched);
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const hasPrediction = homeScore !== '' && awayScore !== '';
    const newChat = {
      username: profileName,
      message: chatMessage,
      matchId: selectedMatch?.matchId || 'wc-2026-m01'
    };

    if (hasPrediction) {
      newChat.homeScorePrediction = parseInt(homeScore);
      newChat.awayScorePrediction = parseInt(awayScore);
    }

    try {
      const res = await submitFanChat(newChat);
      setChats(prev => [res.data, ...prev]);
    } catch (err) {
      // Local addition fallback containing parsed prediction scores
      setChats(prev => [
        { 
          ...newChat, 
          sentiment: 'NEUTRAL', 
          prediction: hasPrediction ? { 
            homeScorePrediction: newChat.homeScorePrediction, 
            awayScorePrediction: newChat.awayScorePrediction 
          } : undefined
        }, 
        ...prev
      ]);
    }
    setChatMessage('');
    setHomeScore('');
    setAwayScore('');
  };

  const liveMatchesList = sortedMatches.filter(m => m.status === 'LIVE');
  const upcomingMatchesList = sortedMatches.filter(m => m.status === 'SCHEDULED');
  const pastMatchesList = sortedMatches.filter(m => m.status === 'FINISHED');

  const getRemainingTimeStr = (dateStr) => {
    const diffMs = new Date(dateStr) - new Date();
    if (diffMs <= 0) return 'Started';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    const mins = diffMins % 60;
    const hours = diffHours % 24;
    
    if (diffDays > 0) {
      return `${diffDays}d ${hours}h ${mins}m`;
    }
    if (diffHours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getGMTString = (dateStr) => {
    const date = new Date(dateStr);
    return date.toUTCString().replace('GMT', 'UTC');
  };

  const renderMatchCard = (match) => (
    <div 
      key={match.matchId}
      className={`rounded-xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
        selectedMatch?.matchId === match.matchId 
          ? 'bg-pitch-green/[0.04] border-pitch-green/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`h-2.5 w-2.5 rounded-full ${match.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
        <div>
          <span className="text-[10px] text-gray-500 block uppercase font-semibold">{match.venue}</span>
          <span className="text-base font-bold text-white mt-1 block">
            {match.homeTeam} vs {match.awayTeam}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-base font-extrabold text-trophy-gold bg-white/5 border border-white/5 px-3 py-1 rounded-lg">
          {match.score.home} - {match.score.away}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => handleSelectHub(match.matchId)}
            className="rounded-lg bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors btn-animated cursor-pointer"
          >
            Details
          </button>
          <button
            onClick={() => handlePredict(match.matchId)}
            className="rounded-lg bg-pitch-green/10 border border-pitch-green/20 px-3.5 py-1.5 text-xs font-bold text-pitch-green hover:bg-pitch-green/20 transition-colors btn-animated cursor-pointer flex items-center gap-1"
          >
            <Cpu className="h-3 w-3" />
            Analyze
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-gray-100 font-sans">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-pitch-green text-sm font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Live Match Prediction Center</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Match Hub Dashboard</h1>
              <p className="text-gray-400 mt-2">Analyze live scores, explore AI prediction forecasts, and review community chats.</p>
            </div>
            <button 
              onClick={refetch} 
              className="self-start inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors btn-animated cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Scores
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Column 1 & 2: Match Grid & Detailed Predictions */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              
              {/* Live Fixtures List */}
              <section className="glass-card p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Live & Upcoming Fixtures
                </h3>

                {loading && <div className="text-gray-500 text-sm">Loading contender telemetry...</div>}
                {error && <div className="text-red-400 text-sm">⚠️ {error}</div>}

                <div className="flex flex-col gap-8">
                  {/* Live Section */}
                  <div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-red-500 flex items-center gap-2 mb-4">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      Live Now ({liveMatchesList.length})
                    </h4>
                    {liveMatchesList.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-gray-900/10 p-5 text-center text-xs text-gray-500">
                        No matches currently active.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {liveMatchesList.map(match => renderMatchCard(match))}
                      </div>
                    )}
                  </div>

                  {/* Upcoming Section */}
                  <div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 flex items-center gap-2 mb-4">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      Upcoming ({upcomingMatchesList.length})
                    </h4>
                    {upcomingMatchesList.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-gray-900/10 p-5 text-center text-xs text-gray-500">
                        No upcoming fixtures scheduled.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {upcomingMatchesList.map(match => renderMatchCard(match))}
                      </div>
                    )}
                  </div>

                  {/* Completed Section */}
                  <div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                      <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                      Completed ({pastMatchesList.length})
                    </h4>
                    {pastMatchesList.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-gray-900/10 p-5 text-center text-xs text-gray-500">
                        No past matches recorded.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {pastMatchesList.map(match => renderMatchCard(match))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Gemini Prediction output */}
              {(loadingAI || aiInsight) && (
                <section className="glass-card p-6 border-beam">
                  <div className="flex items-center gap-2 text-pitch-green mb-6">
                    <Cpu className="h-6 w-6 text-pitch-green" />
                    <h3 className="text-lg font-bold text-white">Gemini AI Tactical Breakdown</h3>
                  </div>

                  {loadingAI ? (
                    <div className="text-gray-500 text-sm animate-pulse">Running neural simulations and loading forecast report...</div>
                  ) : (
                    <div className="flex flex-col gap-4 text-sm">
                      <p className="text-gray-300 leading-relaxed">{aiInsight.tacticalBreakdown}</p>
                      
                      {aiInsight.prediction && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4 mt-2">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Predicted Winner</span>
                            <span className="text-sm font-bold text-white mt-1 block">{aiInsight.prediction.predictedWinner}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Win Probability</span>
                            <span className="text-sm font-bold text-pitch-green mt-1 block">{aiInsight.prediction.winProbability}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Confidence Score</span>
                            <span className="text-sm font-bold text-trophy-gold mt-1 block">{(aiInsight.confidenceScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      )}

                      {aiInsight.prosCons && (
                        <div className="border-t border-white/5 pt-6 mt-4">
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-4">Pros & Cons Comparison</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Home Team Pros & Cons */}
                            <div className="rounded-xl bg-white/[0.01] border border-white/5 p-4">
                              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-xs font-semibold">🏠</span> {aiInsight.prosCons.home.team}
                              </h5>
                              <div className="flex flex-col gap-2">
                                {aiInsight.prosCons.home.pros.map((p, idx) => (
                                  <div key={idx} className="text-xs text-gray-300 flex gap-2">
                                    <span className="text-pitch-green">✓</span>
                                    <span>{p}</span>
                                  </div>
                                ))}
                                {aiInsight.prosCons.home.cons.map((c, idx) => (
                                  <div key={idx} className="text-xs text-gray-400 flex gap-2">
                                    <span className="text-red-400">✗</span>
                                    <span>{c}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Away Team Pros & Cons */}
                            <div className="rounded-xl bg-white/[0.01] border border-white/5 p-4">
                              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-xs font-semibold">✈️</span> {aiInsight.prosCons.away.team}
                              </h5>
                              <div className="flex flex-col gap-2">
                                {aiInsight.prosCons.away.pros.map((p, idx) => (
                                  <div key={idx} className="text-xs text-gray-300 flex gap-2">
                                    <span className="text-pitch-green">✓</span>
                                    <span>{p}</span>
                                  </div>
                                ))}
                                {aiInsight.prosCons.away.cons.map((c, idx) => (
                                  <div key={idx} className="text-xs text-gray-400 flex gap-2">
                                    <span className="text-red-400">✗</span>
                                    <span>{c}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] text-gray-500 text-right mt-4 font-mono">
                        Generated by: {aiInsight.engine || 'Gemini Pro'}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {selectedMatch && (
                <section className="glass-card p-6">
                  <div className="border-b border-white/5 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-pitch-green" />
                      {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-mono text-gray-400">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Match Time (GMT)</span>
                        <span className="text-white font-semibold">{getGMTString(selectedMatch.date)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Time Status / Countdown</span>
                        {selectedMatch.status === 'SCHEDULED' ? (
                          <span className="text-blue-400 font-semibold animate-pulse">Starts in: {getRemainingTimeStr(selectedMatch.date)}</span>
                        ) : selectedMatch.status === 'LIVE' ? (
                          <span className="text-red-500 font-semibold animate-pulse">Live: {selectedMatch.minute}'</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-4">Timeline Events</h4>

                  <div className="flex flex-col gap-3">
                    {selectedMatch.events && selectedMatch.events.length > 0 ? (
                      selectedMatch.events.map((e, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-3 py-3 border-b border-white/5 last:border-b-0 text-sm text-gray-300"
                        >
                          <span className="text-pitch-green font-bold w-12">{e.time}'</span>
                          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-gray-400">
                            {e.type}
                          </span>
                          <span>
                            by <strong>{e.player}</strong> ({e.team === 'home' ? 'Home' : 'Away'})
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-xs italic">No card or goal events registered for this timeline yet.</div>
                    )}
                  </div>
                </section>
              )}

            </div>

            {/* Column 3: Chat Sentiment Zone */}
            <div className="flex flex-col gap-6">
              <section className="glass-card p-6 flex flex-col justify-between h-[540px]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-pitch-green" />
                    Fan Prediction Chat
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Submit messages and score forecasts to run real-time AI sentiments.
                  </p>

                  {/* Messages Feed panel */}
                  <div className="flex flex-col gap-3.5 h-[280px] overflow-y-auto pr-1">
                    {chats.map((c, idx) => (
                      <div 
                        key={idx}
                        className="rounded-xl border border-white/5 bg-gray-950 p-3.5 text-xs flex flex-col gap-1.5"
                      >
                        <div className="flex justify-between items-center text-gray-500">
                          <span className="font-bold text-white">{c.username}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            c.sentiment === 'POSITIVE' ? 'bg-pitch-green/10 text-pitch-green border border-pitch-green/20' :
                            c.sentiment === 'NEGATIVE' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-gray-800 text-gray-400 border border-white/5'
                          }`}>
                            {c.sentiment}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">"{c.message}"</p>
                        
                        {/* Display predicted score */}
                        {c.prediction && c.prediction.homeScorePrediction !== undefined && (
                          <div className="border-t border-white/5 pt-2 mt-1 flex items-center gap-1.5 text-[10px] text-trophy-gold font-semibold">
                            <span>Predicted Score:</span>
                            <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-white font-mono">
                              {c.prediction.homeScorePrediction} - {c.prediction.awayScorePrediction}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Input panel with score prediction entries */}
                <form onSubmit={handleSendChat} className="flex flex-col gap-3 border-t border-white/5 pt-4 mt-4">
                  {/* Score predictions input fields */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Predict Score:</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={homeScore}
                      onChange={e => setHomeScore(e.target.value)}
                      placeholder="Home"
                      className="w-16 rounded border border-white/5 bg-gray-950 py-1.5 px-2 text-center text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pitch-green/40"
                    />
                    <span className="text-gray-600">-</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={awayScore}
                      onChange={e => setAwayScore(e.target.value)}
                      placeholder="Away"
                      className="w-16 rounded border border-white/5 bg-gray-950 py-1.5 px-2 text-center text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pitch-green/40"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      placeholder="Share match predictions..."
                      className="flex-1 rounded-lg border border-white/5 bg-gray-950 px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pitch-green/40 transition-colors"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-white px-3.5 py-2.5 text-gray-950 hover:bg-gray-100 transition-colors btn-animated cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </section>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
