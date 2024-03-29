"use client"; // Bu, bu kodun istemci tarafında çalıştığını belirtir.
import React, { useState } from "react"; // React ve useState hook'unu içeri aktarır.

export default function TodoList() {
  // Durum değişkenlerini tanımla ve useState hook'ları kullanarak başlat.
  const [todos, setTodos] = useState([]); // Görevlerin listesi.
  const [doneTodos, setDoneTodos] = useState([]); // Tamamlanan görevlerin listesi.
  const [error, setError] = useState(""); // Hata mesajı.
  const [todoInput, setTodoInput] = useState(""); // Yeni görev girişi.
  const [startDate, setStartDate] = useState(""); // Görevin başlangıç tarihi.
  const [endDate, setEndDate] = useState(""); // Görevin bitiş tarihi.
  const [editIndex, setEditIndex] = useState(null); // Düzenleme modunda olan görevin indeksi.

  // Yeni görev eklemek için işlev.
  const addTodo = () => {
    // Gerekli alanların dolu olup olmadığını kontrol et.
    if (!todoInput || !startDate || !endDate) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    // Yeni görevi todos dizisine ekleyerek güncelle.
    setTodos([
      ...todos,
      { task: todoInput, status: "InProgress", startDate, endDate },
    ]);

    // Girdi alanlarını temizle.
    setTodoInput("");
    setStartDate("");
    setEndDate("");
    setError("");
  };

  // Görevin durumunu değiştirmek için işlev.
  const handleStatusChange = (index, status) => {
    // Todos dizisini .map() kullanarak güncelle.
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        const updatedTodo = { ...todo, status: status };
        if (status === "Done") {
          // Görev "Done" olarak işaretlenirse, tarih bilgilerini ekle.
          updatedTodo.startDate = new Date().toISOString().split("T")[0];
          updatedTodo.endDate = new Date().toISOString().split("T")[0];
        }
        return updatedTodo;
      }
      return todo;
    });

    // Güncellenmiş todos dizisini ayarla.
    setTodos(updatedTodos);

    // Eğer görev "Done" olarak işaretlenirse, ilgili görevi doneTodos'a ekle ve todos'tan çıkar.
    if (status === "Done") {
      const doneTodo = updatedTodos[index];
      setDoneTodos([...doneTodos, doneTodo]);
      const filteredTodos = updatedTodos.filter((_, i) => i !== index);
      setTodos(filteredTodos);
    }
  };

  // Görevi silmek için işlev.
  const handleDelete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  // Görevi düzenleme moduna geçirmek için işlev.
  const handleEdit = (index) => {
    setEditIndex(index);
  };

  // Düzenlenmiş görevi kaydetmek için işlev.
  const handleSaveEdit = (index, editedTodo) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = editedTodo;
    setTodos(updatedTodos);
    setEditIndex(null);
  };

  // JSX döndürürken, bileşenin HTML ve JS kısmını birleştir.
  return (
    <main className="p-0 m-0 gap-2 d-grid ">
      {/* Ana bileşenin HTML yapısını oluşturur */}
      <div className="row gap-2 justify-content-md-center position-relative position-sm-fixed position-md-fixed  container p-0 m-0 vh-100">
        {/* Yeni görev eklemek için form */}
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
        {/* Görev listesi */}
        <div className="bg-primary bg-opacity-50 col-12 col-md-5 overflow-auto p-0 text-center rounded shadow-lg h-100">
          <h3 className="bg-primary">Todo List</h3>
          <table className="table">
            <thead className="">
              <tr >
                <th scope="col smaller-text">Task</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Görev listesini döngüye alır ve her bir görev için bir tablo satırı oluşturur */}
              {todos.map((todo, index) => (
                <tr key={index}>
                  <td>
                    {/* Eğer düzenleme modunda ise, düzenleme alanı gösterilir, değilse görev metni */}
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
                    {/* Görevin durumu için bir açılır menü */}
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
                    {/* Eğer düzenleme modunda ise, kaydetme düğmesi gösterilir, değilse düzenleme ve silme düğmeleri */}

                    {editIndex === index ? (
                      <button
                        onClick={() => handleSaveEdit(index, todo)}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                    ) : (
                      <div className="w-100">
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
        {/* Tamamlanan görevler listesi */}
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
              {/* Tamamlanan görevleri döngüye alır ve her birini bir tablo satırı olarak oluşturur */}
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
