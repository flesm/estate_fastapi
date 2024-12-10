import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {Button, Menu} from "antd";
import {Header} from "antd/es/layout/layout.js";

const Profile = () => {
  const [user, setUser] = useState(null); // Хранит данные пользователя
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибок
  const [showForm, setShowForm] = useState(false); // Состояние для отображения формы

  const [analytics, setAnalytics] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [ratings, setReports] = useState([]); // Состояние для хранения истории оценок
  const [showRatings, setShowReports] = useState(false); // Состояние для отображения карточек оценок

  const [newAnalysisDescription, setNewAnalysisDescription] = useState("");
  const [updatedAnalysisDescription, setUpdatedAnalysisDescription] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [currentMenu, setCurrentMenu] = useState("profile");

  const handleMenuClick = (e) => {
    setCurrentMenu(e.key);
  };

  useEffect(() => {
    if (currentMenu === "history") {
      fetchReports()
    } else {
      setShowReports(false);
    }
  }, [currentMenu]);

  useEffect(() => {
    if (currentMenu === "analytics") {
      fetchAnalytics()
    } else {
      setShowAnalytics(false);
    }
  }, [currentMenu]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    years_of_experience: 0,
    photo_url: "",
    description: "",
    email: "",
    phone_number: "",
    social_media_url: "",
  });


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Токен не найден. Пожалуйста, авторизуйтесь.");
        }

        const response = await fetch("http://127.0.0.1:8000/user/me", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        setUser({
          id: data.id,
          email: data.email,
          role: getRoleName(data.role_id),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 2:
        return "Обычный пользователь";
      case 3:
        return "Специалист";
      case 4:
        return "Админ";
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/report/user-reports", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Если статус ответа 404, выводим сообщение "У вас нету оценок"
          alert("У вас нету оценок");
          return; // Выходим из функции, чтобы не пытаться обработать ответ
        }
        throw new Error("Ошибка при загрузке отчетов.");
      }

      const data = await response.json();
      setReports(data);
      setShowReports(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/specialist/become-specialist", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, user_id: user.id }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных. Проверьте введенные значения.");
      }

      const data = await response.json();
      alert("Заявка успешно отправлена!");
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/analysis/my-analysis", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
      setShowAnalytics(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const createAnalysis = async () => {
    if (newAnalysisDescription) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/analysis/new-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: newAnalysisDescription }),
        });

        if (!response.ok) {
          throw new Error("Failed to create analysis");
        }

        const newAnalysis = await response.json();
        setAnalytics([...analytics, newAnalysis]);
        setNewAnalysisDescription("");
      } catch (err) {
        console.error("Error creating analysis:", err);
      }
    }
  };

  const deleteAnalysis = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:8000/analysis/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalytics(analytics.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting analysis:", err);
    }
  };

  const updateAnalysis = async (id) => {
    if (updatedAnalysisDescription) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/analysis/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: updatedAnalysisDescription }),
        });

        if (!response.ok) {
          throw new Error("Failed to update analysis");
        }

        const updatedAnalysis = await response.json();
        setAnalytics(
          analytics.map((item) => (item.id === id ? updatedAnalysis : item))
        );
        setUpdatedAnalysisDescription("");
      } catch (err) {
        console.error("Error updating analysis:", err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
      <div>
        <Header
            style={{
              backgroundColor: "rgba(159,196,240,0.42)",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}
        >
          <div style={{fontWeight: "bold", fontSize: "24px", marginRight: "auto", color: "#333"}}>Realest</div>
          <Menu mode="horizontal" style={{borderBottom: "none"}}>
            <Menu.Item key="main" style={{backgroundColor: "rgba(159,196,240,0.42)", color: "#333"}}>
              <a href="/" style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Главная</a>
            </Menu.Item>
            <Menu.Item key="spec" style={{backgroundColor: "rgba(159,196,240,0.42)", color: "#333"}}>
              <a href="/specialists"
                 style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Специалисты</a>
            </Menu.Item>
            <Menu.Item key="news" style={{backgroundColor: "rgba(159,196,240,0.42)", color: "#333"}}>
              <a href="/news"
                 style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Новости</a>
            </Menu.Item>
            <Menu.Item key="analis" style={{backgroundColor: "rgba(159,196,240,0.42)", color: "#333"}}>
              <a href="/analis"
                 style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Аналитика</a>
            </Menu.Item>
          </Menu>
          <div style={{marginLeft: "auto"}}>
            {isLoggedIn ? (
                <>
                  <Button onClick={() => {/* Логика выхода */
                  }} style={{
                    borderRadius: "4px",
                    fontSize: "16px",
                    backgroundColor: "#e69b92",
                    color: "#ffffff",
                    marginRight: "8px",
                    border: "none",
                    cursor: "pointer"
                  }} className="logout-button">Выйти</Button>
                  <Button style={{
                    borderRadius: "4px",
                    fontSize: "16px",
                    backgroundColor: "#73b8e1",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }} onClick={() => navigate("/profile")} className="profile-button">Профиль</Button>
                </>
            ) : (
                <Button onClick={() => navigate("/login")} style={{
                  borderRadius: "4px",
                  fontSize: "16px",
                  backgroundColor: "#6cd69b",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer"
                }} className="login-button">Войти</Button>
            )}
          </div>
        </Header>

        <h1 style={{textAlign: "center"}}>Профиль</h1>
        <div style={{ display: "flex" }}>
          <Menu
            onClick={handleMenuClick}
            selectedKeys={[currentMenu]}
            style={{ width: 256 }}
            mode="inline"
          >
            <Menu.Item key="profile">Личные данные</Menu.Item>
            <Menu.Item key="history">История оценок</Menu.Item>
            {user.role === "Специалист" && <Menu.Item key="analytics">Аналитика</Menu.Item>}
            {user.role === "Обычный пользователь" && (
              <Menu.Item key="upgrade">Стать специалистом</Menu.Item>
            )}
          </Menu>
          <div style={{ flex: 1, padding: "0 24px" }}>
            {currentMenu === "profile" && (
              <div>
                <h1 style={{ textAlign: "center" }}>Ваши данные</h1>
                <p style={{ textAlign: "center" }}>Имя: {user.email.split("@")[0]}</p>
                <p style={{ textAlign: "center" }}>Почта: {user.email}</p>
                <p style={{ textAlign: "center" }}>Вы: {user.role}</p>
              </div>
            )}
            {currentMenu === "history" && (
              <div>
                <h1>История оценок</h1>
                <p>Ваша история оценок недвижимости.</p>
              </div>
            )}
            {currentMenu === "analytics" && (
              <div>
                <h1>Аналитика</h1>
                <p>Ваша аналитика.</p>
              </div>
            )}
            {currentMenu === "upgrade" && (
              <div>
                <h1>Стать специалистом</h1>
                <p>Стать специалистом — это ваш шанс начать представлять свои профессиональные услуги на нашей платформе. Если вы дипломированный специалист или просто обладаете навыками, которые могут быть полезны другим, вы можете заполнить специальную форму заявки. Мы рассмотрим вашу информацию и свяжемся с вами для уточнения деталей.</p>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => setShowForm(!showForm)}
                >
                  Заполнить форму
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-500">Ошибка: {error}</p>}


        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Форма заявки</h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Имя:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Годы опыта:</label>
              <input
                type="number"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>URL фото:</label>
              <input
                type="text"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Описание:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  minHeight: "80px"
                }}
              ></textarea>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Номер телефона:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Ссылка на соцсети:</label>
              <input
                type="text"
                name="social_media_url"
                value={formData.social_media_url}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              Отправить
            </button>
          </form>
        )}


        {showRatings && (
          <div
            style={{
              margin: "20px",
              padding: "20px",
              border: "2px solid #ccc",
              borderRadius: "10px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    padding: "10px",
                  }}
                >
                  {/* Фото слева */}
                  <div
                    style={{
                      flex: "1 1 33%",
                      backgroundImage: `url(${rating.estate.photo_url || "http://surl.li/itabpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minHeight: "200px",
                      borderRadius: "8px",
                    }}
                  ></div>

                  {/* Текстовая информация */}
                  <div style={{ flex: "2 1 66%", paddingLeft: "16px" }}>
                    {/* Главная информация */}
                    <h2 style={{ marginBottom: "10px", color: "#333" }}>
                      {rating.estate.address}
                    </h2>
                    <p style={{ marginBottom: "10px", fontWeight: "bold", color: "#555" }}>
                      Оценочная стоимость: {rating.estimated_value} | Цена за м²: {rating.price_per_sqm}
                    </p>
                    {/* Остальная информация построчно */}
                    <ul style={{ margin: 0, padding: 0, listStyleType: "none", color: "#555" }}>
                      <li style={{ marginBottom: "6px" }}>
                        <strong>Дата оценки:</strong> {new Date(rating.created_at).toLocaleDateString()}
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        <strong>Площадь:</strong> {rating.estate.area_total} м²
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        <strong>Этаж:</strong> {rating.estate.floor_number}/{rating.estate.total_floors}
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        <strong>Тип здания:</strong> {rating.estate.building_type}
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        <strong>Год постройки:</strong> {rating.estate.year_built}
                      </li>
                      <li style={{ marginBottom: "6px" }}>
                        <strong>Состояние:</strong> {rating.estate.condition}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {showAnalytics && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {analytics.map((analysis) => (
                <div
                  key={analysis.id}
                  style={{
                    border: '1px solid #d1d5db', // border-gray-300
                    padding: '1.5rem',
                    borderRadius: '0.5rem', // rounded-lg
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff', // white
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: '#4a4a4a', fontSize: '0.875rem' }}> {/* text-gray-800, text-sm */}
                      <strong>Дата:</strong> {new Date(analysis.time_created).toLocaleString()}
                    </p>
                    <p style={{ color: '#4a4a4a', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      <strong>Описание:</strong> {analysis.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => deleteAnalysis(analysis.id)}
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.7)', // bg-red-500
                          color: '#000000', // text-white
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem', // rounded-lg
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.7)'} // hover:bg-red-600
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.7)'}
                      >
                        Удалить
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Новое описание"
                          value={updatedAnalysisDescription}
                          onChange={(e) => setUpdatedAnalysisDescription(e.target.value)}
                          style={{
                            border: '1px solid #d1d5db', // border-gray-300
                            padding: '0.5rem',
                            borderRadius: '0.375rem', // rounded-lg
                            outline: 'none',
                            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.5)', // focus:ring-indigo-500
                            width: '200px',
                          }}
                        />
                        <button
                          onClick={() => updateAnalysis(analysis.id)}
                          style={{
                            backgroundColor: 'rgba(245,158,11,0.7)', // bg-yellow-500
                            color: '#000000', // text-white
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem', // rounded-lg
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(234,179,8,0.7)'} // hover:bg-yellow-600
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.7)'}
                        >
                          Изменить
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => console.log("Комментарии")}
                      style={{
                        backgroundColor: 'rgba(59,130,246,0.7)', // bg-blue-500
                        color: '#000000', // text-white
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem', // rounded-lg
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.7)'} // hover:bg-blue-600
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0)'}
                    >
                      Комментарии
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Описание новой аналитики"
                  value={newAnalysisDescription}
                  onChange={(e) => setNewAnalysisDescription(e.target.value)}
                  style={{
                    border: '1px solid #d1d5db', // border-gray-300
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem', // rounded-lg
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.5)', // focus:ring-indigo-500
                    width: '100%',
                    marginBottom: '1rem',
                  }}
                />
                <button
                  onClick={createAnalysis}
                  style={{
                    backgroundColor: 'rgba(139,92,246,0.7)', // bg-purple-500
                    color: '#000000', // text-white
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem', // rounded-lg
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.7)'} // hover:bg-purple-600
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.7)'}
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Profile;
