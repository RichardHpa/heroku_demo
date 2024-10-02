import { describe, expect, test } from 'vitest';

import { checkRunningTournaments } from './checkRunningTournaments';

const defaultFixture = {
  tcg: {
    type: 'tcg',
    data: [
      {
        id: '0000001',
        name: 'Pokémon Oceania TCG Regional Championship – Brisbane',
        date: {
          start: '2022-03-12',
          end: '2022-03-13',
        },
        tournamentStatus: 'finished',
        decklists: 0,
        players: {
          juniors: '15',
          seniors: '16',
          masters: '151',
        },
        winners: {
          juniors: 'Luke B.',
          seniors: 'max k.',
          masters: 'Natalie M.',
        },
        roundNumbers: {
          juniors: 7,
          seniors: 7,
          masters: 11,
        },
        lastUpdated: '2023-03-30 02:03:41.000000',
        rk9link: 'z1QHQtOsGCKCeesCpPiO',
      },
      {
        id: '0000002',
        name: 'Salt Lake City TCG Regional Championship 2022',
        date: {
          start: '2022-03-18',
          end: '2022-03-20',
        },
        tournamentStatus: 'finished',
        decklists: 0,
        players: {
          juniors: '28',
          seniors: '36',
          masters: '627',
        },
        winners: {
          juniors: 'Nathan O.',
          seniors: 'Caleb R.',
          masters: 'Andrew K.',
        },
        roundNumbers: {
          juniors: 8,
          seniors: 9,
          masters: 17,
        },
        lastUpdated: '2023-03-30 02:05:04.000000',
        rk9link: 'dqpquZcM3mh7WRw8KvDe',
      },
      {
        id: '0000003',
        name: 'Liverpool TCG Regional Championship 2022',
        date: {
          start: '2022-03-26',
          end: '2022-03-27',
        },
        tournamentStatus: 'finished',
        decklists: 1,
        players: {
          juniors: '23',
          seniors: '36',
          masters: '373',
        },
        winners: {
          juniors: 'Leo G.',
          seniors: 'Rune H.',
          masters: 'Robin S.',
        },
        roundNumbers: {
          juniors: 8,
          seniors: 9,
          masters: 17,
        },
        lastUpdated: '2023-03-30 02:06:11.000000',
        rk9link: 'KTh3p4c9jkGnNGUq1hic',
      },
    ],
  },
};

describe('checkRunningTournaments', () => {
  test('returns an empty array if no tournaments are running', async () => {
    const tournaments = await checkRunningTournaments(defaultFixture);
    expect(tournaments).toHaveLength(0);
    expect(tournaments).toEqual([]);
  });

  test('returns an array of running tournaments', async () => {
    const fixture = {
      ...defaultFixture,
      tcg: {
        ...defaultFixture.tcg,
        data: [
          ...defaultFixture.tcg.data,
          {
            id: '0000004',
            name: 'Pokémon Oceania TCG Regional Championship – Brisbane',
            date: {
              start: '2023-03-12',
              end: '2023-03-13',
            },
            tournamentStatus: 'running',
            decklists: 0,
            players: {
              juniors: '15',
              seniors: '16',
              masters: '151',
            },
            winners: {
              juniors: 'Luke B.',
              seniors: 'max k.',
              masters: 'Natalie M.',
            },
            roundNumbers: {
              juniors: 7,
              seniors: 7,
              masters: 11,
            },
            lastUpdated: '2023-03-30 02:03:41.000000',
            rk9link: 'z1QHQtOsGCKCeesCpPiO',
          },
        ],
      },
    };

    const tournaments = await checkRunningTournaments(fixture);
    expect(tournaments).toHaveLength(1);
    expect(tournaments).toEqual([
      {
        id: '0000004',
        name: 'Pokémon Oceania TCG Regional Championship – Brisbane',
        date: {
          start: '2023-03-12',
          end: '2023-03-13',
        },
        tournamentStatus: 'running',
        decklists: 0,
        players: {
          juniors: '15',
          seniors: '16',
          masters: '151',
        },
        winners: {
          juniors: 'Luke B.',
          seniors: 'max k.',
          masters: 'Natalie M.',
        },
        roundNumbers: {
          juniors: 7,
          seniors: 7,
          masters: 11,
        },
        lastUpdated: '2023-03-30 02:03:41.000000',
        rk9link: 'z1QHQtOsGCKCeesCpPiO',
      },
    ]);
  });
});
