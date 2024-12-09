import React, { useEffect, useState } from "react";
import {Form, Input, Select, Checkbox, Button, Layout, Menu, message, Card, Modal} from "antd";
import { useNavigate } from "react-router-dom";
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from "axios";

const { Header, Content } = Layout;

const MainAnalis = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState([53.9006, 27.559]); // Координаты Минска
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formValues, setFormValues] = useState({
    area_total: 0,
    floor_number: 0,
    total_floors: 0,
    building_type: "",
    year_built: 0,
    ceiling_height: 0,
    has_balcony: false,
    condition: "",
    address: "",
    heating: "",
    water_supply: false,
    sewerage: false,
    electricity: false,
    gas: false,
    internet: false,
  });

  const [reportData, setReportData] = useState(null);

 const handleMapClick = async (event) => {
    const newCoordinates = event.get('coords'); // Получаем новые координаты
    setCoordinates(newCoordinates);

    // Запрос на бэкенд для получения адреса
    try {
      const response = await axios.get('http://127.0.0.1:8000/maps/get_address', {
        params: {
          lat: newCoordinates[0],
          lon: newCoordinates[1],
        },
      });
      setAddress(response.data.address); // Устанавливаем адрес
    } catch (error) {
      console.error('Ошибка при получении адреса:', error);
    }
  };

 const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress); // Устанавливаем адрес
    setModalVisible(false); // Закрываем модальное окно
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleFormChange = (changedValues) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Вы не авторизованы. Пожалуйста, войдите.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/report/create-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const data = await response.json();
        message.success("Данные успешно отправлены!");
        console.log("Response:", data);
        setReportData(data); // Сохраняем полученные данные
      } else {
        const errorData = await response.json();
        message.error(`Ошибка: ${errorData.detail || "Не удалось отправить данные"}`);
        console.error("Error response:", errorData);
      }
    } catch (error) {
      message.error("Произошла ошибка при отправке данных");
      console.error("Fetch error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://127.0.0.1:8000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success("Вы успешно вышли из системы");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      } else {
        message.error("Не удалось выйти из системы");
      }
    } catch (error) {
      message.error("Произошла ошибка при выходе из системы");
      console.error("Logout error:", error);
    }
  };

  return (
  <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
    <Header style={{ backgroundColor: "#ffffff", display: "flex", alignItems: "center", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ fontWeight: "bold", fontSize: "24px", marginRight: "auto", color: "#333" }}>Realest</div>
      <Menu mode="horizontal" style={{ borderBottom: "none" }}>
        <Menu.Item key="main">
          <a href="/" style={{ fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s" }} className="menu-item">Главная</a>
        </Menu.Item>
        <Menu.Item key="spec">
          <a href="/specialists" style={{ fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s" }} className="menu-item">Специалисты</a>
        </Menu.Item>
        <Menu.Item key="news">
          <a href="/news" style={{ fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s" }} className="menu-item">Новости</a>
        </Menu.Item>
        <Menu.Item key="analis">
          <a href="/analis" style={{ fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s" }} className="menu-item">Аналитика</a>
        </Menu.Item>
      </Menu>
      <div style={{ marginLeft: "auto" }}>
        {isLoggedIn ? (
          <>
            <Button onClick={handleLogout} style={{ borderRadius: "4px", fontSize: "16px", backgroundColor: "#e74c3c", color: "#ffffff", marginRight: "8px", border: "none", cursor: "pointer" }} className="logout-button">Выйти</Button>
            <Button style={{ borderRadius: "4px", fontSize: "16px", backgroundColor: "#3498db", color: "#ffffff", border: "none", cursor: "pointer" }} onClick={() => navigate("/profile")} className="profile-button">Профиль</Button>
          </>
        ) : (
          <Button onClick={() => navigate("/login")} style={{ borderRadius: "4px", fontSize: "16px", backgroundColor: "#2ecc71", color: "#ffffff", border: "none", cursor: "pointer" }} className="login-button">Войти</Button>
        )}
      </div>
    </Header>

    <Content style={{ padding: "24px", display: "flex", justifyContent: "center", backgroundColor: "#ffffff" }}>
      <Form
        layout="vertical"
        onValuesChange={handleFormChange}
        style={{
          maxWidth: "800px",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
          border: "1px solid #e0e0e0",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#333" }}>Узнайте рыночную цену недвижимости</h2>

        <Form.Item
          label="Адрес"
          name="address"
          rules={[{ required: true, message: "Введите адрес" }]}
        >
          <Input
            style={{ borderRadius: "4px", padding: "8px", fontSize: "16px" }}
            placeholder="Адрес и номер дома"
            value={address} // Привязка к состоянию
            onChange={(e) => setAddress(e.target.value)} // Обновление адреса вручную
            suffix={
              <Button type="link" onClick={handleModalOpen} style={{ padding: 0 }}>
                Или показать на карте
              </Button>
            }
          />
        </Form.Item>

        <Form.Item label="Общая площадь (м²)" name="area_total">
          <Input style={{ borderRadius: "4px", padding: "8px", fontSize: "16px" }} type="number" placeholder="Введите площадь" />
        </Form.Item>

        <Form.Item label="Этаж" name="floor_number">
          <Input style={{ borderRadius: "4px", padding: "8px", fontSize: "16px" }} type="number" placeholder="Введите этаж" />
        </Form.Item>

        <Form.Item label="Количество этажей" name="total_floors">
          <Input style={{ borderRadius: "4px", padding: "8px", fontSize: "16px" }} type="number" placeholder="Введите общее количество этажей" />
        </Form.Item>

        <Form.Item label="Тип здания" name="building_type">
          <Select style={{ borderRadius: "4px", fontSize: "16px" }} placeholder="Выберите тип здания">
            <Select.Option value="brick">Кирпичное</Select.Option>
            <Select.Option value="panel">Панельное</Select.Option>
            <Select.Option value="monolith">Монолитное</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Год постройки" name="year_built">
          <Input style={{ borderRadius: "4px", padding: "8px", fontSize: "16px" }} type="number" placeholder="Введите год постройки" />
        </Form.Item>

        <Form.Item label="Высота потолков (м)" name="ceiling_height">
          <Input style={{ borderRadius: "4px", padding: "8px", fontSize: "16px" }} type="number" step="0.1" placeholder="Введите высоту потолков" />
        </Form.Item>

        <Form.Item label="Балкон">
          <Checkbox style={{ fontSize: "14px" }} checked={formValues.has_balcony} onChange={(e) => handleFormChange({ has_balcony: e.target.checked })}>
            Есть
          </Checkbox>
        </Form.Item>

        <Form.Item label="Состояние" name="condition">
          <Select style={{ borderRadius: "4px", fontSize: "16px" }} placeholder="Выберите состояние">
            <Select.Option value="excellent">Отличное</Select.Option>
            <Select.Option value="good">Хорошее</Select.Option>
            <Select.Option value="needs_repair">Требует ремонта</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Отопление" name="heating">
          <Select style={{ borderRadius: "4px", fontSize: "16px" }} placeholder="Выберите тип отопления">
            <Select.Option value="central">Центральное</Select.Option>
            <Select.Option value="autonomous">Автономное</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Инженерные системы">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <Checkbox style={{ fontSize: "14px" }} checked={formValues.water_supply} onChange={(e) => handleFormChange({ water_supply: e.target.checked })}>
              Водоснабжение
            </Checkbox>
            <Checkbox style={{ fontSize: "14px" }} checked={formValues.sewerage} onChange={(e) => handleFormChange({ sewerage: e.target.checked })}>
              Канализация
            </Checkbox>
            <Checkbox style={{ fontSize: "14px" }} checked={formValues.electricity} onChange={(e) => handleFormChange({ electricity: e.target.checked })}>
              Электричество
            </Checkbox>
            <Checkbox style={{ fontSize: "14px" }} checked={formValues.gas} onChange={(e) => handleFormChange({ gas: e.target.checked })}>
              Газ
            </Checkbox>
            <Checkbox style={{ fontSize: "14px" }} checked={formValues.internet} onChange={(e) => handleFormChange({ internet: e.target.checked })}>
              Интернет
            </Checkbox>
          </div>
        </Form.Item>

        <Form.Item>
            <Button
              type="primary" onClick={handleSubmit}
              block
              style={{
                borderRadius: "4px",
                fontSize: "16px",
                backgroundColor: "#3498db",
                border: "none",
                cursor: "pointer",
              }}
            >
              Узнать цену
            </Button>
          </Form.Item>
      </Form>

        {reportData && (
          <Card
            title="Результаты анализа"
            style={{
              marginTop: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              padding: '16px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Оценочная стоимость:</strong> {reportData.estimated_value} $.</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Цена за квадратный метр:</strong> {reportData.price_per_sqm} $.</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Дата создания:</strong> {new Date(reportData.created_at).toLocaleString()}</p>
            </div>

            <h3 style={{ marginBottom: '16px' }}>Информация о недвижимости</h3>
            <div>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Адрес:</strong> {reportData.estate.address}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Общая площадь:</strong> {reportData.estate.area_total} м²</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Этаж:</strong> {reportData.estate.floor_number} из {reportData.estate.total_floors}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Тип здания:</strong> {reportData.estate.building_type}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Год постройки:</strong> {reportData.estate.year_built}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Высота потолков:</strong> {reportData.estate.ceiling_height} м</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Балкон:</strong> {reportData.estate.has_balcony ? "Есть" : "Нет"}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Состояние:</strong> {reportData.estate.condition}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Отопление:</strong> {reportData.estate.heating}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Водоснабжение:</strong> {reportData.estate.water_supply ? "Есть" : "Нет"}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Канализация:</strong> {reportData.estate.sewerage ? "Есть" : "Нет"}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Электричество:</strong> {reportData.estate.electricity ? "Есть" : "Нет"}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Газ:</strong> {reportData.estate.gas ? "Есть" : "Нет"}</p>
              <p style={{ margin: '4px 0', lineHeight: 1.5 }}><strong>Интернет:</strong> {reportData.estate.internet ? "Есть" : "Нет"}</p>
            </div>
          </Card>
        )}

        <Modal
          title="Выбор адреса на карте"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Отмена
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={() => {
                handleAddressSelect(address); // Устанавливаем выбранный адрес
              }}
            >
              Подтвердить
            </Button>,
          ]}
        >
          <YMaps query={{ apikey: "0f33d76e-0644-470e-942b-ea01b075ee46", lang: "ru_RU" }}>
            <Map
              defaultState={{ center: coordinates, zoom: 12 }}
              onClick={handleMapClick}
              style={{ width: '100%', height: '400px' }}
            >
              <Placemark
                geometry={coordinates}
                options={{ draggable: true }}
                onDragEnd={(e) => handleMapClick(e)}
              />
            </Map>
          </YMaps>
          <p>Адрес: {address}</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MainAnalis;