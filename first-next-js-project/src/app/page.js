"use client"; // Bileşenin istemci tarafında çalıştığını belirtir
import React, { useState } from "react"; // React ve useState hook'unu içe aktarır

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [doneTodos, setDoneTodos] = useState([]); // "Done" sütununa taşınan görevler için state
  const [error, setError] = useState("");
  const [todoInput, setTodoInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const addTodo = () => {
    if (!todoInput || !startDate || !endDate) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setTodos([
      ...todos,
      { task: todoInput, status: "InProgress", startDate, endDate },
    ]);
    setTodoInput("");
    setStartDate("");
    setEndDate("");
    setError("");
  };

  const handleStatusChange = (index, status) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        const updatedTodo = { ...todo, status: status };
        if (status === "Done") {
          // "Done" olarak işaretlenen göreve "startDate" ve "endDate" özelliklerini ekle
          updatedTodo.startDate = new Date().toISOString().split("T")[0];
          updatedTodo.endDate = new Date().toISOString().split("T")[0];
        }
        return updatedTodo;
      }
      return todo;
    });

    setTodos(updatedTodos);

    if (status === "Done") {
      const doneTodo = updatedTodos[index];
      setDoneTodos([...doneTodos, doneTodo]);

      const filteredTodos = updatedTodos.filter((_, i) => i !== index);
      setTodos(filteredTodos);
    }
  };

  const handleDelete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSaveEdit = (index, editedTodo) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = editedTodo;
    setTodos(updatedTodos);
    setEditIndex(null);
  };

  return (
    <main className="p-0 m-0 gap-2 d-grid ">
      {/* <nav class="navbar bg-body-tertiary pt-0 mt-0">
     <div class="container-fluid">
      <a class="navbar-brand">Navbar</a>
      <form class="d-flex" role="search">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> 
      <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      </div>
      </nav> */}
      <div className="row gap-2 justify-content-center position-fixed vh-100 container ">
        <div className="bg-primary bg-opacity-50 col-12 col-md-2 overflow-auto p-0 text-center rounded shadow-lg ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
            }}
          >
            <h3 className="bg-primary pos">Add ToDo</h3>
            <div className="d-grid justify-content-center align-items-center">
              <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="Yeni Todo Girin"
                className="form-control mb-3"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Başlangıç Tarihi"
                className="form-control mb-3"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Bitiş Tarihi"
                className="form-control mb-3"
              />
              <button type="submit" className="btn btn-primary">
                Ekle
              </button>
              {error && <div className="error-message mt-3">{error}</div>}
            </div>
          </form>
        </div>
        <div className="bg-primary bg-opacity-50 col-12 col-md-5 overflow-auto p-0 text-center rounded shadow-lg h-100">
          <h3 className="bg-primary">Todo List</h3>
          <table className="table">
            <thead className="">
              <tr>
                <th scope="col">Task</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, index) => (
                <tr key={index}>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={todo.task}
                        onChange={(e) =>
                          handleSaveEdit(index, {
                            ...todo,
                            task: e.target.value,
                          })
                        }
                      />
                    ) : (
                      todo.task
                    )}
                  </td>
                  <td>{todo.startDate}</td>
                  <td>{todo.endDate}</td>
                  <td>
                    <select
                      value={todo.status}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="InProgress">InProgress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td>
                    {editIndex === index ? (
                      <button
                        onClick={() => handleSaveEdit(index, todo)}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={() => handleEdit(index)}
                          className="btn btn-warning"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-primary bg-opacity-50 col-12 col-md-4 overflow-auto p-0 text-center rounded shadow-lg">
          <h3 className="bg-primary">Done</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Task</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
              </tr>
            </thead>
            <tbody>
              {doneTodos.map((todo, index) => (
                <tr key={index}>
                  <td>{todo.task}</td>
                  <td>{todo.startDate}</td>
                  <td>{todo.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
