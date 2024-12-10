import React, { useState } from 'react';
import {Form, Input, Button, message, Select, Menu} from 'antd';
import {useNavigate} from "react-router-dom";
import {Header} from "antd/es/layout/layout.js";

const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (values) => {
    setLoading(true);

    // Формирование тела запроса
    const requestBody = {
      email: values.email,
      password: values.password,
      is_active: true, // Аккаунт активен
      is_superuser: false, // Не админ
      is_verified: false, // Пока не подтвержден
      role_id: 2, // Роль
    };

    fetch('http://127.0.0.1:8000/register/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Ошибка при регистрации');
        }
      })
      .then((data) => {
        message.success('Регистрация успешна!');
        console.log('User created:', data);
        navigate('/login');
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
      <div>
        <Header style={{
          backgroundColor: "rgba(159,196,240,0.42)",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
        }}>
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
        </Header>
        <div className="grid place-items-center min-h-[calc(100vh-80px)] bg-gray-100">
          <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Регистрация</h2>
            <Form
                layout="vertical"
                onFinish={handleRegister}
                autoComplete="off"
            >
              <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {required: true, message: 'Введите ваш email'},
                    {type: 'email', message: 'Введите корректный email'},
                  ]}
              >
                <Input placeholder="Введите email"/>
              </Form.Item>
              <Form.Item
                  label="Пароль"
                  name="password"
                  rules={[{required: true, message: 'Введите пароль'}]}
              >
                <Input.Password placeholder="Введите пароль"/>
              </Form.Item>

              <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  loading={loading}
              >
                Зарегистрироваться
              </Button>
            </Form>
          </div>
        </div>
        <footer style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(159,196,240,0.42)",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{margin: 0, color: "#333"}}>© 2024 Realest. Все права защищены.</p>
        </footer>
      </div>
  );
};

export default Register;
