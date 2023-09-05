import clsx from 'clsx';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import axios from 'axios';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/http://127.0.0.1:50000/users'); // Fetch user data from API
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Atllas Takehome</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/public/favicon.ico' />
      </Head>
      <main className={clsx('w-full h-full', inter.className)}>
       
      </main>
    </>
  );
}
