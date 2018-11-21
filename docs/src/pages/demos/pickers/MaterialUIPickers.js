import React, { PureComponent } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
  DateTimePicker,
} from 'material-ui-pickers';
import D from '@material-ui/core/Button'

export default class App extends PureComponent {
  state = {
    selectedDate: new Date(),
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  render() {
    const { selectedDate } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker value={selectedDate} onChange={this.handleDateChange} />
        <TimePicker value={selectedDate} onChange={this.handleDateChange} />
        <DateTimePicker value={selectedDate} onChange={this.handleDateChange} />
      </MuiPickersUtilsProvider>
    );
  }
}

