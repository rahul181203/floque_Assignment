import app from "./app";

const port:string = '7777'
app.listen(port,()=>{
    console.log(`server listing on port: ${port}`);
})