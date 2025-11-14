import React from 'react';
import { formatCurrency } from '@coop/shared';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Cooperative Society Management</h1>
      </header>
      <main>
        <section>
          <h2>Welcome</h2>
          <p>Manage your cooperative society efficiently</p>
          <p>Sample formatted amount: {formatCurrency(1000)}</p>
        </section>
      </main>
    </div>
  );
}

export default App;
