import React from 'react';
import Button from '../common/Button';
import './MatchCard.css';

/**
 * MatchCard Dashboard Component
 */
const MatchCard = ({ match, onSelect, onPredict }) => {
  const { matchId, homeTeam, awayTeam, status, minute, score, venue, date } = match;

  const getStatusBadge = () => {
    if (status === 'LIVE') {
      return <span className="badge-live">LIVE ({minute}')</span>;
    }
    if (status === 'FINISHED') {
      return <span className="badge-finished">FT</span>;
    }
    return <span className="badge-scheduled">Upcoming</span>;
  };

  return (
    <div className="premium-card match-card">
      <div className="match-card-header">
        <span className="match-venue">{venue}</span>
        {getStatusBadge()}
      </div>

      <div className="match-card-body">
        <div className="team-column home-team">
          <span className="team-name">{homeTeam}</span>
        </div>

        <div className="score-container">
          <span className="score-value">{score.home}</span>
          <span className="score-divider">-</span>
          <span className="score-value">{score.away}</span>
        </div>

        <div className="team-column away-team">
          <span className="team-name">{awayTeam}</span>
        </div>
      </div>

      <div className="match-card-footer">
        <Button variant="secondary" onClick={() => onSelect(matchId)}>
          Match Hub
        </Button>
        <Button variant="primary" onClick={() => onPredict(matchId)}>
          Ask Gemini AI
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
