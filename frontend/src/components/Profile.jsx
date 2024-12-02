import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null); // Хранит данные пользователя
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибок
  const [showForm, setShowForm] = useState(false); // Состояние для отображения формы
  const [formData, setFormData] = useState({
    name: "",
    years_of_experience: 0,
    photo_url: "",
    description: "",
    email: "",
    phone_number: "",
    social_media_url: "",
  });
  const [ratings, setReports] = useState([]); // Состояние для хранения истории оценок
  const [showRatings, setShowReports] = useState(false); // Состояние для отображения карточек оценок

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {user ? (
        <div>
          <p>Имя пользователя: {user.email}</p>
          <p>Роль: {user.role}</p>
          {user.role === "Обычный пользователь" && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => setShowForm(!showForm)}
            >
              Стать специалистом
            </button>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
            onClick={fetchReports}
          >
            История оценок
          </button>
        </div>
      ) : (
        <p>Нет данных о пользователе.</p>
      )}

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mt-4">
          {/* Форма добавления данных */}
          <div>
            <label>Имя:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>Годы опыта:</label>
            <input
              type="number"
              name="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleInputChange}
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>URL фото:</label>
            <input
              type="text"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>Описание:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="border p-2 w-full"
            ></textarea>
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>Номер телефона:</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>Ссылка на соцсети:</label>
            <input
              type="text"
              name="social_media_url"
              value={formData.social_media_url}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          >
            Отправить
          </button>
        </form>
      )}

      {showRatings && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <h2 className="col-span-full">История оценок</h2>
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="border p-4 rounded shadow bg-white"
              style={{
                backgroundImage: `url(${rating.estate.photo_url || "https://via.placeholder.com/300"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-opacity-80 bg-white p-4 rounded-lg border border-gray-300">
                <div className="mb-3">
                  <p><strong>Оценочная стоимость:</strong> {rating.estimated_value}</p>
                  <p><strong>Цена за м²:</strong> {rating.price_per_sqm}</p>
                  <p><strong>Дата оценки:</strong> {new Date(rating.created_at).toLocaleDateString()}</p>
                </div>
                {/* Новый контейнер для рамки */}
                <div className="border p-4 rounded-lg mt-2">
                  <h3 className="mt-2 text-lg font-semibold">Недвижимость:</h3>
                  <ul className="mt-2">
                    <li className="mb-2"><strong>Адрес:</strong> {rating.estate.address}</li>
                    <li className="mb-2"><strong>Площадь:</strong> {rating.estate.area_total} м²</li>
                    <li className="mb-2"><strong>Этаж:</strong> {rating.estate.floor_number}/{rating.estate.total_floors}</li>
                    <li className="mb-2"><strong>Тип здания:</strong> {rating.estate.building_type}</li>
                    <li className="mb-2"><strong>Год постройки:</strong> {rating.estate.year_built}</li>
                    <li className="mb-2"><strong>Состояние:</strong> {rating.estate.condition}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default Profile;
