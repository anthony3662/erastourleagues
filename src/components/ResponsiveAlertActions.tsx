import * as React from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import { Breakpoints } from '../theme/breakpoints';
export const ResponsiveAlertActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width } = useWindowSize();

  if (width >= Breakpoints.sm) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: 80,
      }}>
      {children}
    </div>
  );
};
