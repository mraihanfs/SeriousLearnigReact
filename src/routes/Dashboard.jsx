import React from "react";
import CardDashboard from "../components/CardDashboard";
import { CUSTOMERS, PRODUCTS } from "../constants/DataMock";

const Dashboard = () => {
  return (
    <div className="flex justify-between w-full">
      <CardDashboard description={"Jumlah Product"} value={PRODUCTS.length} />
      <CardDashboard description={"Jumlah Customer"} value={CUSTOMERS.length} />
      <CardDashboard description={"Jumlah Bill"} value={"Rp. 500.000.000"} />
    </div>
  );
};

export default Dashboard;
