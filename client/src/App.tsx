import React from 'react';
import './App.css';
import { Route, Routes} from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { ErrorPage } from './pages/ErrorPage';
import UsagePage  from './pages/UseagePage';
import { NavBar } from './components/NavBar';
import { Container } from 'react-bootstrap';
import { Settings } from './pages/Settings';
import { GoalPage } from './pages/GoalPage';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Statistics } from './pages/Statistics';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import useToken from './hooks/useToken';
import PrivateRoute from './PrivateRoute';

function App() {
  const { token, setToken } = useToken();

  return  (
    <>
      {token && <NavBar token={token} setToken={setToken} />}
      <Container>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute><MainPage /></PrivateRoute>} />
            <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="statistics" element={<PrivateRoute><Statistics /></PrivateRoute>} />
            <Route path="usage" element={<PrivateRoute><UsagePage /></PrivateRoute>} />
            <Route path="goals/:id" element={<PrivateRoute><GoalPage /></PrivateRoute>} />
            <Route path="login" element={<Login token={token} setToken={setToken} />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
