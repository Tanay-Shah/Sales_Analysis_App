import { useEffect,useState } from "react";

function DataTable({props}){
 
 const [data,setData]=useState([])
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products?page=${props.page}&search=${props.search}&month=${props.month}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [props.page,props.search,props.month]); 
  
// console.log(data);


  return (
  <div className='flex justify-center '>
      <table className="bg-slate-800">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Description</th>
        <th>Price</th>
        <th>Category</th>
        <th>Sold</th>
        <th>Image</th>
      </tr>
    </thead>
    <tbody>
      {data.map((element)=>{
        return( <tr>
        <td>{element.id}</td>
        <td>{element.title}</td>
        <td>{element.description}</td>
        <td>{element.price}</td>
        <td>{element.category}</td>
        <td>{""+element.sold}</td>
        <td><a href={element.image}>ClickMe</a></td>
      </tr>)
      })}
    </tbody>
  </table>
  </div>
  )

}

export default DataTable