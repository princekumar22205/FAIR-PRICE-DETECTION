import React, { useState } from 'react';
import { Search, TrendingDown, TrendingUp, Bell, Heart, MapPin, BarChart2, Camera, Package, Store, ExternalLink, X, Settings, ShoppingCart, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
// import ProductCard from './ProudctCard';

const FairPriceApp = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [data,setdata] = useState([]);
  const [watchlist,setWatchlist] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [productEbay, setProductEbay] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const [detail,Setdetail] = useState([]);

  const handlingSearch = async (query)=>{
    try{
      setIsLoading(true);          
      setdata([]);                  
      const response = await axios.post('/api/search/amazon',{query});
      const responseEbay = await axios.post('/api/search/ebay',{query});
      
      setProductEbay(responseEbay.data.result[0]);
      setdata(response.data);
      setWatchlist([]);
    }
    catch(error){
      console.error('search error:',error);
    }finally {
      setIsLoading(false);          // ← Hide spinner
    }
  }
  const createPriceAlert = () => {
    if (selectedProduct && targetPrice) {
      setPriceAlerts(prev => [...prev, {
        id: Date.now(),
        productId: selectedProduct.position,
        productName: selectedProduct.title,
        targetPrice: parseFloat(targetPrice),
        currentPrice: selectedProduct.new_Price,
      }]);
      setShowAlertModal(false);
      setTargetPrice('');
    }
  };
  // const compare_price = async(query)=>{
  //   try{
  //     const response = await axios.post('/api/search/ebay',{query});
  //     console.log(response.data);
  //     setProductDetail((prev)=>{
  //       return [...prev,response.data];
  //     })
  //   }
  //   catch(error){
  //     console.error(error);
  //   }
  // }

  const toggleWatchlist = (product)=>{
    setWatchlist((prev)=>{
      
      const exist = prev.find((p)=> p.position === product.position);
      if(exist){
       return prev.filter((p)=> p.position !== product.position);
      }
      
        return [...prev, product];
      
    });
  };

  const isInWatchlist = (productId)=>{
    return watchlist.some(prev=>prev.position === productId)
  }


//product card------------------------->

  const ProductCard = ({ product }) => (
    <div 
      onClick={() => {
        setSelectedProduct(product);
        setActiveTab('details');
      }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 overflow-hidden group"
    >
      <div className="relative">
        <div className="w-60 h-70 pl-10 flex items-center justify-center">
        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="object-cover  group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <Package className="w-16 h-16 text-gray-400" />
        )}
      </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(product);
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart className={`w-5 h-5 ${isInWatchlist(product.position) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
          product.trend === 'down' ? 'bg-green-500' : product.trend === 'up' ? 'bg-red-500' : 'bg-gray-500'
        }`}>
          {product.trend === 'down' && <TrendingDown className="w-3 h-3 inline mr-1" />}
          {product.trend === 'up' && <TrendingUp className="w-3 h-3 inline mr-1" />}
          {product.trend === 'down' ? 'Price Down' : product.trend === 'up' ? 'Price Up' : 'Stable'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600">{product.new_price}</span>
          {/* <span className="text-sm text-gray-500 line-through">${product.avgPrice}</span> */}
        </div>
         
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-600">
            {/* Best time: <span className="font-semibold text-gray-900">{product.bestTimeToBuy}</span> */}
          </span>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={()=>{setActiveTab('search')}}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" >
                Fair Price
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'search' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Search className="w-5 h-5 inline mr-2" />
                Search
              </button>
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'watchlist' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5 inline mr-2" />
                Watchlist
                <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">{watchlist.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Find the Best Prices</h1>
              <p className="text-indigo-100 mb-6">Compare prices across stores and track price history</p>
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products by name, barcode, or upload image..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e)=>{
                      if(e.key === 'Enter'){
                        handlingSearch(searchQuery);
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                {/* <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Scan
                </button> */}
              </div>
            </div>

{/*----Product Grid - Empty State -------*/}

            <>
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" 
                    style={{ animationDirection: 'reverse', animationDuration: '1s' }}>
                </div>
              </div>
              <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">Searching products...</p>
              <p className="mt-2 text-sm text-gray-500">Finding the best prices for you</p>
            </div>
          ) : (       
            <>
              {data && data.length >0 ?
              
              (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{
                data.map((product,idx) => (

                  
                <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 overflow-hidden group " onClick={()=>{setActiveTab('details'); setProductDetail(product); }}>
                  <div className="relative ">
                    <div className="w-60 h-70 pl-10 flex items-center justify-center">
                      {product.thumbnail?(
                        <img src={product.thumbnail} alt={product.name} className=" object-fix group-hover:scale-105 transition-transform" />
                      ):(
                      <Package className="w-16 h-16 text-gray-400" /> 
                      )}
                      
                    </div>
    {/* ----watchlist button ----------------*/}
                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer " onClick={(e)=>{
                      e.stopPropagation();
                      toggleWatchlist(product);
                      }}>
                      <Heart className={`w-6 h-6 ${isInWatchlist(product.position)? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>

                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                    ★  {product.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</div>
                    <div className="flex items-baseline gap-2 ">
                      <div className="h-8 text-bold  rounded w-20">
                      </div>
                      {/* <div className="h-4 rounded w-16">{product.old_price}</div> */}
                    </div>
                     <div className="flex items-center justify-between text-sm">
                      {/* <div className="h-4 rounded w-24">kdkdn</div> */}
                    </div> 
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-1xl font-bold text-indigo-600">BEST:{product.new_price}</div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ):(
              // <>
              
              // {[1,2,3,4,5,6,7,8,9,10].map((item) => (
              //   <div key={item} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 overflow-hidden group ">
              //     <div className="relative ">
              //       <div className="w-60 h-70 pl-10 flex items-center justify-center">
              //         <Package className="w-16 h-16 text-gray-400" />
              //       </div>
              //       <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
              //         <Heart className="w-5 h-5 text-gray-400" />
              //       </button>
              //       <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gray-500">
              //         Stable
              //       </div>
              //     </div>
              //     <div className="p-4">
              //       <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
              //       <div className="flex items-baseline gap-2 mb-3">
              //         <div className="h-8 bg-gray-300 rounded w-20"></div>
              //         <div className="h-4 bg-gray-200 rounded w-16"></div>
              //       </div>
              //       <div className="flex items-center justify-between text-sm">
              //         <div className="h-4 bg-gray-200 rounded w-24"></div>
              //         <div className="h-4 bg-gray-200 rounded w-16"></div>
              //       </div>
              //       <div className="mt-3 pt-3 border-t border-gray-100">
              //         <div className="h-3 bg-gray-200 rounded w-32"></div>
              //       </div>
              //     </div>
              //   </div>

              // ))}
            
              // </>
              // <div className="col-span-full text-center py-12 text-gray-500">
              //     Search for products to see results
              // </div>
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-indigo-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Discover the Best Deals
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Search for any product to compare prices across multiple online stores. 
                    We'll help you find the lowest prices, track price history, and alert you when prices drop.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <TrendingDown className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Compare Prices</h3>
                      <p className="text-sm text-gray-600">
                        Instantly compare prices from Amazon, Flipkart, and more
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Price Alerts</h3>
                      <p className="text-sm text-gray-600">
                        Get notified when products reach your target price
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <BarChart2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Track History</h3>
                      <p className="text-sm text-gray-600">
                        View price trends and find the best time to buy
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3">Try searching for popular items:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['iPhone 15', 'Samsung Galaxy', 'Sony Headphones', 'MacBook Air', 'iPad Pro'].map((keyword) => (
                        <button
                          key={keyword}
                          onClick={() =>  handlingSearch(keyword)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                  
            )}
</>
          )}
            </>
          </div>
        )}
        

{/*----- Product Details Tab ------------------*/}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTab('search')}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
              ← Back to search
            </button>

            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="w-full h-96  rounded-xl flex items-center justify-center">
                  <img src={productDetail.thumbnail} className=" h-70 object-cover hover:scale-105 transition-transform"/>
                </div>
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Category</span>
                      <h1 className="text-3xl font-bold text-gray-900 mt-1">{productDetail.title.split(",")[0]}</h1>
                    </div>
                    <button className="p-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"onClick={(e)=>{
                      e.stopPropagation();
                      toggleWatchlist(productDetail);
                      }}>
                      <Heart className={`w-6 h-6 ${isInWatchlist(productDetail.position)? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold text-indigo-600">{productDetail.new_price}</span>
                      <span className="text-lg text-gray-400 line-through">{productDetail.old_price}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">Lowest:{productDetail.new_price}</span>
                      {/* <span className="text-gray-500">Avg: $1049</span> */}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                    <div className="grid grid-cols-2 gap-3  text-gray-1000 ">
                      {productDetail.title}
                      {/* <div className="h-4 bg-gray-200 rounded "> {productDetail.title}</div> */}
                      {/* <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div> */}
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2" 
                  onClick={() => {setShowAlertModal(true); 
                                  setSelectedProduct(productDetail);
                  }}>
                    <Bell className="w-5 h-5" />
                    Set Price Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Price History</h2>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                  Best time: Now
                </span>
              </div>
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            {/* Store Comparison */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Available Stores</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('online')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'online' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setFilterType('local')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'local' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Nearby  
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {[productDetail,productEbay].map((store, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                        <img src={store.logo} className='w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl'/>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{store.website}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="text-green-600">In Stock</span>
                          <span>•</span>
                          <span>★ {store.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{store.new_price}</div>
                        <span className="text-xs text-green-600 font-medium">Best Price</span>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2" onClick={()=>{
                        window.open(`${store.link}`,"blank")
                      }}>
                        Visit
                        {/* <ExternalLink className="w-4 h-4" /> */}
                      </button>
                    </div>
                  </div>
                ))}

                {[productDetail].map((store, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                        <img src='https://play-lh.googleusercontent.com/0-sXSA0gnPDKi6EeQQCYPsrDx6DqnHELJJ7wFP8bWCpziL4k5kJf8RnOoupdnOFuDm_n=w240-h480-rw' className='w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl'/>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">flipkart</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="text-green-600">In Stock</span>
                          <span>•</span>
                          <span>★ {}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${store.extracted_price +20}</div>
                        <span className="text-xs text-green-600 font-medium">Best Price</span>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2" onClick={()=>{
                        window.open(`https://www.flipkart.com/search?q=${store.title}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`,"blank")
                      }}>
                        Visit
                        {/* <ExternalLink className="w-4 h-4" /> */}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

{/* --Watchlist Tab -----*/}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
              <span className="text-gray-500">{watchlist.length} products</span>
            </div>

            {watchlist.length === 0 ? (<div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Your watchlist is empty</p>
              <button
                onClick={() => setActiveTab('search')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Browse products
              </button>
            </div>
            ):(
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {watchlist.map(product => (
                  <ProductCard key={product.position} product={product} />
                ))}
              </div>
            )}
            

            {/* Price Alerts Section */}
            {priceAlerts.length > 0 ?(
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Price Alerts</h2>
                <div className="space-y-3">
                  {priceAlerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.productName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Alert when price drops to <span className="font-bold text-green-600">${alert.targetPrice}</span>
                          <span className="text-gray-400 ml-2">(Current: ${alert.currentPrice})</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => setPriceAlerts(prev => prev.filter(a => a.id !== alert.id))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ):(
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Price Alerts</h2>
                <div className="text-center py-10">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active price alerts</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Active Stores</h3>
                  <Store className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-4xl font-bold">3</p>
                <p className="text-blue-100 text-sm mt-2">24 pending integration</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Products Tracked</h3>
                  <Package className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-4xl font-bold">{track}</p>
                <p className="text-green-100 text-sm mt-2">+89 this week</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Price Updates</h3>
                  <BarChart2 className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-4xl font-bold">98.2%</p>
                <p className="text-purple-100 text-sm mt-2">Last 24 hours</p>
              </div>
            </div>

            {/* Store Connectors */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Store Connectors Status</h2>
              <div className="space-y-3">
                {[
                  { name: 'Amazon India', status: 'active', sync: '2 min ago' },
                  { name: 'Flipkart', status: 'active', sync: '3 min ago' },
                  { name: 'ebay', status: 'active', sync: '5 min ago' },
                ].map((store, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${store.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="font-semibold text-gray-900">{store.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {store.status === 'active' ? 'Active' : 'Pending'} • Last sync: {store.sync}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-700">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Monitoring */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pipeline Monitoring</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data Ingestion Queue</span>
                  <span className="font-semibold">127 items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{width: '67%'}}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-center">
                  <div>
                    <p className="text-gray-500">Processing</p>
                    <p className="font-bold text-blue-600">45</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completed</p>
                    <p className="font-bold text-green-600">1,203</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Failed</p>
                    <p className="font-bold text-red-600">12</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        )}
      </div>
      
        {showAlertModal && (
          
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Set Price Alert</h2>
              <button onClick={() => setShowAlertModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Get notified when the price of <span className="font-semibold">{selectedProduct.title.split(",")[0]}</span> drops to your target price.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Price ($)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {selectedProduct && (
                <p className="text-sm text-gray-500 mt-2">
                  Current price: <span className="font-semibold">{selectedProduct.new_price}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPriceAlert}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default FairPriceApp;