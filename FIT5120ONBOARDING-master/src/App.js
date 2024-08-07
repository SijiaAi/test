import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './header';
import HomePage from './HomePage';
import Map from './map'; 
import CyclingRules from './CyclingRules'
import Accidents from './Accidents';

function App() {
  return (
    <>
      <Header />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/safety-data" element={<Accidents />} />
          <Route path="/bicycle-routes" element={<Map />} />
          <Route path="/Safety-rules" element={<CyclingRules />} />
         
        </Routes>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 100px)', // Adjust height based on header and footer height
    padding: '20px',
  },
};

export default App;
