import './App.css'
import { useState } from 'react';
import DataTable from './components/dataTable';
import Statistics from './components/Statistics';
import BarChartComp from './components/barChart';


function App() {
  //use callback for input
const Month_arr=[
    { Month: 'January', monthNum: '01' },
    { Month: 'February', monthNum: '02' },
    { Month: 'March', monthNum: '03' },
    { Month: 'April', monthNum: '04' },
    { Month: 'May', monthNum: '05' },
    { Month: 'June', monthNum: '06' },
    { Month: 'July', monthNum: '07' },
    { Month: 'August', monthNum: '08' },
    { Month: 'September', monthNum: '09' },
    { Month: 'October', monthNum: '10' },
    { Month: 'November', monthNum: '11' },
    { Month: 'December', monthNum: '12' }
  ]
let [selectMonth_Table,setMonthTable]=useState("03")
let [selectMonth_Stats,setMonthStats]=useState('03')
let [selectMonth_Bar,setMonthBar]=useState('03')
let [search,setsearch]=useState('')
let [page,setpage]=useState(1)

//prop for input field
const data={page:page,search:search,month:selectMonth_Table}
const data2={month:selectMonth_Stats}
  return (
    <div className=" w-full">

      {/* div-1 */}
      <div className="inline-block align-middle w-40 h-40 rounded-full bg-slate-800 text-white font-bold pt-12 text-xl m-12">
        Transaction <br />
        DashBoard
      </div>

      {/* div-2 */}
      <div className="mt-5 ">
        <div className="inline-block align-middle w-1/2 rounded-full">
          <input
            type="text"
            placeholder="Search transactions"
            className="border-2 rounded-full py-2 px-3 text-white focus:outline-none focus:shadow-outline hover:border-yellow-600"
            onChange={(e) => setsearch(e.target.value)}
          />
          <select
            className=" m-5 bg-yellow-600 rounded-lg text-black font-bold h-9"
            value={selectMonth_Table}
            onChange={(e) => {
              setMonthTable(e.target.value);
            }}
          >
            {Month_arr.map((Element) => {
              return (
                <option key={Element.monthNum} value={Element.monthNum}>
                  {Element.Month}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      
      {/* div-3 */}
      <DataTable props={data} />

      {/* div-4 */}
      <div className='flex justify-evenly'>
        <label className='mt-8 text-xl text-white font-semibold'>Page:{page}</label>
          
          <div>
          <button
          onClick={() => {
            if (page > 1) {
              setpage(--page);
            }
          }}
        >
          Previous Page
        </button>
        <button className="m-5" onClick={() => setpage(++page)}>
          Next Page
        </button>
          </div>
        
          <label className='mt-8 text-xl text-white font-semibold'>Per Page:10</label>
      </div>

      {/* div-5 */}
      <div className='m-16 bg-slate-800 flex rounded-lg'>
      <Statistics  props={data2} />
      <div className="m-28 flex">
      <h1>Statistics</h1>
      <select
            className=" m-4 bg-yellow-600 rounded-lg text-black font-bold h-10 text-xl"
            value={selectMonth_Stats}
            onChange={(e) => {
              setMonthStats(e.target.value);
            }}
          >
            {Month_arr.map((Element) => {
              return (
                <option key={Element.monthNum} value={Element.monthNum}>
                  {Element.Month}
                </option>
              );
            })}
          </select></div>
      </div>

      {/* div-6 */}
      <div className='ml-16 mr-16 mt-9 mb-16 bg-slate-800 rounded-lg'>
      <div><label className='text-4xl'>Bar Chart Stats</label><select
            className=" m-4  bg-yellow-600 rounded-lg text-black font-bold h-9 text-xl"
            value={selectMonth_Bar}
            onChange={(e) => {
              setMonthBar(e.target.value);
            }}
          >
            {Month_arr.map((Element) => {
              return (
                <option key={Element.monthNum} value={Element.monthNum}>
                  {Element.Month}
                </option>
              );
            })}
          </select></div>
        
        <div className='ml-72 mr-72 rounded-lg bg-white '>
        <BarChartComp props={{month:selectMonth_Bar}} />
        </div>
      </div>
      


    </div>
  );
}

export default App
