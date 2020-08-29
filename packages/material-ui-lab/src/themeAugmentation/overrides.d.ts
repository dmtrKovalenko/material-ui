import { StyleRules, StyleRulesCallback } from '@material-ui/core/styles';
import { AlertClassKey } from '../Alert';
import { AlertTitleClassKey } from '../AlertTitle';
import { AutocompleteClassKey } from '../Autocomplete';
import { AvatarGroupClassKey } from '../AvatarGroup';
import { PaginationClassKey } from '../Pagination';
import { PaginationItemClassKey } from '../PaginationItem';
import { RatingClassKey } from '../Rating';
import { SkeletonClassKey } from '../Skeleton';
import { SpeedDialClassKey } from '../SpeedDial';
import { SpeedDialActionClassKey } from '../SpeedDialAction';
import { SpeedDialIconClassKey } from '../SpeedDialIcon';
import { TabListClassKey } from '../TabList';
import { TabPanelClassKey } from '../TabPanel';
import { ToggleButtonClassKey } from '../ToggleButton';
import { ToggleButtonGroupClassKey } from '../ToggleButtonGroup';
import { TreeItemClassKey } from '../TreeItem';
import { TreeViewClassKey } from '../TreeView';

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

// prettier-ignore
export interface LabComponentNameToClassKey {
  MuiAlert: AlertClassKey;
  MuiAlertTitle: AlertTitleClassKey;
  MuiAutocomplete: AutocompleteClassKey;
  MuiAvatarGroup: AvatarGroupClassKey;
  MuiPagination: PaginationClassKey;
  MuiPaginationItem: PaginationItemClassKey;
  MuiRating: RatingClassKey;
  MuiSkeleton: SkeletonClassKey;
  MuiSpeedDial: SpeedDialClassKey;
  MuiSpeedDialAction: SpeedDialActionClassKey;
  MuiSpeedDialIcon: SpeedDialIconClassKey;
  MuiTabList: TabListClassKey;
  MuiTabPanel: TabPanelClassKey;
  MuiToggleButton: ToggleButtonClassKey;
  MuiToggleButtonGroup: ToggleButtonGroupClassKey;
  MuiTreeItem: TreeItemClassKey;
  MuiTreeView: TreeViewClassKey;
  // pickers sources
  MuiClock: Classes<typeof import('../ClockPicker/Clock').styles>;
  MuiClockNumber: Classes<typeof import('../ClockPicker/ClockNumber').styles>;
  MuiClockPointer: Classes<typeof import('../ClockPicker/ClockPointer').styles>;
  MuiDatePickerToolbar: Classes<typeof import('../DatePicker/DatePickerToolbar').styles>;
  MuiDateTimePickerTabs: Classes<typeof import('../DateTimePicker/DateTimePickerTabs').styles>;
  MuiDateTimePickerToolbar: Classes< typeof import('../DateTimePicker/DateTimePickerToolbar').styles>;
  MuiDayPicker: Classes<typeof import('../DayPicker/DayPicker').styles>;
  MuiMonthPicker: Classes<typeof import('../MonthPicker/MonthPicker').styles>;
  MuiPicker: Classes<typeof import('../internal/pickers/Picker/Picker').styles>;
  MuiPickersArrowSwitcher: Classes<typeof import('../PickersArrowSwitcher').styles>;
  MuiPickersCalendar: Classes<typeof import('../DayPicker/PickersCalendar').styles>;
  MuiPickersCalendarHeader: Classes<typeof import('../DayPicker/PickersCalendarHeader').styles>;
  MuiPickersCalendarSkeleton: Classes<typeof import('../PickersCalendarSkeleton/PickersCalendarSkeleton').styles>;
  MuiPickersDay: Classes<typeof import('../PickersDay/PickersDay').styles>;
  MuiPickersFadeTransition: Classes<typeof import('../DayPicker/PickersFadeTransitionGroup').styles>;
  MuiPickersModalDialog: Classes<typeof import('../internal/pickers/PickersModalDialog').styles>;
  MuiPickersMonth: Classes<typeof import('../MonthPicker/PickersMonth').styles>;
  MuiPickersPopper: Classes<typeof import('../internal/pickers/PickersPopper').styles>;
  MuiPickersSlideTransition: Classes<typeof import('../DayPicker/PickersSlideTransition').styles>;
  MuiPickersToolbar: Classes<typeof import('../internal/pickers/PickersToolbar').styles>;
  MuiPickersToolbarButton: Classes<typeof import('../internal/pickers/PickersToolbarButton').styles>;
  MuiPickersToolbarText: Classes<typeof import('../internal/pickers/PickersToolbarText').styles>;
  MuiPickersYear: Classes<typeof import('../YearPicker/PickersYear').styles>;
  MuiTimePickerToolbar: Classes<typeof import('../TimePicker/TimePickerToolbar').styles>;
  MuiYearPicker: Classes<typeof import('../YearPicker/YearPicker').styles>;
}

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends LabComponentNameToClassKey {}
}

// disable automatic export
export {};
