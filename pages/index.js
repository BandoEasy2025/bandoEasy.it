import { useEffect } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>BandoEasy - Semplifica la gestione dei bandi di finanziamento</title>
        <meta name="description" content="BandoEasy è la piattaforma all-in-one che ti aiuta a trovare, monitorare e gestire i bandi di finanziamento più adatti alla tua azienda." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <main>
        <LandingPage />
      </main>
    </>
  );
} 