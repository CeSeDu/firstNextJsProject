"use client"; // Bileşenin istemci tarafında çalıştığını belirtir
import React, { useState, useEffect } from "react";
import { db } from '../../firebase/firebase.js';
import { collection, addDoc, onSnapshot } from 'firebase/firestore/lite';

export default function TodoList() {
  // State'lerin tanımlanması
  const [todos, setTodos] = useState([]); // Todo listesi
  const [doneTodos, setDoneTodos] = useState([]); // Tamamlanan görevlerin listesi
  const [error, setError] = useState(""); // Hata durumlarını saklamak için
  const [todoInput, setTodoInput] = useState(""); // Yeni todo girişi
  const [startDate, setStartDate] = useState(""); // Yeni todo'nun başlangıç tarihi
  const [endDate, setEndDate] = useState(""); // Yeni todo'nun bitiş tarihi
  const [editIndex, setEditIndex] = useState(null); // Düzenleme modunda olduğunuz todo'nun indeksi

  // Firestore'dan todo'ları alma işlemi
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todoCollection = db.collection('todos');
        const snapshot = await getDocs(todoCollection);
        const todoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTodos(todoList);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    fetchTodos();
  }, []); // Bileşen yüklendiğinde yalnızca bir kez çalışması için boş bağımlılık listesi kullanılır

  // Yeni todo ekleme fonksiyonu
 const addTodo = () => {
    if (!todoInput || !startDate || !endDate) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }
  
    addDoc(collection(db, 'todos'), {
      task: todoInput,
      status: "InProgress",
      startDate,
      endDate
    })
    .then((docRef) => {
      console.log("Todo başarıyla eklendi, eklendiği doküman ID:", docRef.id);
      setTodoInput("");
      setStartDate("");
      setEndDate("");
      setError("");
    })
    .catch((error) => {
      console.error("Todo eklenirken hata oluştu: ", error);
    });
  };

  // Firestore'dan todo'ları alma işlemi
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), snapshot => {
      const todoList = snapshot.docs.map(doc => doc.data());
      setTodos(todoList);
    }, error => {
      console.error('Error getting documents: ', error);
    });

    return unsubscribe;
  }, []);


  // Todo'nun durumunu değiştirme işlemi
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

  // Todo silme işlemi
  const handleDelete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  // Todo düzenleme işlemi
  const handleEdit = (index) => {
    setEditIndex(index);
  };

  // Düzenlenen todo'yu kaydetme işlemi
  const handleSaveEdit = (index, editedTodo) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = editedTodo;
    setTodos(updatedTodos);
    setEditIndex(null);
  };

  // JSX içinde render edilen bileşen
  return (
    <main className="p-0 m-0 gap-2 d-grid ">
      {/* Ana bileşen içeriği */}
      <div className="row gap-2 justify-content-center position-fixed vh-100 container ">
        {/* Yeni Todo Ekleme Formu */}
        <div className="bg-primary bg-opacity-50 col-12 col-md-2 overflow-auto p-0 text-center rounded shadow-lg ">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Formun varsayılan davranışını engelle
              addTodo(); // Yeni todo ekleme fonksiyonunu çağır
            }}
          >
            <h3 className="bg-primary pos">Add ToDo</h3>
            <div className="d-grid justify-content-center align-items-center">
              {/* Yeni todo için input alanları */}
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

        {/* Todo Listesi */}
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
              {/* Todo listesinin her bir elemanı için */}
              {todos.map((todo, index) => (
                <tr key={index}>
                  <td>{todo.task}</td>
                  <td>{todo.startDate}</td>
                  <td>{todo.endDate}</td>
                  <td>
                    {/* Todo'nun durumunu değiştirme dropdown'ı */}
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
                    {/* Düzenleme ve Silme butonları */}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tamamlanan Todo Listesi */}
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
              {/* Tamamlanan todo listesi */}
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
