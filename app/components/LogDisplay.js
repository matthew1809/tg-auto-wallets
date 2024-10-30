'use client';
import { useEffect, useState, useRef } from 'react';
import { CustomLogger } from '../../utils/logger';

export default function LogDisplay() {
 const [logs, setLogs] = useState([]);
 const [isCollapsed, setIsCollapsed] = useState(true);
 const [filter, setFilter] = useState('all');
 const [expandedLogs, setExpandedLogs] = useState(new Set());
 const logContainerRef = useRef(null);

 useEffect(() => {
   CustomLogger.init();
   CustomLogger.initNetworkLogging();
   const unsubscribe = CustomLogger.subscribe(setLogs);
   return unsubscribe;
 }, []);

 const toggleLogExpansion = (index) => {
   const newExpanded = new Set(expandedLogs);
   if (newExpanded.has(index)) {
     newExpanded.delete(index);
   } else {
     newExpanded.add(index);
   }
   setExpandedLogs(newExpanded);
 };

 const getLogStyle = (log) => {
   switch(log.type) {
     case 'network':
       return {
         color: log.direction === 'request' ? '#4CAF50' : '#2196F3',
         marginBottom: '8px',
         borderLeft: `3px solid ${log.direction === 'request' ? '#4CAF50' : '#2196F3'}`,
         paddingLeft: '8px'
       };
     case 'error':
       return { 
         color: '#ff4444',
         marginBottom: '8px',
         borderLeft: '3px solid #ff4444',
         paddingLeft: '8px'
       };
     default:
       return { 
         color: 'white',
         marginBottom: '8px',
         borderLeft: '3px solid #888',
         paddingLeft: '8px'
       };
   }
 };

 const renderNetworkBody = (log, index) => {
   const isExpanded = expandedLogs.has(index);
   const body = log.direction === 'request' ? log.body : log.body;
   const bodyStr = typeof body === 'object' ? JSON.stringify(body) : body;
   const preview = bodyStr?.substring(0, 100) + (bodyStr?.length > 100 ? '...' : '');

   return (
     <div style={{ marginTop: '4px', color: '#888', cursor: 'pointer' }} onClick={() => toggleLogExpansion(index)}>
       {log.direction === 'request' ? 'Body: ' : 'Response: '}
       {isExpanded ? bodyStr : preview}
       {bodyStr?.length > 100 && (
         <span style={{ color: '#666', marginLeft: '4px' }}>
           {isExpanded ? '(collapse)' : '(expand)'}
         </span>
       )}
     </div>
   );
 };

 const filteredLogs = logs.filter(log => {
   if (filter === 'all') return true;
   if (filter === 'network') return log.type === 'network';
   if (filter === 'errors') return log.type === 'error';
   return log.type === 'log';
 });

 const clearLogs = () => {
   CustomLogger.logs = [];
   setLogs([]);
   setExpandedLogs(new Set());
 };

 if (logs.length === 0) return null;

 return (
   <div style={{
     position: 'fixed',
     bottom: 0,
     left: 0,
     right: 0,
     zIndex: 9999,
     backgroundColor: 'rgba(0, 0, 0, 0.9)',
     color: 'white',
     fontFamily: 'monospace',
     fontSize: '12px',
     border: '1px solid rgba(255, 255, 255, 0.1)',
   }}>
     <div style={{
       padding: '8px',
       borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
     }}>
       <div onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer', flex: 1 }}>
         {isCollapsed ? '▼' : '▲'} Console ({filteredLogs.length} logs)
       </div>
       <div style={{ display: 'flex', gap: '8px' }}>
         <select 
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
           style={{
             background: 'transparent',
             color: 'white',
             border: '1px solid rgba(255, 255, 255, 0.3)',
             borderRadius: '4px',
             padding: '2px 4px'
           }}
         >
           <option value="all">All</option>
           <option value="network">Network</option>
           <option value="errors">Errors</option>
           <option value="logs">Logs</option>
         </select>
         <button
           onClick={clearLogs}
           style={{
             background: 'transparent',
             color: 'white',
             border: '1px solid rgba(255, 255, 255, 0.3)',
             borderRadius: '4px',
             padding: '2px 8px',
             cursor: 'pointer'
           }}
         >
           Clear
         </button>
       </div>
     </div>
     {!isCollapsed && (
       <div
         ref={logContainerRef}
         style={{
           maxHeight: '300px',
           overflowY: 'auto',
           padding: '8px',
         }}
       >
         {filteredLogs.map((log, index) => (
           <div
             key={index}
             style={{
               ...getLogStyle(log),
               whiteSpace: 'pre-wrap',
               wordBreak: 'break-all',
               fontSize: '11px',
               lineHeight: '1.4'
             }}
           >
             <span style={{ color: '#888' }}>
               {log.timestamp.split('T')[1].split('.')[0]}
             </span>
             {' '}
             {log.type === 'network' ? (
               <>
                 <span style={{ 
                   fontWeight: 'bold',
                   color: log.direction === 'request' ? '#4CAF50' : '#2196F3' 
                 }}>
                   {log.direction === 'request' ? '→' : '←'}
                 </span>
                 {' '}
                 {log.direction === 'request' ? (
                   <>
                     <strong>{log.method}</strong> {log.url}
                     {log.body && renderNetworkBody(log, index)}
                   </>
                 ) : (
                   <>
                     <strong>Status: {log.status}</strong> {log.url}
                     {log.body && renderNetworkBody(log, index)}
                   </>
                 )}
               </>
             ) : (
               log.message
             )}
           </div>
         ))}
       </div>
     )}
   </div>
 );
}