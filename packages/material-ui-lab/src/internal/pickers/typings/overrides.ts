// eslint-disable-next-line no-restricted-imports
import { StyleRules, StyleRulesCallback } from '@material-ui/core/styles/withStyles';
import { useStyles as DayStyles } from '../../../PickersDay/PickersDay';
import { useStyles as ClockStyles } from '../../../ClockPicker/Clock';
import { useStyles as MuiBasePickerStyles } from '../Picker/Picker';
import { useStyles as CalendarStyles } from '../../../DayPicker/Calendar';
import { useStyles as MuiPickersYearStyles } from '../../../YearPicker/Year';
import { styles as ClockPointerStyles } from '../../../ClockPicker/ClockPointer';
import { useStyles as ToolbarButtonStyles } from '../ToolbarButton';
import { useStyles as PickerToolbarStyles } from '../PickerToolbar';
import { useStyles as ClockNumberStyles } from '../../../ClockPicker/ClockNumber';
import { useStyles as MuiPickersMonthStyles } from '../../../MonthPicker/Month';
import { useStyles as CalendarViewStyles } from '../../../DayPicker/DayPicker';
import { useStyles as MuiPickersToolbarTextStyles } from '../ToolbarText';
import { useStyles as DatePickerRootStyles } from '../../../DatePicker/DatePickerToolbar';
import { useStyles as CalendarHeaderStyles } from '../../../DayPicker/CalendarHeader';
import { useStyles as TimePickerToolbarStyles } from '../../../TimePicker/TimePickerToolbar';
import { useStyles as SlideTransitionStyles } from '../../../DayPicker/SlideTransition';
import { useStyles as MuiPickersYearSelectionStyles } from '../../../YearPicker/YearPicker';
import { useStyles as MuiPickersMonthSelectionStyles } from '../../../MonthPicker/MonthPicker';

type StylesHook<C extends string> = (props?: any) => Record<C, string>;

type Classes<T> = T extends string
  ? T
  : T extends StylesHook<infer C>
  ? C
  : T extends StyleRulesCallback<any, any, infer K>
  ? K
  : T extends StyleRules<infer D>
  ? D
  : never;

export interface MuiPickersComponentsToClassName {
  MuiPickersDay: Classes<typeof DayStyles>;
  MuiPickersCalendar: Classes<typeof CalendarStyles>;
  MuiPickersCalendarView: Classes<typeof CalendarViewStyles>;
  MuiPickersCalendarHeader: Classes<typeof CalendarHeaderStyles>;
  MuiPickersSlideTransition: Classes<typeof SlideTransitionStyles>;
  MuiPickersYearSelection: Classes<typeof MuiPickersYearSelectionStyles>;
  MuiPickersYear: Classes<typeof MuiPickersYearStyles>;
  MuiPickersMonthSelection: Classes<typeof MuiPickersMonthSelectionStyles>;
  MuiPickersMonth: Classes<typeof MuiPickersMonthStyles>;
  MuiPickersTimePickerToolbar: Classes<typeof TimePickerToolbarStyles>;
  MuiPickersClock: Classes<typeof ClockStyles>;
  MuiPickersClockNumber: Classes<typeof ClockNumberStyles>;
  MuiPickersClockPointer: Classes<typeof ClockPointerStyles>;
  MuiPickersToolbar: Classes<typeof PickerToolbarStyles>;
  MuiPickersToolbarButton: Classes<typeof ToolbarButtonStyles>;
  MuiPickersToolbarText: Classes<typeof MuiPickersToolbarTextStyles>;
  MuiPickersDatePickerRoot: Classes<typeof DatePickerRootStyles>;
  MuiPickersBasePicker: Classes<typeof MuiBasePickerStyles>;
  MuiPickersModalDialog: Classes<typeof import('../PickersModalDialog').useStyles>;
  MuiDateTimePickerTabs: Classes<typeof import('../../../DateTimePicker/DateTimePickerTabs').useStyles>;
  MuiDateTimePickerToolbar: Classes<
    typeof import('../../../DateTimePicker/DateTimePickerToolbar').useStyles
  >;
  MuiPickersArrowSwitcher: Classes<typeof import('../ArrowSwitcher').useStyles>;
  MuiPickersCalendarSkeleton: Classes<typeof import('../../../CalendarSkeleton/CalendarSkeleton').useStyles>;
  MuiPickersPopper: Classes<typeof import('../PickersPopper').useStyles>;
}
