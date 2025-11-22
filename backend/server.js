const express = require('express')
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/search/', require('./routes/search'));


app.listen(port,()=>{
    console.log(`server is running ${port}`);
})