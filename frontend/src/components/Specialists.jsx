import React, { useEffect, useState } from 'react';
import {Header} from "antd/es/layout/layout.js";
import {Button, Menu} from "antd";
import {useNavigate} from "react-router-dom";

function SpecialistsList() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://127.0.0.1:8000/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCurrentUserId(data.id);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/specialist/approved-specialists');
        const data = await response.json();
        setSpecialists(data);
      } catch (error) {
        console.error('Error fetching specialists:', error);
      }
    };

    fetchSpecialists();
  }, []);

  const fetchReviews = async (specialistId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/reviews/specialist/${specialistId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/reviews/specialist/${selectedSpecialist.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newReview }),
      });

      if (response.ok) {
        fetchReviews(selectedSpecialist.id);
        setNewReview('');
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/reviews/specialist/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchReviews(selectedSpecialist.id);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/reviews/specialist/${editingReviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: editedReview }),
      });

      if (response.ok) {
        fetchReviews(selectedSpecialist.id);
        setEditingReviewId(null);
        setEditedReview('');
      }
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

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

        <h1 style={{textAlign: 'center'}}>Специалисты</h1>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, padding: '20px'}}>
            {specialists.map((specialist) => (
                <div
                    key={specialist.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      margin: '10px',
                      padding: '10px',
                      width: '500px',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                >
                  <img
                      src={specialist.photo_url}
                      alt={`${specialist.name} photo`}
                      style={{width: '100%', height: 'auto', borderRadius: '8px'}}
                  />
                  <h3 style={{margin: '10px 0', fontSize: '16px'}}>{specialist.name}</h3>
                  <p style={{fontSize: '14px'}}><strong>Почта:</strong> {specialist.email}</p>
                  <p style={{fontSize: '14px'}}><strong>Телефон:</strong> {specialist.phone_number}</p>
                  <p style={{fontSize: '14px'}}><strong>Опыт:</strong> {specialist.years_of_experience} года</p>
                  <p style={{fontSize: '14px'}}><strong>Описание:</strong> {specialist.description}</p>
                  <p style={{fontSize: '14px'}}><strong>Социальная сеть (сайт):</strong> {specialist.social_media_url}</p>
                  <button
                      style={{
                        marginTop: '10px',
                        padding: '8px',
                        background: 'rgba(0,123,255,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      onClick={() => {
                        setSelectedSpecialist(specialist);
                        fetchReviews(specialist.id);
                      }}
                  >
                    Отзывы
                  </button>
                </div>
            ))}
          </div>

          {selectedSpecialist && (
              <div
                  style={{
                    flex: 1,
                    padding: '20px',
                    borderLeft: '1px solid #ddd',
                    overflowY: 'auto',
                  }}
              >
                <h2>Отзывы для {selectedSpecialist.name}</h2>
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        style={{
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          margin: '10px 0',
                          padding: '10px',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                      <p>{review.description}</p>
                      <p><strong>Created:</strong> {new Date(review.time_created).toLocaleString()}</p>

                      {currentUserId === review.user_id && (
                      <button
                          style={{
                            marginRight: '10px',
                            padding: '5px 10px',
                            backgroundColor: 'rgba(220,53,69,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleDeleteReview(review.id)}>Удалить</button>)}

                      {currentUserId === review.user_id && (
                      <button
                          style={{
                            padding: '5px 10px',
                            backgroundColor: 'rgba(255,193,7,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setEditingReviewId(review.id);
                            setEditedReview(review.description);
                          }}
                      >
                        Изменить
                      </button>)}
                    </div>
                ))}

                {editingReviewId && (
                    <div>
                <textarea
                    value={editedReview}
                    onChange={(e) => setEditedReview(e.target.value)}
                    rows={4}
                    style={{width: '100%', margin: '10px 0'}}
                />
                      <button
                        style={{
                            padding: '5px 10px',
                            backgroundColor: 'rgba(40,167,69,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                          onClick={handleEditReview}>Сохранить</button>
                    </div>
                )}

                <div style={{marginTop: '20px'}}>
              <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  rows={4}
                  style={{width: '100%', margin: '10px 0'}}
                  placeholder="Напишите свой отзыв..."
              />
                  <button
                      style={{
                          padding: '5px 10px',
                          backgroundColor: 'rgba(40,167,69,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginRight: '10px',
                        }}
                      onClick={handleAddReview}>Добавить отзыв</button>
                </div>
              </div>
          )}
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
}

export default SpecialistsList;
