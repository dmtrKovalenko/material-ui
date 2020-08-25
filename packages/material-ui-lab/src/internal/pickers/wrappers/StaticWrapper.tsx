import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DIALOG_WIDTH } from '../constants/dimensions';
import { WrapperVariantContext, IsStaticVariantContext } from './WrapperVariantContext';
import { StaticWrapperProps, PrivateWrapperProps } from './WrapperProps';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      overflow: 'hidden',
      minWidth: DIALOG_WIDTH,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
    },
  }),
  { name: 'MuiPickersStaticWrapper' },
);

export const StaticWrapper: React.FC<PrivateWrapperProps & StaticWrapperProps> = (props) => {
  const { displayStaticWrapperAs = 'mobile', children } = props;
  const classes = useStyles();
  const isStatic = true;

  return (
    <IsStaticVariantContext.Provider value={isStatic}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <div className={classes.root}>{children}</div>
      </WrapperVariantContext.Provider>
    </IsStaticVariantContext.Provider>
  );
};

export default StaticWrapper;
