import React, { useState, useEffect} from 'react';
import { MDBContainer } from 'mdbreact';
import { Bar } from 'react-chartjs-2';
import Button from 'react-bootstrap/Button';
import { fetchCompletedTasks } from '../services/api';
import { getUserIdFromToken } from '../helpers';
import { ITask } from '../types';
import useToken from '../hooks/useToken';
import 'chart.js/auto';
import '../App.css';

type CompletedTask = {
  date: Date;
  completedTasks: number;
};

export const Statistics: React.FC = () => {
  const [currentView, setCurrentView] = useState("week");
  const [topText, setTopText] = useState("");

  const { token } = useToken();
  const userId = getUserIdFromToken(token ?? '') ?? '';

  const formatChartData = (labels: any[], data: number[]) => {
    return {
      labels: labels,
      datasets: [
        {
          label: 'Tasks finished',
          data: data,
          backgroundColor: '#02b844',
          borderWidth: 1,
          borderColor: '#000000',
        },
      ],
    };
  };

  const weeklyLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const monthlyLabels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const annualLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const [weeklyChartData, setWeeklyChartData] = useState(formatChartData(weeklyLabels, Array(7).fill(0)));
  const [monthlyChartData, setMonthlyChartData] = useState(formatChartData(monthlyLabels, Array(31).fill(0)));
  const [annualChartData, setAnnualChartData] = useState(formatChartData(annualLabels, Array(12).fill(0)));

  const [currentDate, setCurrentDate] = useState(new Date());

  const [completedTasks, setCompletedTasks] = useState([]);

  const [data, setData] = useState(weeklyChartData);

  const getWeekStartEnd = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Sets the start to Monday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sets the end to Sunday
    return { start, end };
  };
  
  const getMonthStartEnd = () => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { start, end };
  };
  
  const getYearStartEnd = () => {
    const start = new Date(currentDate.getFullYear(), 0, 1);
    const end = new Date(currentDate.getFullYear(), 11, 31);
    return { start, end };
  };

  const updateTopText = () => {

    const currentWeek = getWeekStartEnd();
    const currentMonth = getMonthStartEnd();
    const currentYear = getYearStartEnd();


    if(currentView === "week") {
      const newText = annualLabels[currentWeek.start.getMonth()] + '.' + currentWeek.start.getDate() + '-' + annualLabels[currentWeek.end.getMonth()] + '.' + currentWeek.end.getDate();
      setTopText(newText);
    }
    if(currentView === "month") setTopText(annualLabels[currentMonth.start.getMonth()]);
    
    if(currentView === "year") setTopText(currentYear.start.getFullYear().toString());

  }

  const processCompletedTasksData = () => {
    console.log('Processing data...');
    console.log('currentDate:', currentDate);
    updateTopText();
  
    const updatedWeeklyData = Array(7).fill(0);
    const updatedMonthlyData = Array(31).fill(0);
    const updatedAnnualData = Array(12).fill(0);
  
    const currentWeek = getWeekStartEnd();
    const currentMonth = getMonthStartEnd();
    const currentYear = getYearStartEnd();
  
    console.log('currentWeek:', currentWeek);

    console.log(completedTasks)
  
    completedTasks.forEach((completed: CompletedTask) => {
      const completionDate = completed.date;
      const tasksCompleted = completed.completedTasks
      if (!completionDate) return;
  
      const date = new Date(completionDate);
  
      if (date >= currentWeek.start && date <= currentWeek.end) {
        const weekDay = date.getDay();
        const weekKey = weekDay === 0 ? 6 : weekDay - 1;
        updatedWeeklyData[weekKey] += tasksCompleted;
      }
  
      if (date >= currentMonth.start && date <= currentMonth.end) {
        const day = date.getDate();
        const monthKey = day - 1;
        updatedMonthlyData[monthKey] += tasksCompleted;
      }
  
      if (date >= currentYear.start && date <= currentYear.end) {
        const month = date.getMonth();
        const yearKey = month;
        updatedAnnualData[yearKey] += tasksCompleted;
      }
    });
  
    console.log('--------------------------------------------');
  
    setWeeklyChartData(formatChartData(weeklyLabels, updatedWeeklyData));
    setMonthlyChartData(formatChartData(monthlyLabels, updatedMonthlyData));
    setAnnualChartData(formatChartData(annualLabels, updatedAnnualData));
  
  };
  

  const fetchData = async () => {
    const completeTasks = await fetchCompletedTasks(userId);
    setCompletedTasks(completeTasks);
  };

  const updateCurrentData = () => {
    switch (currentView) {
      case 'week':
        setData(weeklyChartData);
        break;
      case 'month':
        setData(monthlyChartData);
        break;
      case 'year':
        setData(annualChartData);
        break;
    }
  };

  const setWeekly = () => {
    setCurrentView("week");
  };
  const setMonthly = () => {
    setCurrentView("month");
  };
  const setAnnual = () => {
    setCurrentView("year");
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    console.log('completedTasks or currentDate changed');
    processCompletedTasksData();
  }, [completedTasks, currentDate]);

  useEffect(() => {
    console.log("chartData changed");
    updateTopText();
    updateCurrentData();
  }, [weeklyChartData, monthlyChartData, annualChartData, currentView]);

  


  const previousPeriod = () => {
    let newDate;
    switch (currentView) {
      case "week":
        newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
        break;
      case "month":
        newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
        break;
    }
  };

  const nextPeriod = () => {
    let newDate;
    switch (currentView) {
      case "week":
        newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
        break;
      case "month":
        newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
        break;
    }
  };

  return (
    <>
      <p>{topText}</p>
      <MDBContainer>
        <Bar data={data} style={{ maxHeight: '600px' }} />
      </MDBContainer>
      <div>
        <Button size="sm" onClick={previousPeriod}>
          &lt;
        </Button>
        <Button size="sm" onClick={() => setWeekly()}>
          W
        </Button>
        <Button size="sm" onClick={() => setMonthly()}>
          M
        </Button>
        <Button size="sm" onClick={() => setAnnual()}>
          Y
        </Button>
        <Button size="sm" onClick={nextPeriod}>
          &gt;
        </Button>
      </div>
    </>
  );
};

export default Statistics;
         

