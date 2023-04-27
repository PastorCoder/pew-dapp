import React from "react";
import { Routes, Route, RouteProps } from "react-router-dom";
// import Transfer from "../frames/Transfer";
import Index from "../pages/Index";
// import TalismanPage from "../pages/TalismanPage";




const RoutePages: React.FC = () => {
  return (
    <Routes>
      <Route  path="/" element={<Index />} />
      {/* <Route path="transfer-fund" element={<Transfer />} /> */}
      {/* <Route path="talisman" element={<TalismanPage />} /> */}
    </Routes>
  );
};

export default RoutePages;
