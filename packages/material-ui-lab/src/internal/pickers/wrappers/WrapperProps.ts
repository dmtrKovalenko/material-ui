import { DateInputProps } from '../PureDateInput';
import { ExportedPickerPopperProps } from '../PickersPopper';
import { ExportedPickerModalProps } from '../PickersModalDialog';

export type DateInputPropsLike<TInputValue, TDateValue> = Omit<
  DateInputProps<TInputValue, TDateValue>,
  'renderInput' | 'validationError'
> & {
  renderInput: (...args: any) => JSX.Element;
  validationError?: any;
};

export interface StaticWrapperProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode
   *
   * @default "static"
   */
  displayStaticWrapperAs?: 'desktop' | 'mobile';
}

export interface MobileWrapperProps extends ExportedPickerModalProps {}

export interface DesktopWrapperProps extends ExportedPickerPopperProps {}

export interface PrivateWrapperProps {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onClear: () => void;
  onSetToday: () => void;
  DateInputProps: DateInputPropsLike<any, any>;
  KeyboardDateInputComponent?: React.ComponentType<DateInputPropsLike<any, any>>;
  PureDateInputComponent?: React.ComponentType<DateInputPropsLike<any, any>>;
}

/** Root interface for all wrappers props. Any wrapper can accept all the props and must spread them. */
export type WrapperProps = StaticWrapperProps &
  MobileWrapperProps &
  DesktopWrapperProps &
  PrivateWrapperProps;
