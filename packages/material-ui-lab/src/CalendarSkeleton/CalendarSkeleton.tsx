import * as React from 'react';
import clsx from 'clsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core/styles';
import { DAY_SIZE, DAY_MARGIN } from '../internal/pickers/constants/dimensions';
import { styles as calendarStyles } from '../DayPicker/Calendar';

export interface CalendarSkeletonProps extends React.HTMLProps<HTMLDivElement> {}

export const styles = (theme: Theme) =>
  createStyles({
    ...calendarStyles(theme),
    root: {
      alignSelf: 'start',
    },
    daySkeleton: {
      margin: `0 ${DAY_MARGIN}px`,
    },
    hidden: {
      visibility: 'hidden',
    },
  });

const monthMap = [
  [0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0],
];

const CalendarSkeleton: React.FC<CalendarSkeletonProps & WithStyles<typeof styles>> = (props) => {
  const { className, classes, ...other } = props;

  return (
    <div className={clsx(classes.root, className)} {...other}>
      {monthMap.map((week, index) => (
        <div key={index} className={classes.week}>
          {week.map((day, index2) => (
            <Skeleton
              key={index2}
              variant="circular"
              width={DAY_SIZE}
              height={DAY_SIZE}
              className={clsx(classes.daySkeleton, {
                [classes.hidden]: day === 0,
              })}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default withStyles(styles, {
  name: 'MuiCalendarSkeleton',
})(CalendarSkeleton);
