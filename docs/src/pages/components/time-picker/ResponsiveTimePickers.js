import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import DateFnsAdapter from '@material-ui/lab/dateAdapter/date-fns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import {
  TimePicker,
  MobileTimePicker,
  DesktopTimePicker,
} from '@material-ui/lab/TimePicker';

export default function ResponsiveTimePickers() {
  const [value, setValue] = React.useState(
    new Date('2018-01-01T00:00:00.000Z'),
  );

  return (
    <LocalizationProvider dateAdapter={DateFnsAdapter}>
      <div style={{ width: 300 }}>
        <MobileTimePicker
          label="For mobile"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />
        <DesktopTimePicker
          label="For desktop"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />
        <TimePicker
          value={value}
          onChange={setValue}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />
      </div>
    </LocalizationProvider>
  );
}
