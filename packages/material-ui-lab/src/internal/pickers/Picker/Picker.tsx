import * as React from 'react';
import clsx from 'clsx';
import { styled, createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { useViews } from '../hooks/useViews';
import ClockView from '../../../ClockPicker/ClockPicker';
import DayPicker from '../../../DayPicker/DayPicker';
import { KeyboardDateInput } from '../KeyboardDateInput';
import { useIsLandscape } from '../hooks/useIsLandscape';
import { DIALOG_WIDTH, VIEW_HEIGHT } from '../constants/dimensions';
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import { PickerSelectionState } from '../hooks/usePickerState';
import { BasePickerProps, CalendarAndClockProps } from '../typings/BasePicker';
import { WithViewsProps, SharedPickerProps } from './SharedPickerProps';
import { AllAvailableViews, DatePickerView } from '../typings/Views';

export interface ExportedPickerProps<TView extends AllAvailableViews>
  extends Omit<BasePickerProps, 'value' | 'onChange'>,
    CalendarAndClockProps<unknown>,
    WithViewsProps<TView> {
  dateRangeIcon?: React.ReactNode;
  timeIcon?: React.ReactNode;
}

export type PickerProps<
  TView extends AllAvailableViews,
  TInputValue = any,
  TDateValue = any
> = ExportedPickerProps<TView> & SharedPickerProps<TInputValue, TDateValue>;

const MobileKeyboardInputView = styled('div')(
  {
    padding: '16px 24px',
  },
  { name: 'MuiPickersMobileKeyboardInputView' },
);

export const styles = createStyles({
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
});

const MobileKeyboardTextFieldProps = { fullWidth: true };

const isDatePickerView = (view: AllAvailableViews) =>
  view === 'year' || view === 'month' || view === 'date';

function Picker({
  classes,
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
}: PickerProps<AllAvailableViews> & WithStyles<typeof styles>) {
  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const toShowToolbar =
    typeof showToolbar === 'undefined' ? wrapperVariant !== 'desktop' : showToolbar;

  const handleDateChange = React.useCallback(
    (newDate: unknown, selectionState?: PickerSelectionState) => {
      onDateChange(newDate, wrapperVariant, selectionState);
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
                onChange={handleChangeAndOpenNext}
                view={openView}
                views={views as DatePickerView[]}
                {...other}
              />
            )}

            {(openView === 'hours' || openView === 'minutes' || openView === 'seconds') && (
              <ClockView
                {...other}
                date={date}
                type={openView}
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

export default withStyles(styles, { name: 'MuiPicker' })(Picker);
