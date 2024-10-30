// components/LogDisplay.js
'use client';

import { useEffect, useState } from 'react';
import { CustomLogger } from '../../utils/logger';

export default function LogDisplay() {
  const [logs, setLogs] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    CustomLogger.init();
    const unsubscribe = CustomLogger.subscribe(setLogs);
    return unsubscribe;
  }, []);

  if (logs.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
      }}
    >
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          padding: '4px 8px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          cursor: 'pointer',
        }}
      >
        {isCollapsed ? '▼' : '▲'} Console ({logs.length} logs)
      </div>
      {!isCollapsed && (
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {logs.map((log, index) => (
            <div
              key={index}
              style={{
                color: log.type === 'error' ? '#ff4444' : 'white',
                marginBottom: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              <span style={{ color: '#888' }}>{log.timestamp.split('T')[1].split('.')[0]}</span>
              {' '}
              {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}