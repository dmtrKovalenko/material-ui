// eslint-disable-next-line no-restricted-imports
import { StyleRules, StyleRulesCallback } from '@material-ui/core/styles/withStyles';
import { styles as DayStyles } from '../../../PickersDay/PickersDay';
import { styles as ClockStyles } from '../../../ClockPicker/Clock';
import { styles as MuiBasePickerStyles } from '../Picker/Picker';
import { styles as CalendarStyles } from '../../../DayPicker/Calendar';
import { styles as MuiPickersYearStyles } from '../../../YearPicker/PickersYear';
import { styles as ClockPointerStyles } from '../../../ClockPicker/ClockPointer';
import { styles as ToolbarButtonStyles } from '../ToolbarButton';
import { styles as PickerToolbarStyles } from '../PickerToolbar';
import { styles as ClockNumberStyles } from '../../../ClockPicker/ClockNumber';
import { styles as MuiPickersMonthStyles } from '../../../MonthPicker/PickersMonth';
import { styles as CalendarViewStyles } from '../../../DayPicker/DayPicker';
import { styles as MuiPickersToolbarTextStyles } from '../ToolbarText';
import { styles as DatePickerRootStyles } from '../../../DatePicker/DatePickerToolbar';
import { styles as CalendarHeaderStyles } from '../../../DayPicker/CalendarHeader';
import { styles as TimePickerToolbarStyles } from '../../../TimePicker/TimePickerToolbar';
import { styles as SlideTransitionStyles } from '../../../DayPicker/SlideTransition';
import { styles as MuiPickersYearSelectionStyles } from '../../../YearPicker/YearPicker';
import { styles as MuiPickersMonthSelectionStyles } from '../../../MonthPicker/MonthPicker';

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
  MuiPickersModalDialog: Classes<typeof import('../PickersModalDialog').styles>;
  MuiDateTimePickerTabs: Classes<
    typeof import('../../../DateTimePicker/DateTimePickerTabs').styles
  >;
  MuiDateTimePickerToolbar: Classes<
    typeof import('../../../DateTimePicker/DateTimePickerToolbar').styles
  >;
  MuiPickersArrowSwitcher: Classes<typeof import('../PickersArrowSwitcher').styles>;
  MuiPickersCalendarSkeleton: Classes<
    typeof import('../../../CalendarSkeleton/CalendarSkeleton').styles
  >;
  MuiPickersPopper: Classes<typeof import('../PickersPopper').styles>;
}
