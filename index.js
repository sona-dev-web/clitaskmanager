import inquirer from "inquirer"; 
import chalk, { Chalk } from "chalk";  
import data from './json.json' with {type: 'json'}
import {readFile, writeFile} from 'fs/promises'
import { existsSync, readFileSync } from "fs";
import { json } from "stream/consumers";
const path = './json.json'
if(!existsSync(path)){
  writeFile(path, JSON.stringify([]))
}
let DB = JSON.parse(readFileSync(path, 'utf8'))

const saveData = () => {
  writeFile(path, JSON.stringify(DB, null, 2))
}

const mainMenu = async () => {
  const answers = await inquirer.prompt([{
  type: 'list',
  name: 'option',
  message: chalk.bgMagentaBright('Welcome to the CLI Task Manager, what would you like to do?'),
  choices: ['Add', 'Delete', 'Update', 'List', 'Mark Status']
  }]
  )
switch(answers.option) {
  case "Add":
    addTask()
    break;
  case "Update":
    updateTask()
    break;
  case "Delete":
    deleteTask()
    break;
  case "List":
    showList()
    break;
  case "Mark Status":
    markIfDone()
    break;
  }
}
mainMenu()

/////////// FUNCTIONS ////////////

  async function addTask() {
  const addToList = await inquirer.prompt([{
    type: 'input',
    name: 'addingToList',
    message: 'What task would you like to add?'

  }])
  DB.push({ task: addToList.addingToList, done: false, id: DB.length, status: 'To do'});
  saveData();
  console.log(chalk.green('Todo added successfully!'));
};

async function deleteTask(){
  if(DB.length === 0){
    console.log("There's no task to delete")
    return;
  } const deleteFromList = await inquirer.prompt([{
    type: 'list',
    name: 'delete',
    message: 'Which task would you like to delete?',
    choices: DB.map((toDo, index)=> ({name: toDo.task, value: index}))
  }])
  const index = deleteFromList.delete
  console.log(index)
  if(index >= 0 && index < DB.length){
    DB.splice(index, 1)
  saveData();
  console.log(chalk.green('Todo deleted successfully!'));
}else {
    console.log(chalk.red('Invalid index.'));
}}

async function updateTask() {
  if(DB.length === 0){
    console.log("There's no task to update")
  } const updateFromList = await inquirer.prompt([{
    type: 'list',
    name: 'update',
    message: 'Which task would you like to update?',
    choices: DB.map((toDo, index)=> ({name: toDo.task, value: index}))
    
  },{
      type:'input',
      name: 'newTask',
      message: 'Update the task:',
      validate: input => input.trim() ? true : 'Description cannot be empty'
  }]
  ); 
  
  const index = updateFromList.update;
  if(index >= 0 && index < DB.length){
    DB[index].task = updateFromList.newTask;
    saveData();
    console.log(chalk.green('Todo updated successfully!'));
  } else {
      console.log(chalk.red('Invalid index.'));
  }
  }

  async function showList(){
  DB.forEach(data => {
      console.log(data.task)
    })
  }

  async function markIfDone() {

    if(DB.length === 0){
      console.log("There's no task to update")
      return;
    }
    const doneOrProgress = await inquirer.prompt([{
      type: 'list',
      name: 'doneornot',
      message: 'Which task status would you like to update?',
      choices: DB.map((toDo, index)=> ({name: toDo.task, value: index}))
},
{
  type: 'list',
  name: 'update',
  message: 'What is the new status?',
  choices: ['Todo', 'In Progress', 'Done']
}])

const newStatus = await doneOrProgress.update
const index = doneOrProgress.doneornot
DB[index].status = newStatus;
saveData();

  }
