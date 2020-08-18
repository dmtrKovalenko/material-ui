import * as React from 'react';
import clsx from 'clsx';
import { styled, makeStyles } from '@material-ui/core/styles';
import { useViews } from '../hooks/useViews';
import { ClockView } from '../../../ClockPicker/ClockPicker';
import { DateTimePickerView } from '../../../DateTimePicker';
import { BasePickerProps } from '../typings/BasePicker';
import { DatePickerView } from '../../../DatePicker/DatePicker';
import { DayPicker } from '../../../DayPicker/DayPicker';
import { withDefaultProps } from '../withDefaultProps';
import { KeyboardDateInput } from '../KeyboardDateInput';
import { useIsLandscape } from '../hooks/useIsLandscape';
import { DIALOG_WIDTH, VIEW_HEIGHT } from '../constants/dimensions';
import { PickerSelectionState } from '../hooks/usePickerState';
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import {
  WithViewsProps,
  AnyPickerView,
  SharedPickerProps,
  CalendarAndClockProps,
} from './SharedPickerProps';

export interface ExportedPickerProps<TView extends AnyPickerView>
  extends Omit<BasePickerProps, 'value' | 'onChange'>,
    CalendarAndClockProps<unknown>,
    WithViewsProps<TView> {
  // TODO move out, cause it is DateTimePickerOnly
  hideTabs?: boolean;
  dateRangeIcon?: React.ReactNode;
  timeIcon?: React.ReactNode;
}

export type PickerProps<
  TView extends AnyPickerView,
  TInputValue = any,
  TDateValue = any
> = ExportedPickerProps<TView> & SharedPickerProps<TInputValue, TDateValue>;

const muiComponentConfig = { name: 'MuiPickersBasePicker' };

const MobileKeyboardInputView = styled('div')(
  {
    padding: '16px 24px',
  },
  { name: 'MuiPickersMobileKeyboardInputView' },
);

export const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    landscape: {
      flexDirection: 'row',
    },
    pickerView: {
      overflowX: 'hidden',
      width: DIALOG_WIDTH,
      maxHeight: VIEW_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
    },
    pickerViewLandscape: {
      padding: '0 8px',
    },
  },
  muiComponentConfig,
);

const MobileKeyboardTextFieldProps = { fullWidth: true };

const isDatePickerView = (view: DateTimePickerView) =>
  view === 'year' || view === 'month' || view === 'date';

function Picker({
  className,
  date,
  DateInputProps,
  isMobileKeyboardViewOpen,
  onDateChange,
  openTo = 'date',
  orientation,
  showToolbar,
  toggleMobileKeyboardView,
  ToolbarComponent = () => null,
  toolbarFormat,
  toolbarPlaceholder,
  toolbarTitle,
  views = ['year', 'month', 'date', 'hours', 'minutes', 'seconds'],
  ...other
}: PickerProps<AnyPickerView>) {
  const classes = useStyles();
  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const toShowToolbar =
    typeof showToolbar === 'undefined' ? wrapperVariant !== 'desktop' : showToolbar;

  const handleDateChange = React.useCallback(
    (date: unknown, selectionState?: PickerSelectionState) => {
      onDateChange(date, wrapperVariant, selectionState);
    },
    [onDateChange, wrapperVariant],
  );

  const { openView, nextView, previousView, setOpenView, handleChangeAndOpenNext } = useViews({
    views,
    openTo,
    onChange: handleDateChange,
    isMobileKeyboardViewOpen,
    toggleMobileKeyboardView,
  });

  return (
    <div
      className={clsx(classes.root, className, {
        [classes.landscape]: isLandscape,
      })}
    >
      {toShowToolbar && (
        <ToolbarComponent
          {...other}
          views={views}
          isLandscape={isLandscape}
          date={date}
          onChange={handleDateChange}
          setOpenView={setOpenView}
          openView={openView}
          toolbarTitle={toolbarTitle}
          toolbarFormat={toolbarFormat}
          toolbarPlaceholder={toolbarPlaceholder}
          isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
        />
      )}

      <div
        className={clsx(classes.pickerView, {
          [classes.pickerViewLandscape]: isLandscape,
        })}
      >
        {isMobileKeyboardViewOpen ? (
          <MobileKeyboardInputView>
            <KeyboardDateInput
              {...DateInputProps}
              ignoreInvalidInputs
              disableOpenPicker
              TextFieldProps={MobileKeyboardTextFieldProps}
            />
          </MobileKeyboardInputView>
        ) : (
          <React.Fragment>
            {(openView === 'year' || openView === 'month' || openView === 'date') && (
              <DayPicker
                date={date}
                changeView={setOpenView}
                // @ts-ignore
                views={views}
                onChange={handleChangeAndOpenNext}
                view={openView as DatePickerView}
                {...other}
              />
            )}

            {(openView === 'hours' || openView === 'minutes' || openView === 'seconds') && (
              <ClockView
                {...other}
                date={date}
                type={openView as 'hours' | 'minutes' | 'seconds'}
                onDateChange={handleDateChange}
                onChange={handleChangeAndOpenNext}
                openNextView={() => setOpenView(nextView)}
                openPreviousView={() => setOpenView(previousView)}
                nextViewAvailable={!nextView}
                previousViewAvailable={!previousView || isDatePickerView(previousView)}
                showViewSwitcher={wrapperVariant === 'desktop'}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default withDefaultProps(muiComponentConfig, Picker);
