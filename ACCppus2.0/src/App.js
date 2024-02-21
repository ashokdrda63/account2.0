import logo from './logo.svg';
import React from "react"
import './App.css';
import Header from './component/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchemeMaster from './pages/SchemeMaster';
import AccountEntry from './pages/AccountEntry';
import OBmust from './pages/OBmust';
import OBMaster from './pages/OBMaster';
import VoucherEntey from './pages/VoucherEntey';
import VoucherEdit from './pages/VoucherEdit';
import VoucherContextProvider from './context/VoucherContext';
import DayBook from './pages/DayBook';
import ConsTrailBook from './pages/ConsTrailBook';



function App() {

  return (
    <div className='App-header'>
        <BrowserRouter>
          <VoucherContextProvider>
          <Header  />
          <Routes>
            <Route>
              <Route path="Scheme-Entries" element={<SchemeMaster />} />
              <Route path="Bud-Acc-Entries" element={<AccountEntry />} />
              <Route path="Bud-Acc-Scheme-Entries" element={<OBmust />} />
              <Route path="OBmaster-Entries" element={<OBMaster />} />
              <Route path="Voucher-entry" element={<VoucherEntey />} />
              <Route path="voucher-Edit" element={<VoucherEdit />} />
              <Route path="DayBook" element={<DayBook />} />
              <Route path="ConsTrailBook" element={<ConsTrailBook />} />
            </Route>
          </Routes>
          </VoucherContextProvider>
        </BrowserRouter>
      {/* <Header/>
      <SchemeMaster/> */}
    </div>
  );
}

export default App;
