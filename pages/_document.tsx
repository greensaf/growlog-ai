import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta name='theme-color' content='#22c55e' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/logo.png' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
