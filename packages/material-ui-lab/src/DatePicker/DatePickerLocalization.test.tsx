import * as React from 'react';
import { expect } from 'chai';
import 'dayjs/locale/de';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import TextField from '@material-ui/core/TextField';
import { fireEvent, screen } from 'test/utils';
import {
  adapterToUse,
  getByMuiTest,
  createPickerRender,
} from '../internal/pickers/test-utils';
import { DatePickerProps, MobileDatePicker, DesktopDatePicker } from './DatePicker';

describe('<DatePicker /> localization', () => {
  const render = createPickerRender({ strict: false, locale: 'fr' });

  it('DatePicker localized format for year view', () => {
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={() => {}}
        views={['year']}
      />,
    );

    expect(screen.getByRole('textbox')).to.have.value('2018');

    fireEvent.click(screen.getByLabelText(/Choose date/));
    expect(getByMuiTest('datepicker-toolbar-date').textContent).to.equal('2018');
  });

  it('DatePicker localized format for year+month view', () => {
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={() => {}}
        views={['year', 'month']}
      />,
    );

    expect(screen.getByRole('textbox')).to.have.value('janvier 2018');

    fireEvent.click(screen.getByLabelText(/Choose date/));
    expect(getByMuiTest('datepicker-toolbar-date').textContent).to.equal('janvier');
  });

  it('DatePicker localized format for year+month+date view', () => {
    render(
      <MobileDatePicker
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        views={['year', 'month', 'date']}
      />,
    );

    expect(screen.getByRole('textbox')).to.have.value('01/01/2018');

    fireEvent.click(screen.getByLabelText(/Choose date/));
    expect(getByMuiTest('datepicker-toolbar-date').textContent).to.equal('1 janvier');
  });

  describe('input validation', () => {
    interface FormProps {
      Picker: React.ElementType<DatePickerProps>;
      PickerProps: Partial<DatePickerProps>;
    }

    const Form = (props: FormProps) => {
      const { Picker, PickerProps } = props;
      const [value, setValue] = React.useState<unknown>(new Date('01/01/2020'));

      return (
        <Picker
          onChange={setValue}
          renderInput={(props) => <TextField {...props} />}
          value={value}
          {...PickerProps}
        />
      );
    };

    const tests = [
      {
        locale: 'en-US',
        valid: 'January 2020',
        invalid: 'Januar 2020',
        dateFnsLocale: enLocale,
      },
      {
        locale: 'de',
        valid: 'Januar 2020',
        invalid: 'Janua 2020',
        dateFnsLocale: deLocale,
      },
    ];

    tests.forEach(({ valid, invalid, locale }) => {
      const render = createPickerRender({ strict: false, locale });

      it(`${locale}: should set invalid`, () => {
        render(<Form Picker={DesktopDatePicker} PickerProps={{ views: ['month', 'year'] }} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: invalid } });

        expect(input).to.have.attribute('aria-invalid', 'true');
      });


      it(`${locale}: should set to valid when was invalid`, () => {
        render(<Form Picker={DesktopDatePicker} PickerProps={{ views: ['month', 'year'] }} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: invalid } });
        fireEvent.change(input, { target: { value: valid } });

        expect(input).to.have.attribute('aria-invalid', 'false');
      });
    });
  });
});
