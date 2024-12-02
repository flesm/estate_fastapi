import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]); // Состояние для списка пользователей
  const [requests, setRequests] = useState([]); // Состояние для хранения заявок
  const [isAdmin, setIsAdmin] = useState(false); // Проверка роли администратора
  const [editUser, setEditUser] = useState(null); // Пользователь, редактируемый сейчас
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    is_active: true,
    is_superuser: true,
    is_verified: true,
    role_id: 4, // ID роли администратора
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/check-role", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.role_id === 4) {
          setIsAdmin(true);
        } else {
          alert("Доступ запрещен: вы не администратор.");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Ошибка при проверке роли:", error);
        setIsAdmin(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/all-users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
      }
    };

    checkRole();
    fetchUsers();

    // Загрузка заявок
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/specialist-requests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (leadId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/admin/approve-specialist/${leadId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Запрос одобрен!");
      setRequests(requests.filter((req) => req.id !== leadId)); // Используем leadId для фильтрации
    } catch (error) {
      console.error("Ошибка при одобрении запроса:", error);
    }
  };

  const handleReject = async (leadId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/admin/reject-specialist/${leadId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Запрос отклонен!");
      setRequests(requests.filter((req) => req.id !== leadId)); // Используем leadId для фильтрации
    } catch (error) {
      console.error("Ошибка при отклонении запроса:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user, specialist: user.specialist || {} });
  };

  // Сохранение изменений
  const handleSaveEdit = async () => {
    try {
      const updatedUser = { ...editUser };
      await axios.patch(
        `http://127.0.0.1:8000/admin/user/${editUser.id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Пользователь обновлен!");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUser.id ? updatedUser : user
        )
      );
      setEditUser(null);
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Пользователь удален!");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при регистрации администратора");
      }

      const data = await response.json();
      setResponseMessage(`Администратор зарегистрирован! ID: ${data.id}, Email: ${data.email}`);
    } catch (error) {
      setErrorMessage(`Ошибка: ${error.message}`);
    }
  };


  if (!isAdmin) {
    return <h2>Страница на найдена 404</h2>;
  }

  return (
      <div>
        <h1>Запросы на звание специалиста</h1>
        <table border="1" style={{width: "100%", textAlign: "left"}}>
          <thead>
          <tr>
            <th>Имя</th>
            <th>Опыт (лет)</th>
            <th>Фото</th>
            <th>Описание</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Соцсети</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {requests.map((request) => (
              <tr key={request.user_id}>
                <td>{request.name}</td>
                <td>{request.years_of_experience}</td>
                <td>
                  <img
                      src={request.photo_url}
                      alt={request.name}
                      style={{width: "50px", height: "50px", objectFit: "cover"}}
                  />
                </td>
                <td>{request.description}</td>
                <td>{request.email}</td>
                <td>{request.phone_number}</td>
                <td>
                  <a href={request.social_media_url} target="_blank" rel="noopener noreferrer">
                    Профиль
                  </a>
                </td>
                <td>
                  <button onClick={() => handleApprove(request.id)}>Принять</button>
                  <button onClick={() => handleReject(request.id)}>Отклонить</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>


        <h1>Список пользователей</h1>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Имя (для специалистов)</th>
                <th>Телефон (для специалистов)</th>
                <th>Соцсети (для специалистов)</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.role_id === 2 ? "Пользователь" : "Специалист"}</td>
                  <td>{user.specialist?.name || "—"}</td>
                  <td>{user.specialist?.phone_number || "—"}</td>
                  <td>
                    {user.specialist?.social_media_url ? (
                      <a
                        href={user.specialist.social_media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Профиль
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEditUser(user)}>Изменить</button>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editUser && (
            <div>
              <h2>Редактирование пользователя</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
              >
                <label>
                  Email:
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                  />
                </label>
                {editUser.role_id === 3 && (
                  <>
                    <label>
                      Имя:
                      <input
                        type="text"
                        value={editUser.specialist?.name || ""}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            specialist: {
                              ...editUser.specialist,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Телефон:
                      <input
                        type="text"
                        value={editUser.specialist?.phone_number || ""}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            specialist: {
                              ...editUser.specialist,
                              phone_number: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    <label>
                      Соцсети:
                      <input
                        type="url"
                        value={editUser.specialist?.social_media_url || ""}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            specialist: {
                              ...editUser.specialist,
                              social_media_url: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  </>
                )}
                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => setEditUser(null)}>
                  Отмена
                </button>
              </form>
            </div>
          )}

          <h2>Регистрация Администратора</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
                  Пароль:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                Зарегистрировать Администратора
              </button>
            </form>
            {responseMessage && <p style={{ color: "green", marginTop: "15px" }}>{responseMessage}</p>}
            {errorMessage && <p style={{ color: "red", marginTop: "15px" }}>{errorMessage}</p>}
      </div>
  );
};

export default Admin;
