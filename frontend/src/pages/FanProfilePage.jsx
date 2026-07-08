import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Globe, Heart, Shield, Award, CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/landing/Navbar';
import PageTransition from '../components/common/PageTransition';
import profileImg from '../assets/profile.jpg';
import AIDisclaimer from '../components/common/AIDisclaimer';

const FanProfilePage = () => {
  // Form Input States
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [favoritePlayer, setFavoritePlayer] = useState('');
  const [reasonForSupport, setReasonForSupport] = useState('');
  
  // App States
  const [predictionsMade, setPredictionsMade] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [badges, setBadges] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  // Recommendations States
  const [recs, setRecs] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const teamsList = [
    { id: 'arg', name: 'Argentina', flag: '🇦🇷' },
    { id: 'bra', name: 'Brazil', flag: '🇧🇷' },
    { id: 'fra', name: 'France', flag: '🇫🇷' },
    { id: 'esp', name: 'Spain', flag: '🇪🇸' }
  ];

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/fan-profile');
      const profile = response.data;

      setName(profile.name || '');
      setCountry(profile.country || '');
      setFavoriteTeam(profile.favoriteTeam || '');
      setFavoritePlayer(profile.favoritePlayer || '');
      setReasonForSupport(profile.reasonForSupport || '');
      
      setPredictionsMade(profile.predictionsMade || 0);
      setAccuracy(profile.accuracy || 0);
      setBadges(profile.badges || []);
      
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the API. Operating in local simulation mode.');
      setName('Alex Morgan');
      setCountry('United States');
      setFavoriteTeam('arg');
      setFavoritePlayer('Lionel Messi');
      setReasonForSupport('I love their playstyle and tactical flow.');
      setPredictionsMade(4);
      setAccuracy(75);
      setBadges(['First Predictor', 'Argentina Believer']);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const response = await api.get('/fan-profile/recommendations');
      if (response.data && response.data.success) {
        setRecs(response.data.data);
      } else {
        setRecs(response.data);
      }
    } catch (err) {
      console.warn('Failed to load AI recommendations', err);
      // Fallback local simulation in case backend is loading/mocking
      setRecs([
        {
          title: `Explore Tactical Center`,
          description: `Check out squad statistics, form sheets, and Gemini's custom tactical predictions for your favorite teams.`,
          type: "team",
          actionLabel: "Explore Team",
          actionLink: `/teams`
        },
        {
          title: `Join the Live Fan Chat Room`,
          description: `Connect with other fans to discuss the latest match highlights and review live AI sentiment metrics.`,
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
      ]);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchRecommendations();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Display Name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Display Name must be at least 2 characters.';
    }

    if (!country.trim()) {
      errors.country = 'Country is required.';
    }

    if (!favoriteTeam) {
      errors.favoriteTeam = 'Please select a supported team.';
    }

    if (!favoritePlayer.trim()) {
      errors.favoritePlayer = 'Favorite Player is required.';
    }

    if (!reasonForSupport.trim()) {
      errors.reasonForSupport = 'Reason for support is required.';
    } else if (reasonForSupport.trim().length < 10) {
      errors.reasonForSupport = 'Please write at least 10 characters detailing your support.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        name,
        country,
        favoriteTeam,
        favoritePlayer,
        reasonForSupport
      };

      await api.put('/fan-profile', payload);
      setSuccessMsg('Fan Profile synced and saved successfully!');
      fetchRecommendations(); // Refresh recommendations based on the new profile inputs!
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save profile changes to remote database.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const selectedTeamDetails = teamsList.find(t => t.id === favoriteTeam);

  return (
    <PageTransition>
      <div 
        className="min-h-screen text-gray-100 font-sans"
        style={{
          backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.76), rgba(3, 7, 18, 0.82)), url(${profileImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-pitch-green text-sm font-semibold uppercase tracking-wider mb-2">
                <User className="h-4 w-4" />
                <span>User Settings & Customization</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Fan Profile</h1>
              <p className="text-gray-400 mt-2">Update your preferences and showcase your fan credentials.</p>
            </div>
            <button 
              onClick={fetchProfileData} 
              className="self-start inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors btn-animated cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Profile
            </button>
          </div>

          {/* Success / Error Alerts */}
          {successMsg && (
            <div className="mb-6 rounded-lg bg-pitch-green/10 border border-pitch-green/20 p-4 text-sm text-pitch-green flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Dashboard split screen layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* Column 1, 2 & 3: Profile Form Container */}
            <div className="lg:col-span-3 glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Modify Settings</h3>
              
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                
                {/* Name & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name..."
                      className={`w-full rounded-lg border bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green/40 transition-colors ${
                        validationErrors.name ? 'border-red-500' : 'border-white/5'
                      }`}
                    />
                    {validationErrors.name && (
                      <span className="text-xs text-red-500 mt-1 block">{validationErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Country Location</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter country..."
                      className={`w-full rounded-lg border bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green/40 transition-colors ${
                        validationErrors.country ? 'border-red-500' : 'border-white/5'
                      }`}
                    />
                    {validationErrors.country && (
                      <span className="text-xs text-red-500 mt-1 block">{validationErrors.country}</span>
                    )}
                  </div>
                </div>

                {/* Supported Team & Favorite Player */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Supported Team</label>
                    <select
                      value={favoriteTeam}
                      onChange={(e) => setFavoriteTeam(e.target.value)}
                      className={`w-full rounded-lg border bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green/40 transition-colors cursor-pointer ${
                        validationErrors.favoriteTeam ? 'border-red-500' : 'border-white/5'
                      }`}
                    >
                      <option value="">Select contender...</option>
                      {teamsList.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.flag} {t.name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.favoriteTeam && (
                      <span className="text-xs text-red-500 mt-1 block">{validationErrors.favoriteTeam}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Favorite Player</label>
                    <input
                      type="text"
                      value={favoritePlayer}
                      onChange={(e) => setFavoritePlayer(e.target.value)}
                      placeholder="Enter player..."
                      className={`w-full rounded-lg border bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green/40 transition-colors ${
                        validationErrors.favoritePlayer ? 'border-red-500' : 'border-white/5'
                      }`}
                    />
                    {validationErrors.favoritePlayer && (
                      <span className="text-xs text-red-500 mt-1 block">{validationErrors.favoritePlayer}</span>
                    )}
                  </div>
                </div>

                {/* Reason for Support */}
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Reason for Support</label>
                  <textarea
                    value={reasonForSupport}
                    onChange={(e) => setReasonForSupport(e.target.value)}
                    placeholder="Detail your support and alignment details..."
                    rows={4}
                    className={`w-full rounded-lg border bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green/40 transition-colors ${
                      validationErrors.reasonForSupport ? 'border-red-500' : 'border-white/5'
                    }`}
                  />
                  {validationErrors.reasonForSupport && (
                    <span className="text-xs text-red-500 mt-1 block">{validationErrors.reasonForSupport}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto self-start rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-950 hover:bg-gray-100 transition-colors btn-animated disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving changes...' : 'Save Settings'}
                </button>

              </form>
            </div>

            {/* Column 4 & 5: Live Interactive Card Preview */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white">Live Profile Card</h3>
              
              <div 
                className="relative glass-card p-6 border-beam"
              >
                {selectedTeamDetails && (
                  <div className="absolute -top-6 -right-6 p-6 opacity-5 text-9xl font-black select-none pointer-events-none">
                    {selectedTeamDetails.flag}
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-pitch-green to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md select-none">
                      {name ? name.substring(0, 2).toUpperCase() : 'FC'}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{name || 'Guest Fan'}</h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Globe className="h-3 w-3" />
                        {country || 'Global Citizen'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Predictions Accuracy</span>
                    <span className="text-xl font-extrabold text-pitch-green mt-0.5 block">{accuracy}%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/5 pt-5 mb-4">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Heart className="h-4 w-4" />
                      Supported Team:
                    </span>
                    <span className="font-semibold text-white">
                      {selectedTeamDetails ? `${selectedTeamDetails.flag} ${selectedTeamDetails.name}` : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Shield className="h-4 w-4" />
                      Favorite Player:
                    </span>
                    <span className="font-semibold text-pitch-green">{favoritePlayer || 'Not specified'}</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 my-4">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Fan Statement</span>
                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{reasonForSupport || 'Edit settings to share your support statement.'}"
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-2">Unlocked Badges</span>
                  <div className="flex flex-wrap gap-2">
                    {badges.length > 0 ? (
                      badges.map((badge, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-full bg-trophy-gold/10 text-trophy-gold border border-trophy-gold/20 px-3 py-1 text-[10px] font-bold"
                        >
                          <Award className="h-3 w-3" />
                          {badge}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-600 italic">No badges unlocked yet.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* AI Fan Recommendations Section */}
              <div className="glass-card p-6 border border-white/5 flex flex-col gap-4 mt-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-5 w-5 text-pitch-green" />
                    AI Fan Recommendations
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Tailored insights based on your favorite team, player, and tournament support reasons.
                  </p>
                </div>

                {loadingRecs ? (
                  <div className="text-xs text-gray-500 italic py-4">Generating recommendations...</div>
                ) : recs.length > 0 ? (
                  <div className="flex flex-col gap-3.5">
                    {recs.map((rec, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:border-white/10 transition-colors"
                      >
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            rec.type === 'team' ? 'bg-pitch-green' : rec.type === 'group' ? 'bg-blue-500' : 'bg-trophy-gold'
                          }`} />
                          {rec.title}
                          {rec.confidenceScore != null && (
                            <span className="ml-auto text-[9px] text-gray-500 font-mono bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
                              {Math.round(rec.confidenceScore * 100)}% match
                            </span>
                          )}
                        </span>
                        <p className="text-xs text-gray-400 leading-relaxed">{rec.description}</p>
                        <Link 
                          to={rec.actionLink} 
                          className="text-xs text-pitch-green hover:underline font-bold self-start mt-1 flex items-center gap-0.5"
                        >
                          {rec.actionLabel} &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 italic">No recommendations available.</div>
                )}
                <AIDisclaimer />
              </div>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FanProfilePage;
