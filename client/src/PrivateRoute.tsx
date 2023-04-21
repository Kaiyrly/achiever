import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useToken from './hooks/useToken';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useToken();

  // If authorized, render the children
  // If not, navigate to the login page
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
