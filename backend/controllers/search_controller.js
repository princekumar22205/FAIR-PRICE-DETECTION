const asyncHandler = require('express-async-handler');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
// post method 
// give json response of product 
const amazon = asyncHandler(async(req,res)=>{
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
        website: "amazon",
        logo:"https://telecomtalk.info/wp-content/uploads/2021/05/amazon-one-month-prime-membership-discontinued-rbi.png",
        new_price: item.price,
        old_price: item.old_price,
        thumbnail: item.thumbnail,
        rating: item.rating,
        extracted_price: item.extracted_price,
        link: item.link,
    }));
    // res.send(result);
    res.status(200).json(result);
}
    catch(error){
        console.error("SerpApi error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
    
}) 

const ebay = asyncHandler(async(req,res)=>{
    const {query} =  req.body;
    if(!query){
        res.status(400);
        throw new Error("first search something");
    }
    const url = `https://serpapi.com/search.json?engine=ebay&_nkw=${query}&api_key=${process.env.API_KEY}`;
    try{
        const response = await axios.get(url);
    if(!response){
        res.status(500);
        throw new Error("Fail to fetch product data")
    }
    const result = response.data.organic_results?.map((item)=>({
        title : item.title,
        website: "ebay",
        logo:"https://static.wixstatic.com/media/868f94_84f8a34aa54749eeab57e07196d97ef1~mv2.jpg",
        new_price: item.price.raw || item.price.from.raw,
        // old_price: item.old_price.raw || item.old_price.from.raw || new_price+30,
        rating: item.rating || "4.2",
        link: item.link
    }));
    // res.send(result);
    res.status(200).json({result});
}
    catch(error){
        console.error("SerpApi error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
    
}) 

module.exports = {amazon,ebay};