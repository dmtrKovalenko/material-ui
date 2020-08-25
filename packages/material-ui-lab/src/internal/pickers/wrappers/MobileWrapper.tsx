import * as React from 'react';
import * as PropTypes from 'prop-types';
import { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog';
import { PureDateInput } from '../PureDateInput';
import type { WrapperProps } from './Wrapper';
import type { StaticWrapperProps } from './StaticWrapper';
import type { InnerDesktopWrapperProps } from './DesktopWrapper';
import { WrapperVariantContext } from './WrapperVariantContext';
import PickersModalDialog, { ExportedPickerModalProps } from '../PickersModalDialog';

export interface InnerMobileWrapperProps extends ExportedPickerModalProps {
  /**
   * Props to be passed directly to material-ui Dialog
   * @type {Partial<MuiDialogProps>}
   */
  DialogProps?: Partial<MuiDialogProps>;
}

export interface MobileWrapperProps
  extends InnerMobileWrapperProps,
    WrapperProps,
    Partial<InnerDesktopWrapperProps & StaticWrapperProps> {}

export const MobileWrapper: React.FC<MobileWrapperProps> = (props) => {
  const {
    cancelText,
    children,
    clearable,
    clearText,
    DateInputProps,
    DialogProps,
    displayStaticWrapperAs,
    KeyboardDateInputComponent,
    okText,
    onAccept,
    onClear,
    onDismiss,
    onSetToday,
    open,
    PopperProps,
    PureDateInputComponent = PureDateInput,
    showTabs,
    showTodayButton,
    todayText,
    wider,
    TransitionComponent,
    ...other
  } = props;
  return (
    <WrapperVariantContext.Provider value="mobile">
      <PureDateInputComponent {...other} {...DateInputProps} />
      <PickersModalDialog
        wider={wider}
        showTabs={showTabs}
        open={open}
        onClear={onClear}
        onAccept={onAccept}
        onDismiss={onDismiss}
        onSetToday={onSetToday}
        clearText={clearText}
        todayText={todayText}
        okText={okText}
        cancelText={cancelText}
        clearable={clearable}
        showTodayButton={showTodayButton}
        TransitionComponent={TransitionComponent}
        data-mui-test="mobile-wrapper-dialog"
        {...DialogProps}
      >
        {children}
      </PickersModalDialog>
    </WrapperVariantContext.Provider>
  );
};

MobileWrapper.propTypes = {
  cancelText: PropTypes.node,
  clearable: PropTypes.bool,
  clearText: PropTypes.node,
  DialogProps: PropTypes.object,
  okText: PropTypes.node,
  showTodayButton: PropTypes.bool,
  todayText: PropTypes.node,
};
