import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import MonthPicker from '../MonthPicker/MonthPicker';
import { useCalendarState } from './useCalendarState';
import { useUtils } from '../internal/pickers/hooks/useUtils';
import FadeTransitionGroup from './PickersFadeTransitionGroup';
import Calendar, { ExportedCalendarProps } from './PickersCalendar';
import { PickerOnChangeFn } from '../internal/pickers/hooks/useViews';
import { DAY_SIZE, DAY_MARGIN } from '../internal/pickers/constants/dimensions';
import CalendarHeader, { ExportedCalendarHeaderProps } from './PickersCalendarHeader';
import YearPicker, { ExportedYearPickerProps } from '../YearPicker/YearPicker';
import { defaultMinDate, defaultMaxDate } from '../internal/pickers/constants/prop-types';
import { IsStaticVariantContext } from '../internal/pickers/wrappers/WrapperVariantContext';
import { DateValidationProps, findClosestEnabledDate } from '../internal/pickers/date-utils';
import { DatePickerView } from '../internal/pickers/typings/Views';

export interface DayPickerProps<TDate>
  extends DateValidationProps<TDate>,
    ExportedCalendarProps<TDate>,
    ExportedYearPickerProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  date: TDate;
  view: DatePickerView;
  views: DatePickerView[];
  changeView: (view: DatePickerView) => void;
  onChange: PickerOnChangeFn<TDate>;
  /**
   * Disable heavy animations.
   *
   * @default /(android)/i.test(window.navigator.userAgent).
   */
  reduceAnimations?: boolean;
  /**
   * Callback firing on month change. @DateIOType
   */
  onMonthChange?: (date: TDate) => void;
}

export type ExportedDayPickerProps<TDate> = Omit<
  DayPickerProps<TDate>,
  'date' | 'view' | 'views' | 'onChange' | 'changeView' | 'slideDirection' | 'currentMonth'
>;

export const styles = createStyles({
  viewTransitionContainer: {
    overflowY: 'auto',
  },
  fullHeightContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: (DAY_SIZE + DAY_MARGIN * 4) * 7,
    height: '100%',
  },
});

export const defaultReduceAnimations =
  typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent);

function DayPicker<TDate>(props: DayPickerProps<TDate> & WithStyles<typeof styles>) {
  const {
    allowKeyboardControl: allowKeyboardControlProp,
    changeView,
    date,
    disableFuture,
    disablePast,
    classes,
    loading,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onChange,
    onMonthChange,
    reduceAnimations = defaultReduceAnimations,
    renderLoading,
    shouldDisableDate,
    shouldDisableYear,
    view,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const isStatic = React.useContext(IsStaticVariantContext);
  const allowKeyboardControl = allowKeyboardControlProp ?? !isStatic;

  const minDate = minDateProp || utils.date(defaultMinDate)!;
  const maxDate = maxDateProp || utils.date(defaultMaxDate)!;

  const {
    calendarState,
    changeFocusedDay,
    changeMonth,
    isDateDisabled,
    handleChangeMonth,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState({
    date,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
  });

  React.useEffect(() => {
    if (date && isDateDisabled(date)) {
      const closestEnabledDate = findClosestEnabledDate<TDate>({
        utils,
        date,
        minDate,
        maxDate,
        disablePast: Boolean(disablePast),
        disableFuture: Boolean(disableFuture),
        shouldDisableDate: isDateDisabled,
      });

      onChange(closestEnabledDate, 'partial');
    }
    // This call is too expensive to run it on each prop change.
    // So just ensure that we are not rendering disabled as selected on mount.
  }, []); // eslint-disable-line

  React.useEffect(() => {
    changeMonth(date);
  }, [date]); // eslint-disable-line

  return (
    <React.Fragment>
      <CalendarHeader
        {...other}
        view={view}
        currentMonth={calendarState.currentMonth}
        changeView={changeView}
        onMonthChange={(newMonth, direction) => handleChangeMonth({ newMonth, direction })}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        reduceAnimations={reduceAnimations}
      />
      <FadeTransitionGroup
        reduceAnimations={reduceAnimations}
        className={classes.viewTransitionContainer}
        transKey={view}
      >
        <div>
          {view === 'year' && (
            <YearPicker
              {...other}
              date={date}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              disableFuture={disableFuture}
              disablePast={disablePast}
              isDateDisabled={isDateDisabled}
              allowKeyboardControl={allowKeyboardControl}
              shouldDisableYear={shouldDisableYear}
              changeFocusedDay={changeFocusedDay}
            />
          )}
          {view === 'month' && (
            <MonthPicker
              {...other}
              date={date}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              onMonthChange={onMonthChange}
            />
          )}
          {view === 'date' && (
            <Calendar
              {...other}
              {...calendarState}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              changeFocusedDay={changeFocusedDay}
              reduceAnimations={reduceAnimations}
              date={date}
              onChange={onChange}
              isDateDisabled={isDateDisabled}
              allowKeyboardControl={allowKeyboardControl}
              loading={loading}
              renderLoading={renderLoading}
            />
          )}
        </div>
      </FadeTransitionGroup>
    </React.Fragment>
  );
}

export default withStyles(styles, { name: 'MuiDayPicker' })(DayPicker) as <TDate>(
  props: DayPickerProps<TDate>,
) => JSX.Element;
