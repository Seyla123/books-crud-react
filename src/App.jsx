// src/App.js
import 'primereact/resources/themes/saga-blue/theme.css';  // theme
import 'primereact/resources/primereact.min.css';           // core css
import 'primeicons/primeicons.css';                         // icons
import 'primeflex/primeflex.css';   
import React, { useState,useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';



function App() {
  const fetchTodo = async ()=>{
      const response = await axios.get('http://localhost:3001/todos');
      setTodos(response.data);
  }
//format datetime
const formatDateTime = () => {
  const d = new Date
 const date = new Date(d);
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 
 const day = String(date.getDate()).padStart(2, '0');
 const month = months[date.getMonth()];
 const year = date.getFullYear();
 const hours = date.getHours() % 12 || 12; // Convert 24-hour time to 12-hour time
 const minutes = String(date.getMinutes()).padStart(2, '0');
 const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

 return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
};
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(false);
  useEffect(()=>{
    fetchTodo();
  },[])

  const addTodo = async () => {
    const dateTime = formatDateTime();

    if (task.trim()) {
      await axios.post("http://localhost:3001/todos", {
        task,date:dateTime
      })
      setTodos([...todos, { task }]);
      setTask('');
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:3001/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo =  (todo) => {

    // console.log(todo.id,todo.task);
    setTask(todo.task);
    setSelectedTodo(todo);
    setIsEditing(true);

  };

  const saveTodo = async() => {
    setTodos(todos.map(todo => (todo.id === selectedTodo.id ? { ...todo, task } : todo)));
    setTask('');
    setIsEditing(false);
    setSelectedTodo(null);
    await axios.put(`http://localhost:3001/todos/${selectedTodo.id }`,{
      task:task,
    });
  };

  const readTodo = (todo) => {
    setSelectedTodo(todo);
    setDisplayDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTodo(rowData)} />
        <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-mr-2" onClick={() => readTodo(rowData)} />
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => deleteTodo(rowData.id)} />
      </div>
    );
  };

  return (
    <div className="p-d-flex p-flex-column p-ai-center p-p-4">
      <h2>Todo App</h2>
      <div className="p-inputgroup p-mb-4">
        <InputText value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a new task" />
        {isEditing ? (
          <Button label="Save" icon="pi pi-check" onClick={saveTodo} />
        ) : (
          <Button label="Add" icon="pi pi-plus" onClick={addTodo} />
        )}
      </div>
      <DataTable value={todos} emptyMessage="No tasks found." className="p-mt-2">
        <Column field="task" header="Task"></Column>
        <Column field="date" header="Date"></Column>
        <Column body={actionBodyTemplate} header="Actions"></Column>
      </DataTable>
      <Dialog header="Todo Details" visible={displayDialog} style={{ width: '50vw' }} onHide={() => setDisplayDialog(false)}>
        <p>{selectedTodo?.task}</p>
      </Dialog>
    </div>
  );
}

export default App;
