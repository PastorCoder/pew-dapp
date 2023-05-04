import React from "react";
import { Routes, Route, RouteProps } from "react-router-dom";
import TransferPage from "../pages/TransferPage";
import Index from "../pages/Index";
// import TalismanPage from "../pages/TalismanPage";
import TabpaneComponentPage from "../pages/TabpaneComponentPage";




const RoutePages: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="transfer-fund" element={<TransferPage />} />
      {/* <Route path="talisman" element={<TalismanPage />} /> */}
      <Route path="staking" element={<TabpaneComponentPage />} />
    </Routes>
  );
};

export default RoutePages;
