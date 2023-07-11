import * as React from 'react';
import { useEffect } from 'react';
import { applyBeeSoftTheme, createBeeSoftTheme } from '../src/components/common-functions';
import '../src/components/font-awesome';
import '../src/index.css';

// @ts-ignore
const Layout = ({children}) => {
  useEffect(() => {
    applyBeeSoftTheme(
      createBeeSoftTheme('#2f54ff', '#5f7bff', '#899eff', '#b4c1ff', '#dee4ff', '#303030', '#5f5f5f', '#8f8f8f', '#bebebe', '#eeeeee', '#222222', '#3c3c3c', '#4e4e4e', '#fefefe', '#eeeeee', '#cccccc')
    );
  }, []);

  return (
    <div className="bsc-p-10">
      {children}
    </div>
  )
};

export default Layout;
