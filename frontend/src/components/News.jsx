import React, { useState, useEffect } from 'react';
import {Button, Menu} from "antd";
import {Header} from "antd/es/layout/layout.js";
import {useNavigate} from "react-router-dom";

const News = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch news from the API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/news/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const limitedNews = data.news.slice(0, 12);
        setNews(limitedNews);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

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
        <div style={styles.appContainer}>
          <h1 style={styles.title}>Новости</h1>
          <div style={styles.newsGrid}>
            {news.map((item, index) => (
                <div style={styles.newsCard} key={index}>
                  <img
                      src={item.image_url}
                      alt={item.title}
                      style={styles.newsImage}
                  />
                  <div style={styles.newsContent}>
                    <h2 style={styles.newsTitle}>{item.title}</h2>
                    <p style={styles.newsDate}>{item.date}</p>
                    <p style={styles.newsText}>{item.content}</p>
                    <p style={styles.newsViews}>Views: {item.views}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
        <footer style={{
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

const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  newsCard: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  newsCardHover: {
    transform: 'translateY(-5px)',
  },
  newsImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  newsContent: {
    padding: '15px',
  },
  newsTitle: {
    fontSize: '18px',
    margin: '10px 0',
  },
  newsDate: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '10px',
  },
  newsText: {
    fontSize: '16px',
    lineHeight: '1.5',
  },
  newsViews: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
  },
};

export default News;
