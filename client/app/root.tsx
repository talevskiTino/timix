import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import AuthContext from './context/auth-context';
import Navbar from './components/Navbar/Navbar';
import tailwindUrl from './styles/tailwind.css';
import { useContext, useEffect, useState } from 'react';
import { refreshToken } from './context/accessToken';
import { useApolloClient } from '@apollo/client';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindUrl }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'timix',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const context = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const client = useApolloClient();
  useEffect(() => {
    async function fetchData() {
      let data = await refreshToken();
      if (data && data.ok) {
        login(data.accessToken, data.userId, null, data.role);
      }
    }
    fetchData();
  }, []);

  const login = (token: any, userId: any, tokenExpiration: any, role: any) => {
    setToken(token);
    setUserId(userId);
    setRole(role);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthContext.Provider
          value={{
            token: token,
            userId: userId,
            login: login,
            logout: logout,
            role: role,
          }}
        >
          <Navbar />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </AuthContext.Provider>
      </body>
    </html>
  );
}
