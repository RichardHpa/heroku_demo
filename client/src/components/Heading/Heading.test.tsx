import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Heading } from './Heading';

describe('Heading', () => {
  test('renders default heading', () => {
    render(<Heading>Test</Heading>);
    const heading = screen.getByRole('heading', { name: /Test/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test.each([['1'], ['2'], ['3'], ['4'], ['5'], ['6']] as const)(
    'renders heading level %s',
    level => {
      render(<Heading level={level}>Test</Heading>);
      const heading = screen.getByRole('heading', {
        name: /Test/i,
        level: Number(level),
      });
      expect(heading).toBeInTheDocument();
    },
  );
});
