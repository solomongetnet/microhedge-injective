import React from "react";
import CommodityList from "./fetch";
import UpdatePriceForm from "./update";
import MockUSDTPage from "./fetch-usdt-balance";
import CreateHedge from "./create-hedge";

const Page = () => {
  return (
    <div className="container mx-auto py-10 space-y-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 border-b pb-4 mb-10">Test Page - Admin & Hedge Operations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-10">
          <CommodityList />
          <UpdatePriceForm />
        </div>
        
        <div className="space-y-10">
          <MockUSDTPage />
          <CreateHedge />
        </div>
      </div>
    </div>
  );
};

export default Page;
