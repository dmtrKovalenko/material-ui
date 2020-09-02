import * as React from 'react';
import frLocale from 'date-fns/locale/fr';
import ruLocale from 'date-fns/locale/ru';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import DateFnsAdapter from '@material-ui/lab/dateAdapter/date-fns';
import DatePicker from '@material-ui/lab/DatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

const localeMap = {
  en: enLocale,
  fr: frLocale,
  ru: ruLocale,
  de: deLocale,
};

const maskMap = {
  fr: '__/__/____',
  en: '__/__/____',
  ru: '__.__.____',
  de: '__.__.____',
};

export default function LocalizedDatePicker() {
  const [locale, setLocale] = React.useState<keyof typeof maskMap>('ru');
  const [selectedDate, handleDateChange] = React.useState<Date | null>(
    new Date(),
  );

  const selectLocale = (newLocale: any) => {
    setLocale(newLocale);
  };

  return (
    <LocalizationProvider
      dateAdapter={DateFnsAdapter}
      locale={localeMap[locale]}
    >
      <div style={{ width: 300 }}>
        <DatePicker
          mask={maskMap[locale]}
          value={selectedDate}
          onChange={(date) => handleDateChange(date)}
          renderInput={(props) => <TextField {...props} margin="normal" />}
        />

        <ToggleButtonGroup value={locale} exclusive>
          {Object.keys(localeMap).map((localeItem) => (
            <ToggleButton
              key={localeItem}
              value={localeItem}
              onClick={() => selectLocale(localeItem)}
            >
              {localeItem}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </LocalizationProvider>
  );
}
