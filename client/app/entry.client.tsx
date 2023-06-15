import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useApolloClient,
} from '@apollo/client';
import { RemixBrowser } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { hydrate } from 'react-dom';
import { getAccessToken, setAccessToken } from './context/accessToken';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

function Client() {
  const [accessToken, setNewAccessToken] = useState('');
  const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include',
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
    return forward(operation);
  });

  const tokenRefreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();

      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(token) as any;
        if (Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch('http://localhost:5000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      });
    },
    handleFetch: (accessToken) => {
      setNewAccessToken(accessToken);
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn('Your refresh token is invalid. Try to relogin');
      console.error(err);
    },
  });

  const client = new ApolloClient({
    link: ApolloLink.from([tokenRefreshLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <RemixBrowser />
    </ApolloProvider>
  );
}

hydrate(<Client />, document);
