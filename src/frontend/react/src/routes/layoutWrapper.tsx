import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';

import { Navigate, useLocation } from 'react-router-dom';

// Provider
import { AuthContext } from 'auth'

const LayoutWrapper = ({ Component, disableFooter = false, isPublic = false, ...props }: any) => {
  const { user, setToken } = useContext(AuthContext);
  const isAuth = user?.token != null;
  
  const location = useLocation();

  // This useEffect is basically used as the callback function for the login API call
  useEffect(() => {
    const currentPath = location.pathname;
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (currentPath === '/home' && token) {
      setToken(token); 
    }
  }, [location, setToken]); 

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
