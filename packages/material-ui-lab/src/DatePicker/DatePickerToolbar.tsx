import * as React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import PickerToolbar from '../internal/pickers/PickersToolbar';
import { useUtils } from '../internal/pickers/hooks/useUtils';
import { isYearAndMonthViews, isYearOnlyView } from '../internal/pickers/date-utils';
import { DatePickerView } from '../internal/pickers/typings/Views';
import { ToolbarComponentProps } from '../internal/pickers/typings/BasePicker';

export const styles = createStyles({
  root: {},
  dateTitleLandscape: {
    margin: 'auto 16px auto auto',
  },
  penIcon: {
    position: 'relative',
    top: 4,
  },
});

const DatePickerToolbar: React.FC<ToolbarComponentProps & WithStyles<typeof styles>> = ({
  classes,
  date,
  isLandscape,
  isMobileKeyboardViewOpen,
  onChange,
  toggleMobileKeyboardView,
  toolbarFormat,
  toolbarPlaceholder = '––',
  toolbarTitle = 'SELECT DATE',
  views,
  ...other
}) => {
  const utils = useUtils();

  const dateText = React.useMemo(() => {
    if (!date) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(date, toolbarFormat);
    }

    if (isYearOnlyView(views as DatePickerView[])) {
      return utils.format(date, 'year');
    }

    if (isYearAndMonthViews(views as DatePickerView[])) {
      return utils.format(date, 'month');
    }

    // Little localization hack (Google is doing the same for android native pickers):
    // For english localization it is convenient to include weekday into the date "Mon, Jun 1"
    // For other locales using strings like "June 1", without weekday
    return /en/.test(utils.getCurrentLocaleCode())
      ? utils.format(date, 'normalDateWithWeekday')
      : utils.format(date, 'normalDate');
  }, [date, toolbarFormat, toolbarPlaceholder, utils, views]);

  return (
    <PickerToolbar
      className={classes.root}
      toolbarTitle={toolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      isLandscape={isLandscape}
      penIconClassName={classes.penIcon}
      {...other}
    >
      <Typography
        variant="h4"
        data-mui-test="datepicker-toolbar-date"
        align={isLandscape ? 'left' : 'center'}
        className={clsx({ [classes.dateTitleLandscape]: isLandscape })}
      >
        {dateText}
      </Typography>
    </PickerToolbar>
  );
};

export default withStyles(styles, { name: 'MuiDatePickerToolbar' })(DatePickerToolbar);
