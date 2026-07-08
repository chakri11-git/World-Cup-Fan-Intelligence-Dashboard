const logger = require('../utils/logger');

// Local in-memory session persistence mock for support counts
let supportCounts = [
  { teamId: 'arg', teamName: 'Argentina', votes: 1450, region: 'South America' },
  { teamId: 'bra', teamName: 'Brazil', votes: 1200, region: 'South America' },
  { teamId: 'fra', teamName: 'France', votes: 980, region: 'Europe' },
  { teamId: 'esp', teamName: 'Spain', votes: 850, region: 'Europe' }
];

// Historical voting trend timeline details (for Area Chart)
const votingTrendTimeline = [
  { day: 'Day 1', Argentina: 200, Brazil: 150, France: 100, Spain: 80 },
  { day: 'Day 2', Argentina: 500, Brazil: 400, France: 280, Spain: 200 },
  { day: 'Day 3', Argentina: 850, Brazil: 680, France: 490, Spain: 380 },
  { day: 'Day 4', Argentina: 1100, Brazil: 920, France: 720, Spain: 590 },
  { day: 'Day 5', Argentina: 1450, Brazil: 1200, France: 980, Spain: 850 }
];

/**
 * Controller to retrieve all support counts and trend data
 */
exports.getSupportAnalytics = async (req, res, next) => {
  try {
    logger.info('Fetching support counts analytics and timelines');
    res.status(200).json({
      success: true,
      data: {
        counts: supportCounts,
        timeline: votingTrendTimeline,
        summary: {
          totalVotes: supportCounts.reduce((acc, curr) => acc + curr.votes, 0),
          leadingTeam: 'Argentina',
          growthRate: '18% increase in past 24 hours'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to cast support vote for a team
 */
exports.castSupportVote = async (req, res, next) => {
  const { teamId } = req.body;
  try {
    if (!teamId) {
      return res.status(400).json({ success: false, message: 'teamId is required to vote.' });
    }

    logger.info(`Received fan support vote for team: ${teamId}`);
    const teamRecord = supportCounts.find(t => t.teamId.toLowerCase() === teamId.toLowerCase());

    if (!teamRecord) {
      return res.status(444).json({ success: false, message: 'Invalid teamId supplied.' });
    }

    // Increment votes
    teamRecord.votes += 1;

    // Dynamically update the latest timeline record
    const latestTimeline = votingTrendTimeline[votingTrendTimeline.length - 1];
    if (teamRecord.teamName in latestTimeline) {
      latestTimeline[teamRecord.teamName] += 1;
    }

    res.status(200).json({
      success: true,
      message: `Support registered successfully for ${teamRecord.teamName}.`,
      data: teamRecord
    });
  } catch (error) {
    next(error);
  }
};
