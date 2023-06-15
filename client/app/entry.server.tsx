import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { getAccessToken } from './context/accessToken';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const token = getAccessToken();
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: 'http://localhost:5000/graphql',
      credentials: request.credentials ?? 'include',
      headers: {
        Authorization: token !== '' ? 'Bearer ' + token : '',
      },
    }),
  });

  const App = (
    <ApolloProvider client={client}>
      <RemixServer context={remixContext} url={request.url} />
    </ApolloProvider>
  );

  return getDataFromTree(App).then(() => {
    const initialState = client.extract();
    const markup = renderToString(
      <>
        {App}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(
              initialState
            ).replace(/</g, '\\u003c')}`, // The replace call escapes the < character to prevent cross-site scripting attacks that are possible via the presence of </script> in a string literal
          }}
        />
      </>
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response('<!DOCTYPE html>' + markup, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  });
}
