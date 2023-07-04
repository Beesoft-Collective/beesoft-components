import * as React from 'react';
import '../src/index.css';
import '../src/components/font-awesome';

// @ts-ignore
const Layout = ({children}) => {
  return (
    <div className="bsc-p-10">
      {children}
    </div>
  )
};

export default Layout;
