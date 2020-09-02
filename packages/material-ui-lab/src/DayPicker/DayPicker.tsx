import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MonthPicker from '../MonthPicker/MonthPicker';
import { useCalendarState } from './useCalendarState';
import { useUtils } from '../internal/pickers/hooks/useUtils';
import FadeTransitionGroup from './PickersFadeTransitionGroup';
import Calendar, { ExportedCalendarProps } from './PickersCalendar';
import { PickerOnChangeFn, useViews } from '../internal/pickers/hooks/useViews';
import { DAY_SIZE, DAY_MARGIN } from '../internal/pickers/constants/dimensions';
import CalendarHeader, { ExportedCalendarHeaderProps } from './PickersCalendarHeader';
import YearPicker, { ExportedYearPickerProps } from '../YearPicker/YearPicker';
import { defaultMinDate, defaultMaxDate } from '../internal/pickers/constants/prop-types';
import { IsStaticVariantContext } from '../internal/pickers/wrappers/WrapperVariantContext';
import { DateValidationProps, findClosestEnabledDate } from '../internal/pickers/date-utils';
import { DatePickerView } from '../internal/pickers/typings/Views';
import PickerView from '../internal/pickers/Picker/PickerView';

export interface DayPickerProps<TDate, TView extends DatePickerView = DatePickerView>
  extends DateValidationProps<TDate>,
    ExportedCalendarProps<TDate>,
    ExportedYearPickerProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  date: TDate;
  /** Views for day picker. */
  views?: TView[];
  /** Controlled open view. */
  view?: TView;
  /** Initially open view. */
  openTo?: TView;
  /** Callback fired on view change. */
  onViewChange?: (view: TView) => void;
  /** Callback fired on date change */
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
  className?: string;
}

export type ExportedDayPickerProps<TDate> = Omit<
  DayPickerProps<TDate>,
  | 'date'
  | 'view'
  | 'views'
  | 'openTo'
  | 'onChange'
  | 'changeView'
  | 'slideDirection'
  | 'currentMonth'
  | 'className'
>;

export const styles = createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
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

const DayPicker = React.forwardRef(function DayPicker<
  TDate extends any,
  TView extends DatePickerView = DatePickerView
>(props: DayPickerProps<TDate, TView> & WithStyles<typeof styles>, ref: React.Ref<HTMLDivElement>) {
  const {
    allowKeyboardControl: allowKeyboardControlProp,
    onViewChange,
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
    views = ['year', 'date'] as TView[],
    openTo = 'date' as TView,
    className,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const isStatic = React.useContext(IsStaticVariantContext);
  const allowKeyboardControl = allowKeyboardControlProp ?? !isStatic;

  const minDate = minDateProp || utils.date(defaultMinDate)!;
  const maxDate = maxDateProp || utils.date(defaultMaxDate)!;

  const { openView, setOpenView } = useViews({
    view,
    views,
    openTo,
    onChange,
    onViewChange,
  });

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
    <PickerView ref={ref} className={clsx(classes.root, className)}>
      <CalendarHeader
        {...other}
        views={views}
        openView={openView}
        currentMonth={calendarState.currentMonth}
        onViewChange={setOpenView as (view: DatePickerView) => void}
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
        transKey={openView}
      >
        <div>
          {openView === 'year' && (
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
              onFocusedDayChange={changeFocusedDay}
            />
          )}
          {openView === 'month' && (
            <MonthPicker
              {...other}
              date={date}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              onMonthChange={onMonthChange}
            />
          )}
          {openView === 'date' && (
            <Calendar
              {...other}
              {...calendarState}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={changeFocusedDay}
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
    </PickerView>
  );
});

export default withStyles(styles, { name: 'MuiDayPicker' })(DayPicker) as <TDate>(
  props: DayPickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element;
