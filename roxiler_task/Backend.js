const express=require('express')
const mongoose=require('mongoose')
const cors = require('cors');
const app=express()
const url='mongodb+srv://tanay_11:8357070065@cluster0.s6zanf6.mongodb.net/transaction';
mongoose.connect(url).then(()=>console.log("Connected"))

app.use(cors());

const product_schema={
  id: Number,
  title: String,
  price: String,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: String
}
const product_transactions=mongoose.model('Products',product_schema)


///Initialising Funtion
let initialize=false
function initializeData(data) {

  data.forEach((e) => {
    const product_transaction = new product_transactions({
      id: e.id,
      title: e.title,
      price: e.price,
      description: e.description,
      category: e.category,
      image: e.image,
      sold: e.sold,
      dateOfSale: e.dateOfSale
    })
    product_transaction.save()
  })

}

///Search logic function
async function search_query(Element,page,month){
  let searchCriteria={}
  if(Element){
  searchCriteria = {
    $or: [
      { title: { $regex: Element, $options: 'i' } },
      { description: { $regex: Element, $options: 'i' } },
      { price: { $regex: Element, $options: 'i' } }
    ]
  }}
  let monthQuery={
    dateOfSale: { $regex:`-${month}-`, $options: 'i' }
  }
 let searFinalquery={
  $and:[searchCriteria,monthQuery]
 }
  return await product_transactions.find(searFinalquery).skip((page - 1) * 10)
  .limit(10);
}

// statistics logic function
async function logic_statistics(Month){

  let query_sold={
    $and:[{dateOfSale:{$regex:`-${Month}-`,$options:'i'}},
          {sold:true}]
  }

  let query_unsold={
    $and:[{dateOfSale:{$regex:`-${Month}-`,$options:'i'}},
          {sold:false}]
  }
  const sold_products = await product_transactions.find(query_sold);
  const unsold_products= await product_transactions.find(query_unsold);

  let totalSaleAmount=0
  sold_products.forEach((e)=>{
    totalSaleAmount+=parseInt(e.price)
  })

  const sold_products_count=sold_products.length
  const unsold_products_count=unsold_products.length

    
  return {totalSaleAmount:totalSaleAmount,
    sold_products_count:sold_products_count,
    unsold_products_count:unsold_products_count}

}

// barChart logic function
async function barChart(Month){
  
  const all_Range = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Number.MAX_SAFE_INTEGER }
  ];

  let finalData=await Promise.all(all_Range.map(async (element)=>{

    const query={
      $and:[{dateOfSale: { $regex:`-${Month}-`, $options: 'i' },},
           {price:{$gte: element.min, $lte: element.max}}]
    }
     
    const count = await product_transactions.countDocuments(query)

    return {range:`${element.min} ${element.max}`,count:count}
  }))

return finalData
}

// pieChart logic function
async function pieChart(Month){

  const categoryCounts = await product_transactions.aggregate([
    {
      $match: {
        dateOfSale: { $regex: `-${Month}-`, $options: 'i' }
      }
    },
    {
      $group: {
        _id: '$category',
        itemCount: { $sum: 1 }
      }
    }
  ])

  const pieChartData = categoryCounts.map((categoryCount) => ({
    category: categoryCount._id,
    itemCount: categoryCount.itemCount
  }))

return pieChartData
}


///Api for Initialize
app.get('/',async(req,res)=>{

try{
const allProductTransaction = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
const data = await allProductTransaction.json();
if(!initialize){
  initializeData(data)
  res.status(200).send(data)
  initialize=true
}else{
  res.send({MSG:"Already Initialized"})
}
}
catch{
res.status(500).send({Message:"ERROR"})
}

})

//Api for search and find
app.get('/products', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const search=req.query.search || false
      const Month = req.query.month;


     const allProducts = await search_query(search,page,Month)
    res.json( allProducts ).status(200);
    } catch{
      res.send({MSG:"ERROR"}).status(500)
    }
  } 
);

//Api for statistics
app.get("/statistics", async (req, res) => {
  try {
    const Month = req.query.month;
    const result=await logic_statistics(Month)
    res.send({result})
  } catch {
    res.send({msg:"Error-statistics"}).status(500)
  }
});

//Api for barChart
app.get('/bar-chart', async (req, res) => {
  try{
    const Month=req.query.month
    
    const barChartData = await barChart(Month)
    res.send(barChartData).status(200)
  }catch{
    res.send({msg:"Bar-Chart-Error"}).status(500)
  }
})

// API for pie chart
app.get('/pie-chart', async (req, res) => {
  try {
    const Month = req.query.month;

    const pieChartData=await pieChart(Month)

    res.json({ pieChartData });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for combined_three_api
app.get('/combined', async (req,res)=>{
  try {
    const Month = req.query.month;

    const result=await logic_statistics(Month)
    const barChartData = await barChart(Month)
    const pieChartData=await pieChart(Month)

  res.json({result:result,barChartData:barChartData,pieChartData:pieChartData})
  .status(200)
  
  } catch{
    res.json({error:"Combine API error"})
  }
})



app.use("*",(req,res,next)=>{
  res.send({msg:"Invalid URL"}).status(403)
  next()
})

app.listen(3000,()=>{
  console.log(`Working`);
})