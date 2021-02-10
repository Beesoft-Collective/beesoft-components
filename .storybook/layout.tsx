import React from 'react';
import '../src/index.css';

// @ts-ignore
const Layout = ({children}) => {
  return (
    <div className="px-10 py-10">
      {children}
    </div>
  )
};

export default Layout;
