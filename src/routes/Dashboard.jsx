import React from "react";
import CardDashboard from "../components/CardDashboard";

const Dashboard = () => {
  return (
    <div className="flex justify-between w-full">
      <CardDashboard description={"Jumlah Product"} value={"100"} />
      <CardDashboard description={"Jumlah Customer"} value={"10"} />
      <CardDashboard description={"Jumlah Bill"} value={"Rp. 500.000.000"} />
    </div>
  );
};

export default Dashboard;
