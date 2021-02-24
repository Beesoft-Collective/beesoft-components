import React from 'react';
import '../src/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faAngleRight, faAngleLeft);

// @ts-ignore
const Layout = ({children}) => {
  return (
    <div className="px-10 py-10">
      {children}
    </div>
  )
};

export default Layout;
