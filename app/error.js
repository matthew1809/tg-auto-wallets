// app/error.js
'use client';
 
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log error details
    alert(`Error details:\n${error.message}\n\nStack trace:\n${error.stack}`);
  }, [error]);
 
  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      backgroundColor: '#ffebee',
      color: '#d32f2f',
    }}>
      <h2>Something went wrong!</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
      <button 
        onClick={reset}
        style={{
          padding: '8px 16px',
          marginTop: '12px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Try again
      </button>
    </div>
  );
}