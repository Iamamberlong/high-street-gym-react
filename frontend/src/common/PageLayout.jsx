import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

const PageLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Main>{children}</Main>
    <Footer />
  </div>
);

export default PageLayout;
