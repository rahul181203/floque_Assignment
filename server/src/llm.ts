import * as dot from "dotenv";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import {RetrievalQAChain} from "langchain/chains"
import { OpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {Document} from "langchain/document";
import { Http2ServerResponse } from "http2";


dot.config();


const askModel=async(question:String,csvContents:any)=>{
    const model = new OpenAI({apiKey:process.env.APIKEY})
        let vectorstore;
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize:1000,
            chunkOverlap:900,
        });
        console.log("Text splitting...");
        console.log(`chunk size ----> ${textSplitter.chunkSize}`);
        console.log(`chunk overlap ----> ${textSplitter.chunkOverlap}`);

        const splitdocs = await textSplitter.createDocuments(csvContents);
        try{
            vectorstore = await HNSWLib.fromDocuments(
                splitdocs,
                new OpenAIEmbeddings({apiKey:process.env.APIKEY})
            )
            await vectorstore.save("MyVectore.index");
            console.log("vector store is created");

            const chain = RetrievalQAChain.fromLLM(model,vectorstore.asRetriever());
            console.log("Querying....");
            const res = await chain.call({query:question})
            return res;
        }catch(e){
            return String(e);
        }
        
}

export const CheckLLM=async(question:string)=>{
    const loader = new CSVLoader("../docs/salaries.csv")
    const docs = await loader.load()
    // console.log(docs);
    const csvcontent = docs.map((doc:Document)=>doc.pageContent)
    // console.log(csvcontent);
    return askModel(question,csvcontent);
}
