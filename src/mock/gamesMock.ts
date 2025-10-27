export type GameItem = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  url: string;
};

export const gamesMock: GameItem[] = [
  {
    id: 'trivia',
    title: 'Trivia Challenge',
    emoji: '🧠',
    description: 'Test your knowledge, win big!',
    url: 'https://example.com/trivia-demo',
  },
  {
    id: 'spin',
    title: 'Spin & Win',
    emoji: '🎰',
    description: 'Feeling lucky? Spin the wheel.',
    url: 'https://example.com/spin-demo',
  },
  {
    id: 'puzzle',
    title: 'Puzzle Mania',
    emoji: '🧩',
    description: 'Solve puzzles, earn rewards.',
    url: 'https://example.com/puzzle-demo',
  },
  {
    id: 'ad_dash',
    title: 'Ad Dash',
    emoji: '🚀',
    description: 'Watch ads, collect points!',
    url: 'https://example.com/ad-dash-demo',
  },
];
