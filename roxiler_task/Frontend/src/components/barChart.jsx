import { useEffect, useState } from 'react';
import { ResponsiveContainer,BarChart,Bar, XAxis, YAxis ,ReferenceLine} from 'recharts';

function BarChartComp({props}){
const [barData,setBarData]=useState([
  { range: "Category 1", count: 10 },
  { range: "Category 2", count: 20 },
])

  useEffect(()=>{
    const bar=async ()=>{
      const data=await fetch(`http://localhost:3000/bar-chart?month=${props.month}`)
      const response= await data.json()

      setBarData(response)
    }

    bar()
    console.log(barData)
  },[props.month])
  
return (
  <div>
    <ResponsiveContainer width={800} height={300}  aspect={2.5}>
      <BarChart data={barData}>
      <ReferenceLine y={2} stroke="#999" strokeWidth={1} />
      <ReferenceLine y={4} stroke="#999" strokeWidth={1} />
      <ReferenceLine y={6} stroke="#999" strokeWidth={1} />
      <XAxis dataKey="range"/>
      <YAxis />
        <Bar dataKey="count" fill='skyblue' />
      </BarChart>
    </ResponsiveContainer>
  </div>
)
  
}

export default BarChartComp
