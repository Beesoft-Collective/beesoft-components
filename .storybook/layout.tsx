import { useEffect } from 'react';
import { applyBeeSoftTheme, createBeeSoftTheme } from '../src/components/common-functions';

import '../node_modules/@beesoft/headless-ui/dist/headless-ui.css';
import '../src/index.css';

// @ts-expect-error needed to allow children below
const Layout = ({ children }) => {
  useEffect(() => {
    applyBeeSoftTheme(
      createBeeSoftTheme({
        primary1: '#2f54ff',
        primary2: '#5f7bff',
        primary3: '#899eff',
        primary4: '#b4c1ff',
        primary5: '#dee4ff'
      })
    );
  }, []);

  return (
    <div className="bsc:p-10">
      {children}
    </div>
  );
};

export default Layout;
