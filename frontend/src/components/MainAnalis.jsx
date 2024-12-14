import React, { useEffect, useState } from "react";
import {Form, Input, Select, Checkbox, Button, Layout, Menu, message, Card, Modal, notification} from "antd";
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
    const hasNegativeValue = Object.values(formValues).some(value => value < 0);

      if (hasNegativeValue) {
        message.error("Все поля должны содержать положительные числа.");
        return;
      }

      if (formValues.total_floors < formValues.floor_number){
          message.error("Количество этажей не может быть меньше этажа недвижимости.");
          return;
      }

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
      <Layout style={{minHeight: "100vh", backgroundColor: "#f5f5f5"}}>
        <Header style={{
          backgroundColor: "#9fc4f0",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{fontWeight: "bold", fontSize: "24px", marginRight: "auto", color: "#333"}}>Realest</div>
          <Menu mode="horizontal" style={{borderBottom: "none"}}>
            <Menu.Item key="main" style={{backgroundColor: "#9fc4f0", color: "#333"}}>
              <a href="/" style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Главная</a>
            </Menu.Item>
            <Menu.Item key="spec" style={{backgroundColor: "#9fc4f0", color: "#333"}}>
              <a href="/specialists"
                 style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Специалисты</a>
            </Menu.Item>
            <Menu.Item key="news" style={{backgroundColor: "#9fc4f0", color: "#333"}}>
              <a href="/news"
                 style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Новости</a>
            </Menu.Item>
            <Menu.Item key="analis" style={{backgroundColor: "#9fc4f0", color: "#333"}}>
              <a href="/analis"
                 style={{fontSize: "16px", color: "#333", textDecoration: "none", transition: "color 0.3s"}}
                 className="menu-item">Аналитика</a>
            </Menu.Item>
          </Menu>
          <div style={{marginLeft: "auto"}}>
            {isLoggedIn ? (
                <>
                  <Button onClick={handleLogout} style={{
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
                    cursor: "pointer"
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

          <Content style={{padding: "24px", display: "flex", justifyContent: "center", backgroundColor: "#ffffff",  position: "relative", overflow: "hidden",}}>
              <div
                  style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      backgroundImage: "url('https://c.pxhere.com/photos/3b/11/architecture_homes_colorful_summer_building_bay_window_spain_facade-1001592.jpg!d')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      zIndex: 0, // За элементами формы
                  }}
              ></div>
              <div style={{
                  flex: 1,
                  padding: "0px",
                  maxWidth: "700px",
                  width: "100%",
                  marginRight: "auto",
              }}>
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
                            zIndex: 1,
                            position: "relative",
                      }}
                  >
                      <h2 style={{fontSize: "24px", marginBottom: "16px", color: "#333", marginTop: "12px"}}>Узнайте
                          рыночную цену недвижимости</h2>

                      {/* Строка 1: Адрес, Общая площадь */}
                      <div style={{display: "flex", gap: "16px"}}>
                          <Form.Item label="Адрес" name="address" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]} style={{flex: 2, marginBottom: "0px"}}>
                              <Input
                                  style={{borderRadius: "4px", padding: "8px", fontSize: "16px"}}
                                  placeholder="Адрес и номер дома"
                                  value={address} // Привязка к состоянию
                                  onChange={(e) => setAddress(e.target.value)} // Обновление адреса вручную
                                  suffix={
                                      <Button type="link" onClick={handleModalOpen} style={{padding: 0}}>
                                          Или показать на карте
                                      </Button>
                                  }
                              />
                          </Form.Item>
                          <Form.Item label="Общая площадь (м²)" name="area_total"
                                     style={{flex: 1, marginBottom: "20px"}}
                                    rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                              <Input
                                  style={{borderRadius: "4px", padding: "8px", fontSize: "16px"}}
                                  type="number"
                                  placeholder="Площадь"
                              />
                          </Form.Item>
                      </div>

                      {/* Строка 2: Этаж, Количество этажей */}
                      <div style={{display: "flex", gap: "16px"}}>
                          <Form.Item label="Этаж" name="floor_number" style={{flex: 1, marginBottom: "15px"}}
                                    rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                              <Input
                                  style={{borderRadius: "4px", padding: "8px", fontSize: "16px"}}
                                  type="number"
                                  placeholder="Этаж"
                              />
                          </Form.Item>
                          <Form.Item label="Количество этажей" name="total_floors"
                                     style={{flex: 1, marginBottom: "15px"}}>
                              <Input
                                  style={{borderRadius: "4px", padding: "8px", fontSize: "16px"}}
                                  type="number"
                                  placeholder="Этажей"
                              />
                          </Form.Item>
                      </div>

                      {/* Строка 3: Тип здания */}
                      <Form.Item label="Тип здания" name="building_type" style={{marginBottom: "15px"}}
                                rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                          <Select style={{borderRadius: "4px", fontSize: "16px"}} placeholder="Выберите тип здания">
                              <Select.Option value="brick">Кирпичное</Select.Option>
                              <Select.Option value="panel">Панельное</Select.Option>
                              <Select.Option value="monolith">Монолитное</Select.Option>
                          </Select>
                      </Form.Item>

                      {/* Строка 4: Год постройки, Состояние */}
                      <div style={{display: "flex", gap: "16px"}}>
                          <Form.Item label="Год постройки" name="year_built" style={{flex: 1, marginBottom: "15px"}}>
                              <Input
                                  style={{borderRadius: "4px", padding: "8px", fontSize: "16px"}}
                                  type="number"
                                  placeholder="Год"
                              />
                          </Form.Item>
                          <Form.Item label="Состояние" name="condition" style={{flex: 1, marginBottom: "15px"}}
                                    rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                              <Select style={{borderRadius: "4px", fontSize: "16px"}} placeholder="Состояние">
                                  <Select.Option value="excellent">Отличное</Select.Option>
                                  <Select.Option value="good">Хорошее</Select.Option>
                                  <Select.Option value="needs_repair">Требует ремонта</Select.Option>
                              </Select>
                          </Form.Item>
                      </div>

                      {/* Строка 5: Высота потолков, Балкон */}
                      <div style={{display: "flex", gap: "16px"}}>
                          <Form.Item label="Высота потолков (м)" name="ceiling_height"
                                     style={{flex: 4, marginBottom: "15px"}}
                                    rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                              <Input
                                  style={{borderRadius: "4px", padding: "8px", fontSize: "16px"}}
                                  type="number"
                                  step="0.1"
                                  placeholder="Высота"
                              />
                          </Form.Item>
                          <Form.Item label="Балкон" name="balcony" style={{flex: 1, marginBottom: "15px"}}>
                              <Checkbox>Есть</Checkbox>
                          </Form.Item>
                      </div>

                      {/* Строка 6: Отопление */}
                      <Form.Item label="Отопление" name="heating" style={{marginBottom: "15px"}}
                                rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                          <Select style={{borderRadius: "4px", fontSize: "16px"}} placeholder="Выберите отопление">
                              <Select.Option value="central">Центральное</Select.Option>
                              <Select.Option value="autonomous">Автономное</Select.Option>
                          </Select>
                      </Form.Item>

                      {/* Строка 7: Инженерные системы */}
                      <Form.Item label="Инженерные системы">
                          <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
                              <Checkbox style={{fontSize: "14px"}}>Водоснабжение</Checkbox>
                              <Checkbox style={{fontSize: "14px"}}>Канализация</Checkbox>
                              <Checkbox style={{fontSize: "14px"}}>Электричество</Checkbox>
                              <Checkbox style={{fontSize: "14px"}}>Газ</Checkbox>
                              <Checkbox style={{fontSize: "14px"}}>Интернет</Checkbox>
                          </div>
                      </Form.Item>

                      <Form.Item>
                          <Button
                              type="primary"
                              onClick={handleSubmit}
                              block
                              style={{
                                  borderRadius: "4px",
                                  fontSize: "16px",
                                  backgroundColor: "#3498db",
                                  border: "none",
                              }}
                          >
                              Узнать стоимость
                          </Button>
                      </Form.Item>
                  </Form>

                  {reportData && (
                      <Card
                          title="Результаты анализа"
                          style={{
                              flex: 1,
                              marginTop: '24px',
                              borderRadius: '8px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              padding: '16px',
                          }}
                      >
                          <div style={{marginBottom: '16px'}}>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Оценочная
                                  стоимость:</strong> {reportData.estimated_value} $.</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Цена за квадратный
                                  метр:</strong> {reportData.price_per_sqm} $.</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Дата
                                  создания:</strong> {new Date(reportData.created_at).toLocaleString()}</p>
                          </div>

                          <h3 style={{marginBottom: '16px'}}>Информация о недвижимости</h3>
                          <div>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Адрес:</strong> {reportData.estate.address}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Общая
                                  площадь:</strong> {reportData.estate.area_total} м²</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Этаж:</strong> {reportData.estate.floor_number} из {reportData.estate.total_floors}
                              </p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Тип
                                  здания:</strong> {reportData.estate.building_type}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Год
                                  постройки:</strong> {reportData.estate.year_built}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}><strong>Высота
                                  потолков:</strong> {reportData.estate.ceiling_height} м</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Балкон:</strong> {reportData.estate.has_balcony ? "Есть" : "Нет"}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Состояние:</strong> {reportData.estate.condition}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Отопление:</strong> {reportData.estate.heating}
                              </p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Водоснабжение:</strong> {reportData.estate.water_supply ? "Есть" : "Нет"}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Канализация:</strong> {reportData.estate.sewerage ? "Есть" : "Нет"}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Электричество:</strong> {reportData.estate.electricity ? "Есть" : "Нет"}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Газ:</strong> {reportData.estate.gas ? "Есть" : "Нет"}</p>
                              <p style={{margin: '4px 0', lineHeight: 1.5}}>
                                  <strong>Интернет:</strong> {reportData.estate.internet ? "Есть" : "Нет"}</p>
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
                      <YMaps query={{apikey: "0f33d76e-0644-470e-942b-ea01b075ee46", lang: "ru_RU"}}>
                          <Map
                              defaultState={{center: coordinates, zoom: 12}}
                              onClick={handleMapClick}
                              style={{width: '100%', height: '400px'}}
                          >
                              <Placemark
                                  geometry={coordinates}
                                  options={{draggable: true}}
                                  onDragEnd={(e) => handleMapClick(e)}
                              />
                          </Map>
                      </YMaps>
                      <p>Адрес: {address}</p>
                  </Modal>
              </div>
          </Content>

          <footer style={{
              backgroundColor: "rgba(159,196,240,0.42)",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)"
          }}>
              <p style={{margin: 0, color: "#333"}}>© 2024 Realest. Все права защищены.</p>
          </footer>
      </Layout>
  );
};

export default MainAnalis;