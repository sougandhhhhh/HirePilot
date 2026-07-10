import Head from 'next/head';
import { ThemeProvider } from '../components/theme/ThemeContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <title>HirePilot AI</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}