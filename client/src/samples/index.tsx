import { INumberType, IToDo, IToDoList } from "../types";

export const ToDoArray: IToDo[] = [
  {
    name: "Create some subtask",
    value: false
  },
  {
    name: "Create another subtask",
    value: true
  },
  {
    name: "This subtask is omg",
    value: false
  }
]

export const ToDoListSample = new IToDoList(ToDoArray)

export const NumberTypeSample = new INumberType('asd', false, 0, 5, 10)

export const dailyStats = {
  labels: ["01-02", "02-03", "03-04", "04-05", "05-06", "06-07", "07-08", "09-10", "10-11", 
  "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19", "19-20", "20-21", 
  "21-22", "22-23", "23"],
  datasets: [
    {
      label: "Tasks finished",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      backgroundColor: "#02b844",
      borderWidth: 1,
      borderColor: "#000000",
    }
  ]
}

export const weeklyStats = {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: [
    {
      label: "Tasks finished",
      data: [0, 2, 5, 3, 1, 4, 6],
      backgroundColor: "#02b844",
      borderWidth: 1,
      borderColor: "#000000",
    }
  ]
}

export const monthlyStats = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"
  , "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
  datasets: [
    {
      label: "Tasks finished",
      data: [0, 2, 3, 3, 2, 1, 4, 5, 3, 2, 3, 4, 1, 5, 6, 3, 
      1, 0, 5, 3, 1, 5, 5, 1, 2, 4, 1, 7, 3, 5, 2, 1],
      backgroundColor: "#02b844",
      borderWidth: 1,
      borderColor: "#000000",
    }
  ]
}

export const annualStats = {
  labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  datasets: [
    {
      label: "Tasks finished",
      data: [0, 2, 3, 3, 2, 1, 4, 5, 3, 2, 3, 4],
      backgroundColor: "#02b844",
      borderWidth: 1,
      borderColor: "#000000",
    }
  ]
}