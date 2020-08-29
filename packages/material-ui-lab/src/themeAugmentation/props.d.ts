import { AlertProps } from '../Alert';
import { AlertTitleProps } from '../AlertTitle';
import { AutocompleteProps } from '../Autocomplete';
import { AvatarGroupProps } from '../AvatarGroup';
import { PaginationProps } from '../Pagination';
import { PaginationItemProps } from '../PaginationItem';
import { RatingProps } from '../Rating';
import { SkeletonProps } from '../Skeleton';
import { SpeedDialProps } from '../SpeedDial';
import { SpeedDialActionProps } from '../SpeedDialAction';
import { SpeedDialIconProps } from '../SpeedDialIcon';
import { TabListProps } from '../TabList';
import { TabPanelProps } from '../TabPanel';
import { ToggleButtonProps } from '../ToggleButton';
import { ToggleButtonGroupProps } from '../ToggleButtonGroup';
import { TreeItemProps } from '../TreeItem';
import { TreeViewProps } from '../TreeView';
import { PickersDayProps } from '../PickersDay';
import { DayPickerProps } from '../DayPicker/DayPicker';
import { DatePickerProps } from '../DatePicker';
import { DesktopTimePickerProps } from '../TimePicker';
import { ClockPickerProps } from '../ClockPicker/ClockPicker';
import { MonthPickerProps } from '../MonthPicker/MonthPicker';
import { CalendarSkeletonProps } from '../PickersCalendarSkeleton';
import { YearPickerProps } from '../YearPicker/YearPicker';

export interface LabComponentsPropsList {
  MuiAlert: AlertProps;
  MuiAlertTitle: AlertTitleProps;
  MuiAutocomplete: AutocompleteProps<any, any, any, any>;
  MuiAvatarGroup: AvatarGroupProps;
  MuiClockPicker: ClockPickerProps;
  MuiDatePicker: DatePickerProps;
  MuiDatePicker: DatePickerProps;
  MuiDateTimePicker: DateTimePickerProps;
  MuiDayPicker: DayPickerProps;
  MuiDesktopDateTimePicker: DesktopDateTimePickerProps;
  MuiDesktopTimePicker: DesktopTimePickerProps;
  MuiMobileDatePicker: MobileDatePickerProps;
  MuiMobileDateTimePicker: MobileDateTimePickerProps;
  MuiMobileTimePicker: MobileTimePickerProps;
  MuiMonthPicker: MonthPickerProps;
  MuiPagination: PaginationProps;
  MuiPaginationItem: PaginationItemProps;
  MuiPickersCalendarSkeleton: CalendarSkeletonProps;
  MuiPickersDay: PickersDayProps;
  MuiPickersDay: PickersDayProps;
  MuiRating: RatingProps;
  MuiSkeleton: SkeletonProps;
  MuiSpeedDial: SpeedDialProps;
  MuiSpeedDialAction: SpeedDialActionProps;
  MuiSpeedDialIcon: SpeedDialIconProps;
  MuiStaticDatePicker: StaticDatePickerProps;
  MuiStaticDateTimePicker: StaticDateTimePickerProps;
  MuiStaticTimePicker: StaticTimePickerProps;
  MuiTabList: TabListProps;
  MuiTabPanel: TabPanelProps;
  MuiTimePicker: TimePickerProps;
  MuiToggleButton: ToggleButtonProps;
  MuiToggleButtonGroup: ToggleButtonGroupProps;
  MuiTreeItem: TreeItemProps;
  MuiTreeView: TreeViewProps;
  MuiYearPicker: YearPickerProps;
}

declare module '@material-ui/core/styles/props' {
  interface ComponentsPropsList extends LabComponentsPropsList {}
}

// disable automatic export
export {};
