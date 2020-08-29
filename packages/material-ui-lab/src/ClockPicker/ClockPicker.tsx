import * as React from 'react';
import * as PropTypes from 'prop-types';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Clock from './Clock';
import { pipe } from '../internal/pickers/utils';
import { useUtils, useNow, MuiPickersAdapter } from '../internal/pickers/hooks/useUtils';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import ArrowSwitcher, {
  ExportedArrowSwitcherProps,
} from '../internal/pickers/PickersArrowSwitcher';
import {
  convertValueToMeridiem,
  createIsAfterIgnoreDatePart,
  TimeValidationProps,
} from '../internal/pickers/time-utils';
import { PickerOnChangeFn } from '../internal/pickers/hooks/useViews';
import { PickerSelectionState } from '../internal/pickers/hooks/usePickerState';
import { useMeridiemMode } from '../internal/pickers/hooks/date-helpers-hooks';

export interface ExportedClockPickerProps<TDate> extends TimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   *
   * @default true
   */
  ampm?: boolean;
  /**
   * Step over minutes.
   *
   * @default 1
   */
  minutesStep?: number;
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   *
   * @default false
   */
  ampmInClock?: boolean;
  /**
   * Enables keyboard listener for moving between days in calendar.
   *
   * @default currentWrapper !== 'static'
   */
  allowKeyboardControl?: boolean;
  /**
   * Accessible text that helps user to understand which time and view is selected.
   * @default (view, time) => `Select ${view}. Selected time is ${format(time, 'fullTime')}`
   */
  getClockLabelText?: (
    view: 'hours' | 'minutes' | 'seconds',
    time: TDate,
    adapter: MuiPickersAdapter<TDate>,
  ) => string;
}

interface ClockPickerProps<TDate>
  extends ExportedClockPickerProps<TDate>,
    ExportedArrowSwitcherProps {
  /**
   * Selected date @DateIOType.
   */
  date: TDate | null;
  /**
   * Clock type.
   */
  type: 'hours' | 'minutes' | 'seconds';
  /**
   * On change date without moving between views @DateIOType.
   */
  onDateChange: PickerOnChangeFn<TDate>;
  /**
   * On change callback @DateIOType.
   */
  onChange: PickerOnChangeFn<TDate>;
  /**
   * Get clock number aria-text for hours.
   */
  getHoursClockNumberText?: (hoursText: string) => string;
  /**
   * Get clock number aria-text for minutes.
   */
  getMinutesClockNumberText?: (minutesText: string) => string;
  /**
   * Get clock number aria-text for seconds.
   */
  getSecondsClockNumberText?: (secondsText: string) => string;
  openNextView: () => void;
  openPreviousView: () => void;
  nextViewAvailable: boolean;
  previousViewAvailable: boolean;
  showViewSwitcher?: boolean;
}

export const styles = createStyles({
  arrowSwitcher: {
    position: 'absolute',
    right: 12,
    top: 15,
  },
});

const getDefaultClockLabelText = <TDate extends any>(
  view: 'hours' | 'minutes' | 'seconds',
  time: TDate,
  adapter: MuiPickersAdapter<TDate>,
) => `Select ${view}. Selected time is ${adapter.format(time, 'fullTime')}`;

const getMinutesAriaText = (minute: string) => `${minute} minutes`;

const getHoursAriaText = (hour: string) => `${hour} hours`;

const getSecondsAriaText = (seconds: string) => `${seconds} seconds`;

