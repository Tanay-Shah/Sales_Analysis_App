import { useEffect,useState } from "react"

function Statistics({props}){
  const [statisticsData,setStatisticsData]=useState({result: {
    totalSaleAmount: 0,
    sold_products_count: 0,
    unsold_products_count: 0,
  },})

  useEffect(()=>{
    const fec=async ()=>{

      const data=await fetch(`http://localhost:3000/statistics?month=${props.month}`)
      const response=await data.json()

      setStatisticsData(response)
    }

    fec();
  },[props.month])

  return (
    <div className="w-1/2">
    <div className="bg-yellow-500 font-bold flex justify-evenly text-black pt-24 pb-24 text-3xl w-full text-left rounded-l-lg">
    <div>Total Sale:<br/>
    Total Sold Items:<br/>
    Total Unsold Items:</div>
    <div>{statisticsData.result.totalSaleAmount}<br/>
    {statisticsData.result.sold_products_count}<br/>
    {statisticsData.result.unsold_products_count}</div>
    </div>
    </div>
  )

}

export default Statistics