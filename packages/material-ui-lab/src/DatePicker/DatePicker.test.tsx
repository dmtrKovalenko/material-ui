import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import TextField from '@material-ui/core/TextField';
import { fireEvent, screen, waitFor } from 'test/utils';
import PickersDay from '@material-ui/lab/PickersDay';
import CalendarSkeleton from '@material-ui/lab/PickersCalendarSkeleton';
import DatePicker from '@material-ui/lab/DatePicker';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';
import StaticDatePicker from '@material-ui/lab/StaticDatePicker';
import {
  createPickerRender,
  FakeTransitionComponent,
  adapterToUse,
  getByMuiTest,
  getAllByMuiTest,
  queryAllByMuiTest,
  openDesktopPicker,
  openMobilePicker,
} from '../internal/pickers/test-utils';

describe('<DatePicker />', () => {
  const render = createPickerRender({ strict: false });

  it('Render proper month', () => {
    render(
      <StaticDatePicker
        value={adapterToUse.date('01-01-2019')}
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    expect(screen.getByText('January')).toBeVisible();
    expect(screen.getByText('2019')).toBeVisible();
    expect(getAllByMuiTest('day')).to.have.length(31);
  });

  it('Desktop Mode – Accepts date on day button click', () => {
    const onChangeMock = spy();

    render(
      <DesktopDatePicker
        value={adapterToUse.date('01-01-2019')}
        onChange={onChangeMock}
        TransitionComponent={FakeTransitionComponent}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    openDesktopPicker();

    fireEvent.click(screen.getByLabelText('Jan 2, 2019'));
    expect(onChangeMock.callCount).to.equal(1);

    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('Mobile mode – Accepts date on `OK` button click', () => {
    const onChangeMock = spy();
    render(
      <MobileDatePicker
        value={adapterToUse.date('01-01-2019')}
        onChange={onChangeMock}
        DialogProps={{ TransitionComponent: FakeTransitionComponent }}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    openMobilePicker();

    fireEvent.click(screen.getByLabelText('Jan 2, 2019'));
    expect(onChangeMock.callCount).to.equal(1);
    expect(screen.queryByRole('dialog')).not.to.equal(null);

    fireEvent.click(screen.getByText(/ok/i));
    // TODO revisit calling onChange twice. Now it is expected for mobile mode.
    expect(onChangeMock.callCount).to.equal(2);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('Switches between months', () => {
    render(
      <StaticDatePicker
        reduceAnimations
        value={adapterToUse.date('01-01-2019')}
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    expect(getByMuiTest('calendar-month-text')).to.have.text('January');

    fireEvent.click(screen.getByLabelText('next month'));
    fireEvent.click(screen.getByLabelText('next month'));

    fireEvent.click(screen.getByLabelText('previous month'));
    fireEvent.click(screen.getByLabelText('previous month'));
    fireEvent.click(screen.getByLabelText('previous month'));

    expect(getByMuiTest('calendar-month-text')).to.have.text('December');
  });

  it('Selects the closest enabled date if selected date is disabled', () => {
    const onChangeMock = spy();

    render(
      <MobileDatePicker
        open
        value={adapterToUse.date('01-01-2019')}
        onChange={onChangeMock}
        renderInput={(props) => <TextField {...props} />}
        maxDate={adapterToUse.date('01-01-2018')}
      />,
    );

    expect(getByMuiTest('calendar-year-text')).to.have.text('2018');
    expect(getByMuiTest('calendar-month-text')).to.have.text('January');

    // onChange must be dispatched with newly selected date
    expect(onChangeMock.calledWith(adapterToUse.date('01-01-2018'))).to.be.equal(true);
  });

  it('Allows to change only year', () => {
    const onChangeMock = spy();
    render(
      <MobileDatePicker
        open
        value={adapterToUse.date('01-01-2019')}
        onChange={onChangeMock}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    fireEvent.click(screen.getByLabelText(/switch to year view/i));
    fireEvent.click(screen.getByText('2010', { selector: 'button' }));

    expect(getByMuiTest('calendar-year-text')).to.have.text('2010');
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('Allows to select edge years from list', () => {
    render(
      <DatePicker
        open
        reduceAnimations
        value={null}
        onChange={() => {}}
        openTo="year"
        minDate={new Date('2000-01-01')}
        maxDate={new Date('2010-01-01')}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    fireEvent.click(screen.getByText('2010', { selector: 'button' }));
    expect(getByMuiTest('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
  });

  it("Doesn't close picker on selection in Mobile mode", () => {
    render(
      <MobileDatePicker
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    fireEvent.click(screen.getByRole('textbox'));
    fireEvent.click(screen.getByLabelText('Jan 2, 2018'));

    expect(screen.queryByRole('dialog')).toBeVisible();
  });

  it('Closes picker on selection in Desktop mode', async () => {
    render(
      <DesktopDatePicker
        TransitionComponent={FakeTransitionComponent}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    fireEvent.click(screen.getByLabelText('Choose date, selected date is Jan 1, 2018'));

    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByLabelText('Jan 2, 2018'));

    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('Prop `clearable` - renders clear button in Mobile mode', () => {
    const onChangeMock = spy();
    render(
      <MobileDatePicker
        clearable
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={onChangeMock}
        DialogProps={{ TransitionComponent: FakeTransitionComponent }}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    openMobilePicker();
    fireEvent.click(screen.getByText('Clear'));

    expect(onChangeMock.calledWith(null)).to.be.equal(true);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it("Prop `disableCloseOnSelect` – if `true` doesn't close picker", () => {
    render(
      <DesktopDatePicker
        TransitionComponent={FakeTransitionComponent}
        disableCloseOnSelect
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    openDesktopPicker();
    fireEvent.click(screen.getByLabelText('Jan 2, 2018'));

    expect(screen.queryByRole('dialog')).toBeVisible();
  });

  it('does not call onChange if same date selected', async () => {
    const onChangeMock = spy();

    render(
      <DesktopDatePicker
        TransitionComponent={FakeTransitionComponent}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={onChangeMock}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    fireEvent.click(screen.getByLabelText('Choose date, selected date is Jan 1, 2018'));
    await waitFor(() => screen.getByRole('dialog'));

    fireEvent.click(screen.getByLabelText('Jan 1, 2018'));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('Allows to change selected date from the input according to `format`', () => {
    const onChangeMock = spy();
    render(
      <DesktopDatePicker
        renderInput={(props) => <TextField placeholder="10/10/2018" {...props} />}
        label="Masked input"
        inputFormat="dd/MM/yyyy"
        value={new Date('2018-01-01T00:00:00.000Z')}
        onChange={onChangeMock}
        InputAdornmentProps={{
          disableTypography: true,
        }}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: {
        value: '10/11/2018',
      },
    });

    expect(screen.getByRole('textbox')).to.have.value('10/11/2018');
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('Prop `showToolbar` – renders toolbar in desktop mode', () => {
    render(
      <DesktopDatePicker
        open
        showToolbar
        onChange={() => {}}
        TransitionComponent={FakeTransitionComponent}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    expect(getByMuiTest('picker-toolbar')).toBeVisible();
  });

  it('Prop `toolbarTitle` – should render title from the prop', () => {
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        open
        toolbarTitle="test"
        label="something"
        onChange={() => {}}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
      />,
    );

    expect(getByMuiTest('picker-toolbar-title').textContent).to.equal('test');
  });

  it('Prop `toolbarTitle` – should use label if no toolbar title', () => {
    render(
      <MobileDatePicker
        open
        label="Default label"
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
      />,
    );

    expect(getByMuiTest('picker-toolbar-title').textContent).to.equal('Default label');
  });

  it('Prop `toolbarFormat` – should format toolbar according to passed format', () => {
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        open
        onChange={() => {}}
        toolbarFormat="MMMM"
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
      />,
    );

    expect(getByMuiTest('datepicker-toolbar-date').textContent).to.equal('January');
  });

  it('Prop `showTodayButton` – accept current date when "today" button is clicked', () => {
    const onCloseMock = spy();
    const onChangeMock = spy();
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        showTodayButton
        cancelText="stream"
        onClose={onCloseMock}
        onChange={onChangeMock}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        DialogProps={{ TransitionComponent: FakeTransitionComponent }}
      />,
    );

    fireEvent.click(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText(/today/i));

    expect(onCloseMock.callCount).to.equal(1);
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('ref - should forwardRef to text field', () => {
    const Component = () => {
      const ref = React.useRef<HTMLInputElement>(null);
      const focusPicker = () => {
        if (ref.current) {
          ref.current.focus();
          expect(ref.current.id).to.equal('test-focusing-picker');
        } else {
          throw new Error('Ref must be available');
        }
      };

      return (
        <React.Fragment>
          <DatePicker
            ref={ref}
            value={null}
            onChange={() => {}}
            renderInput={(props) => <TextField id="test-focusing-picker" {...props} />}
          />
          <button type="button" onClick={focusPicker}>
            test
          </button>
        </React.Fragment>
      );
    };

    render(<Component />);
    fireEvent.click(screen.getByText('test'));
  });

  it('Prop `shouldDisableYear` – disables years dynamically', () => {
    render(
      <StaticDatePicker
        renderInput={(props) => <TextField {...props} />}
        openTo="year"
        onChange={() => {}}
        // getByRole() with name attribute is too slow, so restrict the number of rendered years
        minDate={new Date('2025-01-01')}
        maxDate={new Date('2035-01-01')}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        shouldDisableYear={(year) => adapterToUse.getYear(year) === 2030}
      />,
    );

    const getYearButton = (year: number) =>
      screen.getByText(year.toString(), { selector: 'button' });

    expect(getYearButton(2029)).not.to.have.attribute('disabled');
    expect(getYearButton(2030)).to.have.attribute('disabled');
    expect(getYearButton(2031)).not.to.have.attribute('disabled');
  });

  it('Prop `onMonthChange` – dispatches callback when months switching', () => {
    const onMonthChangeMock = spy();
    render(
      <MobileDatePicker
        open
        renderInput={(props) => <TextField {...props} />}
        onChange={() => {}}
        onMonthChange={onMonthChangeMock}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
      />,
    );

    fireEvent.click(screen.getByLabelText('next month'));
    expect(onMonthChangeMock.callCount).to.equal(1);
  });

  it('Prop `loading` – displays default loading indicator', () => {
    render(
      <MobileDatePicker
        open
        loading
        renderInput={(props) => <TextField {...props} />}
        onChange={() => {}}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
      />,
    );

    expect(queryAllByMuiTest(document.body, 'day')).to.have.length(0);
    expect(getByMuiTest('loading-progress')).toBeVisible();
  });

  it('Prop `renderLoading` – displays custom loading indicator', () => {
    render(
      <MobileDatePicker
        loading
        renderLoading={() => <CalendarSkeleton data-testid="custom-loading" />}
        open
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
      />,
    );

    expect(screen.queryByTestId('loading-progress')).to.equal(null);
    expect(screen.getByTestId('custom-loading')).toBeVisible();
  });

  it('prop `ToolbarComponent` – render custom toolbar component', () => {
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        open
        value={new Date()}
        onChange={() => {}}
        ToolbarComponent={() => <div data-testid="custom-toolbar" />}
      />,
    );

    expect(screen.getByTestId('custom-toolbar')).toBeVisible();
  });

  it('prop `renderDay` – renders custom day', () => {
    render(
      <MobileDatePicker
        renderInput={(props) => <TextField {...props} />}
        open
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={() => {}}
        renderDay={(day, _selected, DayComponentProps) => (
          <PickersDay {...DayComponentProps} data-testid="test-day" />
        )}
      />,
    );

    expect(screen.getAllByTestId('test-day')).to.have.length(31);
  });
});