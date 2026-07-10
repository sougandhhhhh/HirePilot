import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('hirepilot-theme');
                    var resolved = 'dark';
                    if (theme === 'light' || theme === 'dark') {
                      resolved = theme;
                    } else if (theme === 'system' || !theme) {
                      resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                    }
                    document.documentElement.setAttribute('data-theme', resolved);
                  } catch(e) {}
                })();
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}