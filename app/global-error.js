// app/global-error.js
'use client';
 
export default function GlobalError({
  error,
  reset,
}) {
  useEffect(() => {
    alert(`Global Error:\n${error.message}\n\nStack trace:\n${error.stack}`);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          color: '#d32f2f',
        }}>
          <h2>Something went wrong!</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}