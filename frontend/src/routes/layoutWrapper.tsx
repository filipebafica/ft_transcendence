// LayoutWrapper.js
import React from 'react';
import Layout from '../components/Layout';

const LayoutWrapper = (Component: React.FC<any>, disableFooter = false) => {
  return (props: any) => (
    <Layout disableFooter={disableFooter}>
      <Component {...props} />
    </Layout>
  );
};

export default LayoutWrapper;