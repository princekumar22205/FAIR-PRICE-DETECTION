const asyncHandler = require('express-async-handler');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
// post method 
// give json response of product 
const search = asyncHandler(async(req,res)=>{
    const {query} =  req.body;
    if(!query){
        res.status(400);
        throw new Error("first search something");
    }
    const url = `https://serpapi.com/search.json?engine=amazon&k=${query}&amazon_domain=amazon.com&api_key=${process.env.API_KEY}`;
    try{
        const response = await axios.get(url);
    if(!response){
        res.status(500);
        throw new Error("Fail to fetch product data")
    }
    const result = response.data.organic_results?.map((item)=>({
        position : item.position,
        title : item.title,
        new_price: item.price,
        old_price: item.old_price,
        thumbnail: item.thumbnail,
        rating: item.rating,
    }));
    res.send(result);
    res.status(200).json({result});
}
    catch(error){
        console.error("SerpApi error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
    
}) 

module.exports = {search};