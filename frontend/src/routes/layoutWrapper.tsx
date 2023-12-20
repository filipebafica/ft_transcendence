import React, { useContext } from 'react';
import Layout from '../components/Layout';

import { Navigate } from 'react-router-dom';

// Provider
import { AuthContext } from 'auth'

const LayoutWrapper = ({ Component, disableFooter = false, isPublic = false, ...props }: any) => {
  const { user } = useContext(AuthContext);
  // const isAuth = user?.token != null;
  const isAuth = user?.id != null;

  if (!isAuth && !isPublic) {
    return <Navigate to="/" />;
  }

  return (
    <Layout disableFooter={disableFooter}>
      <Component {...props} />
    </Layout>
  );
};

export default LayoutWrapper;
