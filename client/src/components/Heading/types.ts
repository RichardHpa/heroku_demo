import type { ReactNode } from 'react';

export type Level = '1' | '2' | '3' | '4' | '5' | '6';

export type HeadingProps = {
  className?: string;
  level?: Level;
  children: ReactNode;
};
