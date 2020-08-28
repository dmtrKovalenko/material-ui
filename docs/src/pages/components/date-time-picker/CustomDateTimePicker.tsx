import * as React from 'react';
import AlarmIcon from '@material-ui/icons/Alarm';
import SnoozeIcon from '@material-ui/icons/Snooze';
import TextField from '@material-ui/core/TextField';
import ClockIcon from '@material-ui/icons/AccessTime';
import DateFnsAdapter from '@material-ui/lab/dateAdapter/date-fns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import {
  DateTimePicker,
  MobileDateTimePicker,
} from '@material-ui/lab/DateTimePicker';

export default function CustomDateTimePicker() {
  const [clearedDate, setClearedDate] = React.useState<Date | null>(null);
  const [value, setValue] = React.useState<Date | null>(
    new Date('2019-01-01T18:54'),
  );

  return (
    <LocalizationProvider dateAdapter={DateFnsAdapter}>
      <div style={{ width: 300 }}>
        <DateTimePicker
          disableFuture
          hideTabs
          showTodayButton
          todayText="now"
          openTo="hours"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          minDate={new Date('2018-01-01')}
          leftArrowIcon={<AlarmIcon />}
          rightArrowIcon={<SnoozeIcon />}
          leftArrowButtonText="Open previous month"
          rightArrowButtonText="Open next month"
          openPickerIcon={<ClockIcon />}
          minTime={new Date(0, 0, 0, 9)}
          maxTime={new Date(0, 0, 0, 20)}
          renderInput={(props) => (
            <TextField
              {...props}
              margin="normal"
              variant="outlined"
              helperText="Hardcoded helper text"
            />
          )}
        />
        <MobileDateTimePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          label="With error handler"
          onError={console.log}
          minDate={new Date('2018-01-01T00:00')}
          inputFormat="yyyy/MM/dd hh:mm a"
          mask="___/__/__ __:__ _M"
          renderInput={(props) => (
            <TextField variant="outlined" {...props} margin="normal" />
          )}
        />
        <DateTimePicker
          clearable
          value={clearedDate}
          onChange={(newValue) => setClearedDate(newValue)}
          renderInput={(props) => (
            <TextField
              {...props}
              margin="normal"
              helperText="Clear Initial State"
            />
          )}
        />
      </div>
    </LocalizationProvider>
  );
}
