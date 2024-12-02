import React, { useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import {useNavigate} from "react-router-dom";

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
              { required: true, message: 'Введите ваш email' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input placeholder="Введите email" />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password placeholder="Введите пароль" />
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
  );
};

export default Register;