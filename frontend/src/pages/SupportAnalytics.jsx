import React, { useState, useContext } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid 
} from 'recharts';
import { BarChart2, PieChart as PieIcon, TrendingUp, Vote, ThumbsUp, RefreshCw } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/landing/Navbar';
import PageTransition from '../components/common/PageTransition';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const SupportAnalytics = () => {
  const { supportAnalytics, loadingAnalytics, castVote, refreshSupport } = useContext(AppContext);
  const [votingTeam, setVotingTeam] = useState('');
  const [saving, setSaving] = useState(false);

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!votingTeam) return;

    setSaving(true);
    try {
      await castVote(votingTeam);
      setVotingTeam('');
    } catch (err) {
      console.error(err);
      alert('Failed to register support vote.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingAnalytics || !supportAnalytics) {
    return (
      <div className="min-h-screen bg-transparent text-gray-100 flex items-center justify-center">
        <span>Loading support analytics...</span>
      </div>
    );
  }

  const countsData = supportAnalytics.counts || [];
  const timelineData = supportAnalytics.timeline || [];
  const summary = supportAnalytics.summary || null;

  const regionalDataMap = countsData.reduce((acc, curr) => {
    const regionName = curr.region || 'Other';
    if (!acc[regionName]) {
      acc[regionName] = { name: regionName, value: 0 };
    }
    acc[regionName].value += curr.votes;
    return acc;
  }, {});
  const pieChartData = Object.values(regionalDataMap);

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-gray-100 font-sans">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-pitch-green text-sm font-semibold uppercase tracking-wider mb-2">
                <BarChart2 className="h-4 w-4" />
                <span>World Cup Fan Analytics Hub</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Support Analytics</h1>
              <p className="text-gray-400 mt-2">Explore support statistics and vote trends across contender nations.</p>
            </div>
            <button 
              onClick={refreshSupport} 
              className="self-start inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors btn-animated cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Metrics
            </button>
          </div>

          {/* Total Summary widgets */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transform transition-transform duration-200">
                <span className="text-xs text-gray-500 uppercase font-bold">Total Fan Votes Registered</span>
                <span className="text-4xl font-black text-white mt-3 block">{summary.totalVotes}</span>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transform transition-transform duration-200">
                <span className="text-xs text-gray-500 uppercase font-bold text-pitch-green">Leading Fan Favorite</span>
                <span className="text-4xl font-black text-pitch-green mt-3 block">{summary.leadingTeam}</span>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transform transition-transform duration-200">
                <span className="text-xs text-gray-500 uppercase font-bold text-trophy-gold">Activity Trend</span>
                <span className="text-xl font-bold text-white mt-3 block">{summary.growthRate}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1 & 2: Bar Chart, Area Chart */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Bar Chart Panel */}
              <section className="glass-card p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <BarChart2 className="h-5 w-5 text-pitch-green" />
                  Support Counts by Contender
                </h3>
                
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="teamName" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="votes" fill="#10b981" radius={[8, 8, 0, 0]}>
                        {countsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Area Chart Panel */}
              <section className="glass-card p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Voting Timeline Progression
                </h3>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorArg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBra" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="Argentina" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArg)" />
                      <Area type="monotone" dataKey="Brazil" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBra)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

            </div>

            {/* Column 3: Pie Chart and Cast Vote Form */}
            <div className="flex flex-col gap-8">
              
              {/* Pie Chart Panel */}
              <section className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <PieIcon className="h-5 w-5 text-yellow-500" />
                    Regional Support Distribution
                  </h3>

                  <div className="h-56 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Custom Legend layout */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5 text-xs">
                  {pieChartData.map((val, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-400">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        {val.name}
                      </span>
                      <span className="font-bold text-white">{val.value} votes</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Vote Casting Widget */}
              <section className="glass-card p-6 border-beam">
                <div className="flex items-center gap-2.5 mb-4 text-pitch-green">
                  <Vote className="h-6 w-6 text-pitch-green" />
                  <h3 className="text-lg font-bold text-white">Cast Your Vote</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  Select a contender and cast your vote to immediately update global support indicators.
                </p>

                <form onSubmit={handleVoteSubmit} className="flex flex-col gap-4">
                  <select
                    value={votingTeam}
                    onChange={(e) => setVotingTeam(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green/40 transition-colors cursor-pointer"
                  >
                    <option value="">Select supported team...</option>
                    {countsData.map(t => (
                      <option key={t.teamId} value={t.teamId}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={saving || !votingTeam}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-950 hover:bg-gray-100 transition-colors btn-animated disabled:opacity-50 cursor-pointer"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {saving ? 'Registering...' : 'Register Vote'}
                  </button>
                </form>
              </section>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SupportAnalytics;
