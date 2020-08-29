import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import PickersMonth from './PickersMonth';
import { useUtils, useNow } from '../internal/pickers/hooks/useUtils';
import { PickerOnChangeFn } from '../internal/pickers/hooks/useViews';

export interface MonthPickerProps<TDate> {
  date: TDate | null;
  minDate: TDate;
  maxDate: TDate;
  onChange: PickerOnChangeFn<TDate>;
  disablePast?: boolean | null;
  disableFuture?: boolean | null;
  onMonthChange?: (date: TDate) => void | Promise<void>;
}

export const styles = createStyles({
  root: {
    width: 310,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'stretch',
  },
});

function MonthPicker<TDate>({
  classes,
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  onChange,
  onMonthChange,
}: MonthPickerProps<TDate> & WithStyles<typeof styles>) {
  const utils = useUtils<TDate>();
  const now = useNow<TDate>();
  const currentMonth = utils.getMonth(date || now);

  const shouldDisableMonth = (month: TDate) => {
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate,
    );

    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
    );

    const isBeforeFirstEnabled = utils.isBefore(month, firstEnabledMonth);
    const isAfterLastEnabled = utils.isAfter(month, lastEnabledMonth);

    return isBeforeFirstEnabled || isAfterLastEnabled;
  };

  const onMonthSelect = React.useCallback(
    (month: number) => {
      const newDate = utils.setMonth(date || now, month);

      onChange(newDate, 'finish');
      if (onMonthChange) {
        onMonthChange(newDate);
      }
    },
    [date, now, onChange, onMonthChange, utils],
  );

  return (
    <div className={classes.root}>
      {utils.getMonthArray(date || now).map((month) => {
        const monthNumber = utils.getMonth(month);
        const monthText = utils.format(month, 'monthShort');

        return (
          <PickersMonth
            key={monthText}
            value={monthNumber}
            selected={monthNumber === currentMonth}
            onSelect={onMonthSelect}
            disabled={shouldDisableMonth(month)}
          >
            {monthText}
          </PickersMonth>
        );
      })}
    </div>
  );
}

export default withStyles(styles, { name: 'MuiPickersMonthSelection' })(MonthPicker) as <TDate>(
  props: MonthPickerProps<TDate>,
) => JSX.Element;
