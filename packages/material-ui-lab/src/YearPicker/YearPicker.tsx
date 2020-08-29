import * as React from 'react';
import { createStyles, WithStyles, withStyles, useTheme } from '@material-ui/core/styles';
import PickersYear from './PickersYear';
import { useUtils, useNow } from '../internal/pickers/hooks/useUtils';
import { PickerOnChangeFn } from '../internal/pickers/hooks/useViews';
import { findClosestEnabledDate } from '../internal/pickers/date-utils';
import { PickerSelectionState } from '../internal/pickers/hooks/usePickerState';
import { WrapperVariantContext } from '../internal/pickers/wrappers/WrapperVariantContext';
import { useGlobalKeyDown, keycode as keys } from '../internal/pickers/hooks/useKeyDown';

export interface ExportedYearPickerProps<TDate> {
  /**
   * Callback firing on year change @DateIOType.
   */
  onYearChange?: (date: TDate) => void;
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view. @DateIOType.
   */
  shouldDisableYear?: (day: TDate) => boolean;
}

export interface YearPickerProps<TDate> extends ExportedYearPickerProps<TDate> {
  allowKeyboardControl?: boolean;
  changeFocusedDay: (day: TDate) => void;
  date: TDate;
  disableFuture?: boolean | null;
  disablePast?: boolean | null;
  isDateDisabled: (day: TDate) => boolean;
  maxDate: TDate;
  minDate: TDate;
  onChange: PickerOnChangeFn<TDate>;
}

export const styles = createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflowY: 'auto',
    height: '100%',
    margin: '0 4px',
  },
});

function YearPicker<TDate>({
  allowKeyboardControl,
  changeFocusedDay,
  classes,
  date: __dateOrNull,
  disableFuture,
  disablePast,
  isDateDisabled,
  maxDate,
  minDate,
  onChange,
  onYearChange,
  shouldDisableYear,
}: YearPickerProps<TDate> & WithStyles<typeof styles>) {
  const now = useNow<TDate>();
  const theme = useTheme();
  const utils = useUtils<TDate>();

  const selectedDate = __dateOrNull || now;
  const currentYear = utils.getYear(selectedDate);
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const selectedYearRef = React.useRef<HTMLButtonElement>(null);
  const [focusedYear, setFocusedYear] = React.useState<number | null>(currentYear);

  const handleYearSelection = React.useCallback(
    (year: number, isFinish: PickerSelectionState = 'finish') => {
      const submitDate = (newDate: TDate) => {
        onChange(newDate, isFinish);
        changeFocusedDay(newDate || now);

        if (onYearChange) {
          onYearChange(newDate);
        }
      };

      const newDate = utils.setYear(selectedDate, year);
      if (isDateDisabled(newDate)) {
        const closestEnabledDate = findClosestEnabledDate({
          utils,
          date: newDate,
          minDate,
          maxDate,
          disablePast: Boolean(disablePast),
          disableFuture: Boolean(disableFuture),
          shouldDisableDate: isDateDisabled,
        });

        submitDate(closestEnabledDate || now);
      } else {
        submitDate(newDate);
      }
    },
    [
      utils,
      now,
      selectedDate,
      isDateDisabled,
      onChange,
      changeFocusedDay,
      onYearChange,
      minDate,
      maxDate,
      disablePast,
      disableFuture,
    ],
  );

  const focusYear = React.useCallback(
    (year: number) => {
      if (!isDateDisabled(utils.setYear(selectedDate, year))) {
        setFocusedYear(year);
      }
    },
    [selectedDate, isDateDisabled, utils],
  );

  const yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;
  const nowFocusedYear = focusedYear || currentYear;
  useGlobalKeyDown(Boolean(allowKeyboardControl), {
    [keys.ArrowUp]: () => focusYear(nowFocusedYear - yearsInRow),
    [keys.ArrowDown]: () => focusYear(nowFocusedYear + yearsInRow),
    [keys.ArrowLeft]: () => focusYear(nowFocusedYear + (theme.direction === 'ltr' ? -1 : 1)),
    [keys.ArrowRight]: () => focusYear(nowFocusedYear + (theme.direction === 'ltr' ? 1 : -1)),
  });

  return (
    <div className={classes.root}>
      {utils.getYearRange(minDate, maxDate).map((year) => {
        const yearNumber = utils.getYear(year);
        const selected = yearNumber === currentYear;

        return (
          <PickersYear
            key={utils.format(year, 'year')}
            selected={selected}
            value={yearNumber}
            onSelect={handleYearSelection}
            allowKeyboardControl={allowKeyboardControl}
            focused={yearNumber === focusedYear}
            ref={selected ? selectedYearRef : undefined}
            disabled={
              (disablePast && utils.isBeforeYear(year, now)) ||
              (disableFuture && utils.isAfterYear(year, now)) ||
              (shouldDisableYear && shouldDisableYear(year))
            }
          >
            {utils.format(year, 'year')}
          </PickersYear>
        );
      })}
    </div>
  );
}

export default withStyles(styles, { name: 'MuiPickersYearSelection' })(YearPicker) as <TDate>(
  props: YearPickerProps<TDate>,
) => JSX.Element;
