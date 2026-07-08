import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global Fan Profile State
  const [fanProfile, setFanProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Global Selected Team ID State (for contender tracking details)
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Global Support Voting Metrics State
  const [supportAnalytics, setSupportAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await api.get('/fan-profile');
      setFanProfile(response.data);
    } catch (err) {
      console.warn('AppContext: loading profile from local fallback.', err);
      setFanProfile({
        username: 'Fan_10',
        name: 'Alex Morgan',
        country: 'United States',
        favoriteTeam: 'arg',
        favoritePlayer: 'Lionel Messi',
        reasonForSupport: 'I love their playstyle and tactical flow.',
        predictionsMade: 4,
        accuracy: 75,
        badges: ['First Predictor', 'Argentina Believer']
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateFanProfile = async (profilePayload) => {
    try {
      const response = await api.put('/fan-profile', profilePayload);
      setFanProfile(response.data);
      return response.data;
    } catch (err) {
      console.warn('AppContext: profile update fallback locally.', err);
      const updated = { ...fanProfile, ...profilePayload };
      setFanProfile(updated);
      return updated;
    }
  };

  const fetchSupportAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await api.get('/support');
      setSupportAnalytics(response.data);
    } catch (err) {
      console.warn('AppContext: loading support analytics fallback locally.', err);
      setSupportAnalytics({
        counts: [
          { teamId: 'arg', teamName: 'Argentina', votes: 1450, region: 'South America' },
          { teamId: 'bra', teamName: 'Brazil', votes: 1200, region: 'South America' },
          { teamId: 'fra', teamName: 'France', votes: 980, region: 'Europe' },
          { teamId: 'esp', teamName: 'Spain', votes: 850, region: 'Europe' }
        ],
        timeline: [
          { day: 'Day 1', Argentina: 200, Brazil: 150, France: 100, Spain: 80 },
          { day: 'Day 2', Argentina: 500, Brazil: 400, France: 280, Spain: 200 },
          { day: 'Day 3', Argentina: 850, Brazil: 680, France: 490, Spain: 380 },
          { day: 'Day 4', Argentina: 1100, Brazil: 920, France: 720, Spain: 590 },
          { day: 'Day 5', Argentina: 1450, Brazil: 1200, France: 980, Spain: 850 }
        ],
        summary: {
          totalVotes: 4480,
          leadingTeam: 'Argentina',
          growthRate: '18% increase in past 24 hours'
        }
      });
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const castVote = async (teamId) => {
    try {
      await api.post('/support/vote', { teamId });
      await fetchSupportAnalytics(); // Trigger reload to sync charts globally
    } catch (err) {
      console.error('Failed to cast vote on backend:', err);
      
      // Fallback local update
      if (supportAnalytics) {
        const updatedCounts = supportAnalytics.counts.map(t => {
          if (t.teamId === teamId) {
            return { ...t, votes: t.votes + 1 };
          }
          return t;
        });
        setSupportAnalytics({
          ...supportAnalytics,
          counts: updatedCounts
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchSupportAnalytics();
  }, []);

  return (
    <AppContext.Provider value={{
      fanProfile,
      loadingProfile,
      updateFanProfile,
      selectedTeamId,
      setSelectedTeamId,
      supportAnalytics,
      loadingAnalytics,
      castVote,
      refreshSupport: fetchSupportAnalytics,
      refreshProfile: fetchProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};
