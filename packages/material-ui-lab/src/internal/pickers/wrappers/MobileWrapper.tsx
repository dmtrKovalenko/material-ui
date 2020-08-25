import * as React from 'react';
import * as PropTypes from 'prop-types';

import { PureDateInput } from '../PureDateInput';
import { WrapperVariantContext } from './WrapperVariantContext';
import PickersModalDialog from '../PickersModalDialog';
import { MobileWrapperProps, PrivateWrapperProps } from './WrapperProps';

export const MobileWrapper: React.FC<MobileWrapperProps & PrivateWrapperProps> = (props) => {
  const {
    cancelText,
    children,
    clearable,
    clearText,
    DateInputProps,
    DialogProps,
    KeyboardDateInputComponent,
    okText,
    onAccept,
    onClear,
    onDismiss,
    onSetToday,
    open,
    PureDateInputComponent = PureDateInput,
    showTabs,
    showTodayButton,
    todayText,
    wider,
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

export default MobileWrapper;
