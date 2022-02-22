import { ApolloProvider } from '@apollo/client';
import { GlobalStyles } from '../src/styles/global';
import ContextProvider from '../src/context';
import Layout from '../src/components/commons/Layout';
import client from '../src/graphql/client';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('Service worker registration failed', err));
    } else {
      console.log('Service worker not supported');
    }
  }, []);
  return (
    <ApolloProvider client={client}>
      <ContextProvider>
        <Layout>
          <GlobalStyles />
          <Component {...pageProps} />
        </Layout>
      </ContextProvider>
    </ApolloProvider>
  );
}

export default MyApp;
