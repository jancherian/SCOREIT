export const SPORTS = {
  football: {
    id: 'football',
    label: 'Football (Soccer)',
    icon: '⚽️',
    scoreLabel: 'Goals',
    periodLabels: ['1st Half', '2nd Half'],
    maxPeriods: 2,
    defaultTimerMinutes: 45,
    hasExtraStats: false,
    extraStats: {},
  },
  cricket: {
    id: 'cricket',
    label: 'Cricket',
    icon: '🏏',
    scoreLabel: 'Runs',
    periodLabels: ['1st Innings', '2nd Innings'],
    maxPeriods: 2,
    defaultTimerMinutes: 0,
    hasExtraStats: true,
    extraStats: {
      runs: true,
      wickets: true,
      overs: true,
      balls: true,
      ballsPerOver: 6,
    },
  },
  basketball: {
    id: 'basketball',
    label: 'Basketball',
    icon: '🏀',
    scoreLabel: 'Points',
    periodLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
    maxPeriods: 4,
    defaultTimerMinutes: 12,
    hasExtraStats: false,
    extraStats: {},
  },
  volleyball: {
    id: 'volleyball',
    label: 'Volleyball',
    icon: '🏐',
    scoreLabel: 'Points',
    periodLabels: ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'],
    maxPeriods: 5,
    defaultTimerMinutes: 25,
    hasExtraStats: false,
    extraStats: {},
  },
  hockey: {
    id: 'hockey',
    label: 'Hockey',
    icon: '🏒',
    scoreLabel: 'Goals',
    periodLabels: ['1st Period', '2nd Period', '3rd Period'],
    maxPeriods: 3,
    defaultTimerMinutes: 20,
    hasExtraStats: false,
    extraStats: {},
  },
};

export function getSport(id) {
  return SPORTS[id] || null;
}

export function getAllSports() {
  return Object.values(SPORTS);
}

export const DEFAULT_SPORT = SPORTS.football;

