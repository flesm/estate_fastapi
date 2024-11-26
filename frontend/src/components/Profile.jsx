import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Spin, Alert } from 'antd';
// import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const history = useHistory();

  // Получаем токен из localStorage
  // const token = localStorage.getItem('token');

  useEffect(() => {
    // if (!token) {
    //   history.push('/login'); // Если токен отсутствует, перенаправляем на страницу входа
    //   return;
    // }

    // Запрос на получение данных профиля
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/me', {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, history]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert message="Error" description={error} type="error" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card title="User Profile" className="max-w-lg mx-auto">
        <Title level={4}>Profile Information</Title>
        <div className="space-y-4">
          <div>
            <Text strong>Email:</Text> <span>{userData.email}</span>
          </div>
          <div>
            <Text strong>Status:</Text> <span>{userData.is_active ? 'Active' : 'Inactive'}</span>
          </div>
          <div>
            <Text strong>Superuser:</Text> <span>{userData.is_superuser ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <Text strong>Verified:</Text> <span>{userData.is_verified ? 'Verified' : 'Not Verified'}</span>
          </div>
          <div>
            <Text strong>Role ID:</Text> <span>{userData.role_id}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
