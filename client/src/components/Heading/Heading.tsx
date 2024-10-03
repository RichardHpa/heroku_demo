import { createElement } from 'react';
import clsx from 'clsx';

import { headingClasses } from './headingClasses';

import type { FC } from 'react';
import { HeadingProps } from './types';

export const Heading: FC<HeadingProps> = ({
  children,
  level = '1',
  className = '',
}) => {
  return createElement(
    `h${level}`,
    {
      className: clsx({
        [className]: className,
        [headingClasses.base]: true,
        [headingClasses.level[level]]: true,
      }),
    },
    children,
  );
};
