import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, Trophy, RefreshCw, User, Shield, Compass } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/landing/Navbar';
import PageTransition from '../components/common/PageTransition';
import worldcupImg from '../assets/worldcup.webp';

const TeamExplorer = () => {
  const [teams, setTeams] = useState([]);
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsData, profileData] = await Promise.all([
        api.get('/teams'),
        api.get('/fan-profile')
      ]);

      setTeams(teamsData.data || []);
      setFavoriteTeam(profileData.data?.favoriteTeam || '');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the API. Operating in local simulation mode.');
      setTeams([
        { teamId: 'arg', name: 'Argentina', fifaRank: 1, group: 'Group A', region: 'South America', flag: '🇦🇷', coach: 'Lionel Scaloni', starPlayer: 'Lionel Messi', stats: { played: 3, wins: 3, draws: 0, losses: 0, goalsFor: 8, goalsAgainst: 1 } },
        { teamId: 'bra', name: 'Brazil', fifaRank: 5, group: 'Group A', region: 'South America', flag: '🇧🇷', coach: 'Dorival Júnior', starPlayer: 'Vinicius Jr', stats: { played: 3, wins: 2, draws: 0, losses: 1, goalsFor: 5, goalsAgainst: 3 } },
        { teamId: 'fra', name: 'France', fifaRank: 2, group: 'Group B', region: 'Europe', flag: '🇫🇷', coach: 'Didier Deschamps', starPlayer: 'Kylian Mbappé', stats: { played: 3, wins: 2, draws: 1, losses: 0, goalsFor: 6, goalsAgainst: 2 } },
        { teamId: 'esp', name: 'Spain', fifaRank: 8, group: 'Group B', region: 'Europe', flag: '🇪🇸', coach: 'Luis de la Fuente', starPlayer: 'Lamine Yamal', stats: { played: 3, wins: 1, draws: 1, losses: 1, goalsFor: 4, goalsAgainst: 4 } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFavoriteToggle = async (teamId) => {
    const newFav = favoriteTeam === teamId ? '' : teamId;
    setFavoriteTeam(newFav);

    try {
      await api.put('/fan-profile', { favoriteTeam: newFav });
    } catch (err) {
      console.warn('API sync failed. Local state saved.', err);
    }
  };

  // Perform filtering logic
  const filteredTeams = teams.filter((team) => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.starPlayer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coach.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesGroup = selectedGroup === 'All' || team.group === selectedGroup;
    const matchesRegion = selectedRegion === 'All' || team.region === selectedRegion;

    return matchesSearch && matchesGroup && matchesRegion;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-gray-100 font-sans">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-pitch-green text-sm font-semibold uppercase tracking-wider mb-2">
                <Compass className="h-4 w-4" />
                <span>World Cup Teams Explorer</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Explore Contenders</h1>
              <p className="text-gray-400 mt-2">Discover statistics, tactics, and select your favorite teams.</p>
            </div>
            <button 
              onClick={fetchData} 
              className="self-start inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors btn-animated cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
          </div>

          {/* FIFA 2018 Hero Banner */}
          <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-10 border border-white/10 shadow-2xl glass-card">
            <img 
              src={worldcupImg} 
              alt="FIFA 2018 World Cup" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6 md:p-8">
              <div>
                <span className="text-[10px] text-pitch-green uppercase font-bold tracking-widest bg-pitch-green/10 border border-pitch-green/20 px-2 py-0.5 rounded">Tournament Archive</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">FIFA World Cup Contenders</h2>
                <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">Explore historical analytics, live group standings, and custom tactical breakdowns for the ultimate tournament candidates.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-500">
              ⚠️ {error}
            </div>
          )}

          {/* Filters Controls Panel */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by team, star player, or manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-gray-900/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pitch-green/40 transition-colors"
              />
            </div>

            {/* Group Filter Selector */}
            <div className="flex gap-2 bg-gray-900/40 p-1 border border-white/5 rounded-xl self-start">
              {['All', 'Group A', 'Group B'].map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all btn-animated cursor-pointer ${
                    selectedGroup === group 
                      ? 'bg-white text-gray-950 shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Region Filter Selector */}
            <div className="flex gap-2 bg-gray-900/40 p-1 border border-white/5 rounded-xl self-start">
              {['All', 'South America', 'Europe'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all btn-animated cursor-pointer ${
                    selectedRegion === region 
                      ? 'bg-white text-gray-950 shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Grid System */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading contender telemetry...</div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No teams match your selected filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTeams.map((team) => (
                <div
                  key={team.teamId}
                  className="relative glass-card p-6 flex flex-col justify-between min-h-[220px]"
                >
                  {/* Header card info */}
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-4xl" role="img" aria-label={team.name}>
                        {team.flag}
                      </span>
                      <button
                        onClick={() => handleFavoriteToggle(team.teamId)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Heart 
                          className={`h-5.5 w-5.5 ${
                            favoriteTeam === team.teamId 
                              ? 'fill-red-500 text-red-500' 
                              : ''
                          }`} 
                        />
                      </button>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {team.name}
                        {favoriteTeam === team.teamId && (
                          <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                            Fav
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-2 mt-1 text-xs text-gray-500">
                        <span>{team.group}</span>
                        <span>•</span>
                        <span>{team.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body stats block */}
                  <div className="my-6 border-y border-white/5 py-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-gray-500 text-[10px] uppercase font-bold">Played</div>
                        <div className="text-md font-semibold text-white mt-1">{team.stats.played}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[10px] uppercase font-bold">Won</div>
                        <div className="text-md font-semibold text-pitch-green mt-1">{team.stats.wins}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[10px] uppercase font-bold">Goals</div>
                        <div className="text-md font-semibold text-white mt-1">+{team.stats.goalsFor}</div>
                      </div>
                    </div>
                  </div>

                  {/* Manager & Star Player Details */}
                  <div>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Shield className="h-3.5 w-3.5" />
                          Coach:
                        </span>
                        <span className="font-semibold text-white">{team.coach}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1 text-gray-500">
                          <User className="h-3.5 w-3.5" />
                          Star:
                        </span>
                        <span className="font-semibold text-pitch-green">{team.starPlayer}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 border-t border-white/5 pt-2 mt-1">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Trophy className="h-3.5 w-3.5" />
                          FIFA Rank:
                        </span>
                        <span className="font-bold text-trophy-gold">#{team.fifaRank}</span>
                      </div>
                    </div>

                    <Link 
                      to={`/teams/${team.teamId}`}
                      className="mt-4 block w-full text-center rounded-lg bg-white/5 border border-white/10 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors btn-animated"
                    >
                      View Team Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default TeamExplorer;
