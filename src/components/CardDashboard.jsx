import React from 'react'

const CardDashboard = ({ description, value}) => {
  return (
    <div className="flex flex-col w-56 h-32 bg-slate-600 text-white text-sans rounded-lg p-3 m-3">
        <h1 className="text-xl font-bold basis-2/3">{description}</h1>
        <h2 className="text-right"> {value}</h2>
      </div>
  )
}

export default CardDashboard