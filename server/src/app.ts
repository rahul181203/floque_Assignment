import express,{Express,Request,Response} from "express";
import dotenv from "dotenv";
import cors from "cors"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app:Express = express();

app.use(cors())
app.use(express.json())

app.get("/",async(req:Request,res:Response)=>{
    res.status(200).json({message:"Running succesfully"});
})

app.get("/getData",async(req:Request,res:Response)=>{
    const data = await prisma.employee.groupBy({
        by:['work_year'],
        _count:true,
        _avg:{salary_in_usd:true},
        orderBy:{
            work_year:"asc"
        }
    })
    res.status(200).json({data});
})

app.get("/getAnalysis",async(req:Request,res:Response)=>{
    const year = req.query.year as string;
    const data = await prisma.employee.groupBy({
        where:{
            work_year:Number.parseInt(year)
        },
        by:['job_title'],
        _count:true,
        orderBy:{
            job_title:"asc"
        }
    })
    // console.log(req);
    res.status(200).json({data});
})

export default app;