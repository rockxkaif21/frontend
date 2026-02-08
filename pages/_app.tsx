import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { AuthProvider } from "../lib/auth";
import { apolloClient } from "../lib/apolloClient";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}
