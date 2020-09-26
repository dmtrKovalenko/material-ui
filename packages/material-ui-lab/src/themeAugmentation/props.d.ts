import { AutocompleteProps } from '../Autocomplete';
import { AvatarGroupProps } from '../AvatarGroup';
import { PaginationProps } from '../Pagination';
import { PaginationItemProps } from '../PaginationItem';
import { SpeedDialProps } from '../SpeedDial';
import { SpeedDialActionProps } from '../SpeedDialAction';
import { SpeedDialIconProps } from '../SpeedDialIcon';
import { TabListProps } from '../TabList';
import { TabPanelProps } from '../TabPanel';
import { TimelineProps } from '../Timeline';
import { TimelineConnectorProps } from '../TimelineConnector';
import { TimelineContentProps } from '../TimelineContent';
import { TimelineDotProps } from '../TimelineDot';
import { TimelineItemProps } from '../TimelineItem';
import { TimelineOppositeContentProps } from '../TimelineOppositeContent';
import { TimelineSeparatorProps } from '../TimelineSeparator';
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
  MuiTimeline: TimelineProps;
  MuiTimelineConnector: TimelineConnectorProps;
  MuiTimelineContent: TimelineContentProps;
  MuiTimelineDot: TimelineDotProps;
  MuiTimelineItem: TimelineItemProps;
  MuiTimelineOppositeContent: TimelineOppositeContentProps;
  MuiTimelineSeparator: TimelineSeparatorProps;
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
