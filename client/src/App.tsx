import { Container, Heading, Table } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from "react-apexcharts";

interface employeData {
  _count:    number;
  _avg:      Avg;
  work_year: number;
}

interface Avg{
  salary_in_usd:number
}

interface Analysis {
  _count:    number;
  job_title: string;
}

function  App(){
  const [data,setData] = useState<employeData[]|any>([]);
  const [num,setNum] = useState({open:false,curNum:-1});
  const [analysis,setAnalysis] = useState<Analysis[]|any>([]);
  const [order, setOrder] = useState("DESC");

  var options = {
    options: {
      title:{
        text:"Number of Jobs in a year",
        align:'center',
        style:{
          fontSize:"20px"
        }
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
      }
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
                          <Table.Root size={'2'} className=' w-full' variant='surface' layout={'auto'}>
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
                        </>
                      }
                      </Table.Row>
                      </>
                    );
                  })
                }
            </Table.Body>
        </Table.Root>
        <Heading size={'7'} m={'4'}>Chart</Heading>
        <Chart options={options.options} series={options.series} type='line' height={'500'} ></Chart>
      </Container>
    </>
  );
}

export default App;
