export const NUMBER_TYPE = "Number Type"
export const TODO_TYPE = "ToDo Type"
export const BOOLEAN_TYPE = "Boolean Type"

export interface IGoal {
  name: string
  goalId: string
  goalAchieved: boolean
  tasks: ITask[]
  imgUrl?: string
  completionDate?: Date;
  tags: string[];
}

export interface ITask {
  name: string
  value: IToDoList | INumberType | IBooleanType
  taskComplete: boolean
  recurring: boolean
  goalId: string
  userId: string
  taskId: string
  taskType: string
  completionDate?: Date; 
}

export class IToDoList {
  value: IToDo[]
  constructor(value: IToDo[]) {
    this.value = value
  }
}

export interface IToDo {
  name: string
  value: boolean
}

export class INumberType {
  name: string
  value: boolean
  initialValue: number
  currentValue: number
  targetValue: number
  constructor(name: string, value: boolean, initialValue: number, currentValue: number, targetValue: number) {
    this.name = name
    this.value = value
    this.initialValue = initialValue
    this.currentValue = currentValue
    this.targetValue = targetValue
  }
}

export class IBooleanType {
  name: string;
  value: boolean;

  constructor(name: string, value: boolean) {
    this.name = name;
    this.value = value;
  }
}



export interface IFetchedTask {
  completionDate: Date;
  createdAt: Date; 
  goalId: string;
  userId: string
  id: string;
  name: string;
  recurring: boolean;
  taskComplete: boolean;
  taskId: string
  taskType: string
  updatedAt: Date
  value: any
}
