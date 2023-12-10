import { useEffect } from 'react';
import { applyBeeSoftTheme, createBeeSoftTheme } from '../src/components/common-functions';

import '../src/index.css';

// @ts-ignore
const Layout = ({children}) => {
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
    <div className="bsc-p-10">
      {children}
    </div>
  );
};

export default Layout;
