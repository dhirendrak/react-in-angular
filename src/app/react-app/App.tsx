import React from 'react';

interface AppProps {}

export const App: React.FC<AppProps> = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <h1>React App Inside Angular</h1>
      <p>This is a React component rendered inside an Angular application!</p>
    </div>
  );
}; 