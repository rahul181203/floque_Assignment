export interface employeData {
    _count:    number;
    _avg:      Avg;
    work_year: number;
  }
  
interface Avg{
    salary_in_usd:number
  }
  
export interface Analysis {
    _count:    number;
    job_title: string;
}