function ClockPicker<TDate>(props: ClockPickerProps<TDate> & WithStyles<typeof styles>) {
  const {
    allowKeyboardControl,
    ampm,
    ampmInClock,
    classes,
    date,
    disableIgnoringDatePartForTimeValidation,
    getClockLabelText = getDefaultClockLabelText,
    getHoursClockNumberText = getHoursAriaText,
    getMinutesClockNumberText = getMinutesAriaText,
    getSecondsClockNumberText = getSecondsAriaText,
    leftArrowButtonProps,
    leftArrowButtonText = 'open previous view',
    leftArrowIcon,
    maxTime,
    minTime,
    minutesStep = 1,
    nextViewAvailable,
    onChange,
    onDateChange,
    openNextView,
    openPreviousView,
    previousViewAvailable,
    rightArrowButtonProps,
    rightArrowButtonText = 'open next view',
    rightArrowIcon,
    shouldDisableTime,
    showViewSwitcher,
    type,
  } = props;

  const now = useNow<TDate>();
  const utils = useUtils<TDate>();
  const dateOrNow = date || now;

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    dateOrNow,
    ampm,
    onDateChange,
  );

  const isTimeDisabled = React.useCallback(
    (rawValue: number, viewType: 'hours' | 'minutes' | 'seconds') => {
      if (date === null) {
        return false;
      }

      const validateTimeValue = (getRequestedTimePoint: (when: 'start' | 'end') => TDate) => {
        const isAfterComparingFn = createIsAfterIgnoreDatePart(
          Boolean(disableIgnoringDatePartForTimeValidation),
          utils,
        );

        return Boolean(
          (minTime && isAfterComparingFn(minTime, getRequestedTimePoint('end'))) ||
            (maxTime && isAfterComparingFn(getRequestedTimePoint('start'), maxTime)) ||
            (shouldDisableTime && shouldDisableTime(rawValue, viewType)),
        );
      };

      switch (viewType) {
        case 'hours': {
          const hoursWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, Boolean(ampm));
          return validateTimeValue((when: 'start' | 'end') =>
            pipe(
              (currentDate) => utils.setHours(currentDate, hoursWithMeridiem),
              (dateWithHours) => utils.setMinutes(dateWithHours, when === 'start' ? 0 : 59),
              (dateWithMinutes) => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59),
            )(date),
          );
        }

        case 'minutes':
          return validateTimeValue((when: 'start' | 'end') =>
            pipe(
              (currentDate) => utils.setMinutes(currentDate, rawValue),
              (dateWithMinutes) => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59),
            )(date),
          );

        case 'seconds':
          return validateTimeValue(() => utils.setSeconds(date, rawValue));

        default:
          throw new Error('not supported');
      }
    },
    [
      ampm,
      date,
      disableIgnoringDatePartForTimeValidation,
      maxTime,
      meridiemMode,
      minTime,
      shouldDisableTime,
      utils,
    ],
  );

  const viewProps = React.useMemo(() => {
    switch (type) {
      case 'hours': {
        const handleHoursChange = (value: number, isFinish?: PickerSelectionState) => {
          const valueWithMeridiem = convertValueToMeridiem(value, meridiemMode, Boolean(ampm));
          onChange(utils.setHours(dateOrNow, valueWithMeridiem), isFinish);
        };

        return {
          onChange: handleHoursChange,
          value: utils.getHours(dateOrNow),
          children: getHourNumbers({
            date,
            utils,
            ampm: Boolean(ampm),
            onChange: handleHoursChange,
            getClockNumberText: getHoursClockNumberText,
            isDisabled: (value) => isTimeDisabled(value, 'hours'),
          }),
        };
      }

      case 'minutes': {
        const minutesValue = utils.getMinutes(dateOrNow);
        const handleMinutesChange = (value: number, isFinish?: PickerSelectionState) => {
          onChange(utils.setMinutes(dateOrNow, value), isFinish);
        };

        return {
          value: minutesValue,
          onChange: handleMinutesChange,
          children: getMinutesNumbers({
            utils,
            value: minutesValue,
            onChange: handleMinutesChange,
            getClockNumberText: getMinutesClockNumberText,
            isDisabled: (value) => isTimeDisabled(value, 'minutes'),
          }),
        };
      }

      case 'seconds': {
        const secondsValue = utils.getSeconds(dateOrNow);
        const handleSecondsChange = (value: number, isFinish?: PickerSelectionState) => {
          onChange(utils.setSeconds(dateOrNow, value), isFinish);
        };

        return {
          value: secondsValue,
          onChange: handleSecondsChange,
          children: getMinutesNumbers({
            utils,
            value: secondsValue,
            onChange: handleSecondsChange,
            getClockNumberText: getSecondsClockNumberText,
            isDisabled: (value) => isTimeDisabled(value, 'seconds'),
          }),
        };
      }

      default:
        throw new Error('You must provide the type for ClockView');
    }
  }, [
    type,
    utils,
    date,
    ampm,
    getHoursClockNumberText,
    getMinutesClockNumberText,
    getSecondsClockNumberText,
    meridiemMode,
    onChange,
    dateOrNow,
    isTimeDisabled,
  ]);

  return (
    <React.Fragment>
      {showViewSwitcher && (
        <ArrowSwitcher
          className={classes.arrowSwitcher}
          leftArrowButtonProps={leftArrowButtonProps}
          rightArrowButtonProps={rightArrowButtonProps}
          leftArrowButtonText={leftArrowButtonText}
          rightArrowButtonText={rightArrowButtonText}
          leftArrowIcon={leftArrowIcon}
          rightArrowIcon={rightArrowIcon}
          onLeftClick={openPreviousView}
          onRightClick={openNextView}
          isLeftDisabled={previousViewAvailable}
          isRightDisabled={nextViewAvailable}
        />
      )}

      <Clock<TDate>
        date={date}
        ampmInClock={ampmInClock}
        onDateChange={onDateChange}
        type={type}
        ampm={ampm}
        // @ts-expect-error TODO figure out this weird error
        getClockLabelText={getClockLabelText}
        minutesStep={minutesStep}
        allowKeyboardControl={allowKeyboardControl}
        isTimeDisabled={isTimeDisabled}
        meridiemMode={meridiemMode}
        handleMeridiemChange={handleMeridiemChange}
        {...viewProps}
      />
    </React.Fragment>
  );
}

ClockPicker.propTypes = {
  ampm: PropTypes.bool,
  date: PropTypes.object,
  minutesStep: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['minutes', 'hours', 'seconds']).isRequired,
} as any;

ClockPicker.displayName = 'ClockView';

export default withStyles(styles, { name: 'MuiPickersClockView' })(ClockPicker) as <TDate>(
  props: ClockPickerProps<TDate>,
) => JSX.Element;
