import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen } from 'test/utils';
import { TimePickerProps } from '@material-ui/lab/TimePicker';
import MobileTimePicker from '@material-ui/lab/MobileTimePicker';
import DesktopTimePicker from '@material-ui/lab/DesktopTimePicker';
import { createPickerRender, adapterToUse, getByMuiTest } from '../internal/pickers/test-utils';

export function fireTouchChangedEvent(
  target: Element,
  type: 'touchmove' | 'touchend',
  { changedTouches }: { changedTouches: Array<Pick<TouchInit, 'clientX' | 'clientY'>> },
) {
  const originalGetBoundingClientRect = target.getBoundingClientRect;
  target.getBoundingClientRect = () =>
    ({ x: 0, y: 0, bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 } as any);

  const event = new window.TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    changedTouches: changedTouches.map(
      (opts) =>
        new window.Touch({
          target,
          identifier: 0,
          ...opts,
        }),
    ),
  });

  fireEvent(target, event);
  target.getBoundingClientRect = originalGetBoundingClientRect;
}

describe('<TimePicker />', () => {
  const render = createPickerRender({ strict: false });

  function createMouseEventWithOffsets(
    type: 'mousedown' | 'mousemove' | 'mouseup',
    { offsetX, offsetY, ...eventOptions }: { offsetX: number; offsetY: number } & MouseEventInit,
  ) {
    const event = new window.MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      ...eventOptions,
    });

    Object.defineProperty(event, 'offsetX', { get: () => offsetX });
    Object.defineProperty(event, 'offsetY', { get: () => offsetY });

    return event;
  }


  it('accepts time on clock mouse move', () => {
    const onChangeMock = spy();
    render(
      <MobileTimePicker
        ampm
        open
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={onChangeMock}
        renderInput={(props) => <TextField variant="outlined" {...props} />}
      />,
    );

    const fakeEventOptions = {
      buttons: 1,
      offsetX: 20,
      offsetY: 15,
    };

    fireEvent(getByMuiTest('clock'), createMouseEventWithOffsets('mousemove', fakeEventOptions));
    fireEvent(getByMuiTest('clock'), createMouseEventWithOffsets('mouseup', fakeEventOptions));

    expect(getByMuiTest('hours')).to.have.text('11');
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('accepts time on clock touch move', () => {
    const onChangeMock = spy();
    render(
      <MobileTimePicker
        ampm
        open
        openTo="minutes"
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={onChangeMock}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', {
      changedTouches: [{ clientX: 20, clientY: 15 }],
    });
    expect(getByMuiTest('minutes')).to.have.text('53');
  });

  it('allows to navigate between timepicker views using arrow switcher', () => {
    render(
      <DesktopTimePicker
        open
        views={['hours', 'minutes', 'seconds']}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={() => {}}
        renderInput={(props) => <TextField {...props} />}
      />,
    );

    const prevViewButton = screen.getByLabelText('open previous view');
    const nextViewButton = screen.getByLabelText('open next view');

    expect(screen.getByLabelText(/Select Hours/i)).toBeVisible();
    expect(prevViewButton).to.have.attribute('disabled');

    fireEvent.click(nextViewButton);
    expect(screen.getByLabelText(/Select minutes/)).toBeVisible();

    expect(prevViewButton).not.to.have.attribute('disabled');
    expect(nextViewButton).not.to.have.attribute('disabled');

    fireEvent.click(nextViewButton);
    expect(screen.getByLabelText(/Select seconds/)).toBeVisible();
    expect(nextViewButton).to.have.attribute('disabled');
  });

  it('allows to select full date from empty', () => {
    function TimePickerWithState() {
      const [time, setTime] = React.useState(null);

      return (
        <MobileTimePicker
          open
          value={time}
          onChange={(newTime) => setTime(newTime)}
          renderInput={(props) => <TextField {...props} />}
        />
      );
    }

    render(<TimePickerWithState />);

    expect(getByMuiTest('hours')).to.have.text('--');
    expect(getByMuiTest('minutes')).to.have.text('--');

    fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove',  {
      changedTouches: [
        {
          clientX: 20,
          clientY: 15,
        },
      ],
    });

    expect(getByMuiTest('hours')).not.to.have.text('--');
    expect(getByMuiTest('minutes')).not.to.have.text('--');
  });

  context('Time validation', () => {
    const clockMouseEvent = {
      '13:--': {
        changedTouches: [
          {
            clientX: 166,
            clientY: 76,
          },
        ],
      },
      '20:--': {
        changedTouches: [
          {
            clientX: 66,
            clientY: 157,
          },
        ],
      },
      '--:10': {
        changedTouches: [
          {
            clientX: 220,
            clientY: 72,
          },
        ],
      },
      '--:20': {
        changedTouches: [
          {
            clientX: 222,
            clientY: 180,
          },
        ],
      },
    };

    beforeEach(() => {
      render(
        <MobileTimePicker
          renderInput={(props) => <TextField {...props} />}
          open
          ampm={false}
          onChange={() => {}}
          views={['hours', 'minutes', 'seconds']}
          value={adapterToUse.date('2018-01-01T00:00:00.000')}
          minTime={new Date(0, 0, 0, 12, 15, 15)}
          maxTime={new Date(0, 0, 0, 15, 45, 30)}
        />,
      );
    });

    it('should select enabled hour', () => {
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['13:--']);
      expect(getByMuiTest('hours')).to.have.text('13');
    });

    it('should select enabled minute', () => {
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['13:--']);
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchend', clockMouseEvent['13:--']);

      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['--:20']);

      expect(getByMuiTest('minutes')).to.have.text('20');
    });

    it('should not select minute when hour is disabled ', () => {
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['20:--']);
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchend', clockMouseEvent['20:--']);

      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['--:20']);
    });

    it('should not select disabled hour', () => {
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['20:--']);
      expect(getByMuiTest('hours')).to.have.text('00');
    });

    it('should not select disabled second', () => {
      fireEvent.click(getByMuiTest('seconds'));
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['--:20']);

      expect(getByMuiTest('seconds')).to.have.text('00');
    });

    it('should select enabled second', () => {
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['13:--']);
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchend', clockMouseEvent['13:--']);

      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['--:20']);
      fireTouchChangedEvent(getByMuiTest('clock'), 'touchend', clockMouseEvent['--:20']);

      fireTouchChangedEvent(getByMuiTest('clock'), 'touchmove', clockMouseEvent['--:10']);

      expect(getByMuiTest('seconds')).to.have.text('10');
    });
  });

  context('input validation', () => {
    const createTime = (time: string) => new Date(`01/01/2000 ${time}`);
    const shouldDisableTime: TimePickerProps['shouldDisableTime'] = (value) => value === 10;

    [
      { expectedError: 'invalidDate', props: {}, input: 'invalidText' },
      { expectedError: 'minTime', props: { minTime: createTime('08:00') }, input: '03:00' },
      { expectedError: 'maxTime', props: { maxTime: createTime('08:00') }, input: '12:00' },
      { expectedError: 'shouldDisableTime-hours', props: { shouldDisableTime }, input: '10:00' },
      { expectedError: 'shouldDisableTime-minutes', props: { shouldDisableTime }, input: '00:10' },
    ].forEach(({ props, input, expectedError }) => {
      it(`should dispatch "${expectedError}" error`, () => {
        const onErrorMock = spy();

        // we are running validation on value change
        function TimePickerInput() {
          const [time, setTime] = React.useState(null);

          return (
            <DesktopTimePicker
              ampm={false}
              value={time}
              onError={onErrorMock}
              onChange={(newTime) => setTime(newTime)}
              renderInput={(inputProps) => <TextField {...inputProps} />}
              {...props}
            />
          );
        }

        render(<TimePickerInput />);

        fireEvent.change(screen.getByRole('textbox'), {
          target: {
            value: input,
          },
        });

        expect(onErrorMock.calledWith(expectedError)).to.be.equal(true);
      });
    });
  });
});
