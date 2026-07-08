import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Calendar, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/landing/Navbar';
import PageTransition from '../components/common/PageTransition';

const GroupDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('group-a');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, matchesRes] = await Promise.all([
        api.get('/groups'),
        api.get('/matches')
      ]);

      setGroups(groupsRes.data || []);
      setMatches(matchesRes.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the API. Operating in local simulation mode.');
      setGroups([
        {
          groupId: 'group-a',
          name: 'Group A',
          standings: [
            { position: 1, teamId: 'arg', teamName: 'Argentina', played: 3, wins: 3, draws: 0, losses: 0, goalDifference: 7, points: 9, flag: '🇦🇷' },
            { position: 2, teamId: 'bra', teamName: 'Brazil', played: 3, wins: 2, draws: 0, losses: 1, goalDifference: 2, points: 6, flag: '🇧🇷' }
          ]
        },
        {
          groupId: 'group-b',
          name: 'Group B',
          standings: [
            { position: 1, teamId: 'fra', teamName: 'France', played: 3, wins: 2, draws: 1, losses: 0, goalDifference: 4, points: 7, flag: '🇫🇷' },
            { position: 2, teamId: 'esp', teamName: 'Spain', played: 3, wins: 1, draws: 1, losses: 1, goalDifference: 0, points: 4, flag: '🇪🇸' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedGroup = groups.find(g => g.groupId === selectedGroupId);

  const groupTeamNames = selectedGroup 
    ? selectedGroup.standings.map(t => t.teamName) 
    : [];

  const groupMatches = matches.filter(
    m => groupTeamNames.includes(m.homeTeam) && groupTeamNames.includes(m.awayTeam)
  );

  const flagMapping = {
    'Argentina': '🇦🇷',
    'Brazil': '🇧🇷',
    'France': '🇫🇷',
    'Spain': '🇪🇸'
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-gray-100 font-sans">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-pitch-green text-sm font-semibold uppercase tracking-wider mb-2">
                <Trophy className="h-4 w-4" />
                <span>World Cup Standings Hub</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Group Dashboard</h1>
              <p className="text-gray-400 mt-2">Track real-time group points, qualification status, and scores.</p>
            </div>
            <button 
              onClick={fetchData} 
              className="self-start inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors btn-animated cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Tables
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-500">
              ⚠️ {error}
            </div>
          )}

          {/* Group Selection Tabs */}
          <div className="flex gap-2 bg-gray-900/40 p-1 border border-white/5 rounded-xl self-start mb-8 w-full overflow-x-auto scrollbar-none pb-1">
            {groups.map((g) => (
              <button
                key={g.groupId}
                onClick={() => setSelectedGroupId(g.groupId)}
                className={`whitespace-nowrap shrink-0 rounded-lg px-4.5 py-2.5 text-center text-xs font-bold uppercase tracking-wider transition-all btn-animated cursor-pointer ${
                  selectedGroupId === g.groupId 
                    ? 'bg-white text-gray-950 shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading standings...</div>
          ) : !selectedGroup ? (
            <div className="text-center py-20 text-gray-500">Group not found.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Column 1 & 2: Standings Table */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <section className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <ShieldCheck className="h-5 w-5 text-pitch-green" />
                    Standings - {selectedGroup.name}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                          <th className="pb-4 text-center w-12">Pos</th>
                          <th className="pb-4 pl-4">Team</th>
                          <th className="pb-4 text-center w-16">Pld</th>
                          <th className="pb-4 text-center w-16">W</th>
                          <th className="pb-4 text-center w-16">L</th>
                          <th className="pb-4 text-center w-16">GD</th>
                          <th className="pb-4 text-center w-16">Pts</th>
                          <th className="pb-4 text-right pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGroup.standings.map((team, idx) => {
                          const qualifies = team.position <= 2;
                          const flag = team.flag || '🏳️';
                          const wins = team.wins !== undefined ? team.wins : (team.points >= 6 ? 2 : 1);
                          const losses = team.losses !== undefined ? team.losses : (team.points === 9 ? 0 : 1);

                          return (
                            <tr
                              key={team.teamId}
                              className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                                qualifies ? 'bg-pitch-green/[0.01]' : ''
                              }`}
                            >
                              <td className="py-5 text-center font-bold text-gray-400">
                                {team.position}
                              </td>
                              <td className="py-5 pl-4 font-bold text-white flex items-center gap-3">
                                <span className="text-2xl">{flag}</span>
                                {team.teamName}
                              </td>
                              <td className="py-5 text-center text-gray-300">{team.played}</td>
                              <td className="py-5 text-center text-pitch-green font-semibold">{wins}</td>
                              <td className="py-5 text-center text-red-500">{losses}</td>
                              <td className="py-5 text-center text-gray-300">
                                {team.goalDifference > 0 ? '+' : ''}
                                {team.goalDifference}
                              </td>
                              <td className="py-5 text-center font-bold text-trophy-gold">
                                {team.points}
                              </td>
                              <td className="py-5 text-right pr-4">
                                {qualifies ? (
                                  <span className="inline-flex items-center rounded-full bg-pitch-green/10 px-2.5 py-0.5 text-xs font-semibold text-pitch-green border border-pitch-green/20">
                                    Qualifies
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
                                    Eliminated
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-pitch-green/10 border border-pitch-green/20"></span>
                      Promotion / Round of 16 Zone
                    </span>
                  </div>
                </section>
              </div>

              {/* Column 3: Recent Matches inside the group */}
              <div className="flex flex-col gap-6">
                <section className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Group Fixtures & Outcomes
                  </h3>

                  <div className="flex flex-col gap-4">
                    {groupMatches.length > 0 ? (
                      groupMatches.map((match) => (
                        <div 
                          key={match.matchId}
                          className="rounded-xl border border-white/5 bg-gray-950 p-4 flex flex-col gap-3 hover:border-white/10 transition-colors"
                        >
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{match.venue}</span>
                            <span className={`font-bold ${match.status === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                              {match.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center font-bold">
                            <span className="text-white">{match.homeTeam}</span>
                            <span className="text-trophy-gold text-sm bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {match.score.home} - {match.score.away}
                            </span>
                            <span className="text-white">{match.awayTeam}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">No group fixtures logged.</div>
                    )}
                  </div>
                </section>
              </div>

            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default GroupDashboard;
