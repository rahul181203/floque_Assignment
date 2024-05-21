import { Button, Container, Flex, Heading, Spinner, Table, TextArea,Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from "react-apexcharts";
import {employeData,Analysis} from "./models/dataModels"

function  App(){
  const [data,setData] = useState<employeData[]|any>([]);
  const [num,setNum] = useState({open:false,curNum:-1});
  const [analysis,setAnalysis] = useState<Analysis[]|any>([]);
  const [order, setOrder] = useState("DESC");
  const [response,setResponse] = useState("");
  const [question,setQuestion] = useState("");

  var chart = {
    options: {
      title:{
        text:"Number of Jobs in a year",
        style:{
          fontSize:"20px"
        },
        align:"center",
      },
      chart: {
        background:"rgb(229, 231, 235)",
        id: "basic-line",
        foreColor: '#000000'
      },
      markers:{
        size:5
      },
      tooltip:{
        enabled:true,
        theme:"dark",
      },
      colors: ['#E91E63'],
      fill: {
        colors: ['#1A73E8', '#B32824']
      },
      xaxis: {
        title:{text:"Year",style:{
          fontSize:"16px"
        }},
        categories: data.map((e:employeData,i:number)=>e.work_year)
      },
      yaxis:{
        title:{text:"Number of Jobs",style:{
          fontSize:"16px"
        }},
      },
    },
    series: [
      {
        name: "Number of Jobs",
        data: data.map((e:employeData,i:number)=>e._count)
      }
    ]
  }

  const sorting=(col:any)=>{
    if(order === "ASC"){
      const sorted = [...data].sort((a,b)=>a[col] > b[col] ? 1 : -1)
      setData(sorted);
      setOrder("DESC");
    }
    if(order === "DESC"){
      const sorted = [...data].sort((a,b)=>a[col] < b[col] ? 1 : -1)
      setData(sorted);
      setOrder("ASC");
    }
  }

  const sortingAnalysis=(col:any)=>{
    if(order === "ASC"){
      const sorted = [...analysis].sort((a,b)=>a[col] > b[col] ? 1 : -1)
      setAnalysis(sorted);
      setOrder("DESC");
    }
    if(order === "DESC"){
      const sorted = [...analysis].sort((a,b)=>a[col] < b[col] ? 1 : -1)
      setAnalysis(sorted);
      setOrder("ASC");
    }
  }

  useEffect(()=>{
    axios.get("https://floque-assignment-server.vercel.app/getData").then((e)=>setData(e.data.data));
  },[])

  async function getAnalysis(year:any){
    setAnalysis([]);
    await axios.get("https://floque-assignment-server.vercel.app/getAnalysis",{params:{year:year}}).then((e)=>setAnalysis(e.data.data))
  }

  async function getResponse(question:string){
    await axios.post("http://localhost:7777/getQuery",{question}).then((e)=>{setQuestion("");setResponse(e.data.response)})
  }
  
  return (
    <>
      <Container size={'4'} m={{initial:'4',md:'7',lg:'8'}}>
      <Heading size={'7'} align={'center'} mb={'5'}>Floquer - Technical Assignment</Heading>

        <Heading size={'7'} >Main Table</Heading>
        <Table.Root m={{initial:'4',md:'7',lg:'8'}} size={'3'} variant={'surface'} layout={'auto'}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell onClick={()=>sorting("work_year")} className='cursor-pointer' >Year</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell onClick={()=>sorting("_count")} className='cursor-pointer' >Number of total jobs for that year</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell onClick={()=>sorting("_avg.salary_in_usd")} className='cursor-pointer' >Average salary in USD</Table.ColumnHeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
              
                {
                  data.map((e:employeData,i:number)=>{
                    return (
                      <>
                      <Table.Row key={i} onClick={(f)=>{setNum({open:(i!==num.curNum)?true:!num.open,curNum:i});getAnalysis(e.work_year)}}>
                        <Table.Cell>{e.work_year}</Table.Cell>
                        <Table.Cell>{e._count}</Table.Cell>
                        <Table.Cell>{e._avg.salary_in_usd}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                      {
                        (i===num.curNum && num.open)&&
                        <>
                        <Table.RowHeaderCell></Table.RowHeaderCell>
                        <Table.Cell>
                          <Table.Root my={'3'} size={'2'} className=' w-full' variant='surface' layout={'auto'}>
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeaderCell onClick={()=>sortingAnalysis("job_title")} className='cursor-pointer' >Title of Job</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell onClick={()=>sortingAnalysis("_count")} className='cursor-pointer' >Number of total jobs for that year</Table.ColumnHeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {
                                analysis.map((e:Analysis,i:number)=>{
                                  return (
                                    <>
                                      <Table.Row align={'center'} key={i}>
                                        <Table.RowHeaderCell>{e.job_title}</Table.RowHeaderCell>
                                        <Table.Cell>{e._count}</Table.Cell>
                                      </Table.Row>
                                    </>
                                  );
                                })
                              }
                            </Table.Body>
                          </Table.Root>
                          {
                            (analysis.length === 0) && <Flex justify={'center'} align={'center'}><Spinner size={'3'} /></Flex>
                          }
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                        </>
                      }
                      </Table.Row>
                      </>
                    );
                  })
                }
            </Table.Body>
        </Table.Root>
              {
                (data.length === 0) && <Flex justify={'center'} align={'center'}><Spinner size={'3'} /></Flex>
              }
        <Heading size={'7'} m={'4'}>Chart</Heading>
        <Chart options={chart.options} series={chart.series} type='line' height={'500'} ></Chart>
        <Heading size={'7'} my={'4'}>Chat Bot</Heading>
        <TextArea placeholder='Enter the Query...' value={question} onChange={(e)=>setQuestion(e.target.value)} m={'4'}></TextArea>
        <Button m={'3'} onClick={(f)=>getResponse(question)}>Get Response</Button>
        <Text as='p' m={'3'} >{response}</Text>
      </Container>
    </>
  );
}

export default App;
