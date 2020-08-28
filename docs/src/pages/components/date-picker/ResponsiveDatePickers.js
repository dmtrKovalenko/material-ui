import React from 'react';
import TextField from '@material-ui/core/TextField';
import DateFnsAdapter from '@material-ui/lab/dateAdapter/date-fns';
import LocalizaitonProvider from '@material-ui/lab/LocalizationProvider';
import {
  MobileDatePicker,
  DesktopDatePicker,
  DatePicker,
} from '@material-ui/lab/DatePicker';

export default function DatePickersVariants() {
  const [value, setValue] = React.useState(new Date());

  return (
    <LocalizaitonProvider dateAdapter={DateFnsAdapter}>
      <div style={{ width: 300 }}>
        <MobileDatePicker
          label="For mobile"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />
        <DesktopDatePicker
          label="For desktop"
          value={value}
          minDate={new Date('2017-01-01')}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />
        <DatePicker
          disableFuture
          label="Responsive"
          openTo="year"
          views={['year', 'month', 'date']}
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />
      </div>
    </LocalizaitonProvider>
  );
}
