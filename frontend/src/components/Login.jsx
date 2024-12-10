import React, {useEffect, useState} from 'react';
import {Form, Input, Button, message, Menu} from 'antd';
import { useNavigate } from 'react-router-dom';
import {Header} from "antd/es/layout/layout.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', values.username);
    formData.append('password', values.password);


    fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Неверное имя пользователя или пароль');
        }
      })
      .then((data) => {
        message.success('Успешный вход!');
        localStorage.setItem('token', data.access_token);
        console.log('Received token:', data.access_token);
        window.dispatchEvent(new Event("authChange"));
        navigate('/');
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

        <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 80px)',
              backgroundColor: '#f3f4f6',
            }}
        >
          <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Вход в аккаунт</h2>
            <Form
                layout="vertical"
                onFinish={handleLogin}
                autoComplete="off"
            >
              <Form.Item
                  label="Имя пользователя"
                  name="username"
                  rules={[{required: true, message: 'Введите имя пользователя'}]}
              >
                <Input placeholder="Введите имя пользователя"/>
              </Form.Item>
              <Form.Item
                  label="Пароль"
                  name="password"
                  rules={[{required: true, message: 'Введите ваш пароль'}]}
              >
                <Input.Password placeholder="Ваш пароль"/>
              </Form.Item>
              <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  loading={loading}
              >
                Войти
              </Button>
            </Form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Нет аккаунта?{' '}
              <a href="/reg" className="text-blue-500 hover:underline">
                Зарегистрироваться
              </a>
            </p>
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

export default Login;
