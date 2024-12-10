import React, { useEffect, useState } from 'react';
import {Button, Menu} from "antd";
import {Header} from "antd/es/layout/layout.js";
import {useNavigate} from "react-router-dom";

function Analis() {
  const [analyses, setAnalyses] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/analysis/all-analysis');
        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      }
    };

    fetchAnalyses();
  }, []);

  const fetchComments = async (analysisId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/reviews/analysis/${analysisId}`);
      const data = await response.json();
      setComments((prev) => ({ ...prev, [analysisId]: data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (analysisId, commentText) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:8000/reviews/analysis/${analysisId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: commentText }),
      });
      fetchComments(analysisId); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (reviewId, analysisId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:8000/reviews/analysis/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments(analysisId); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (reviewId, analysisId, updatedText) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:8000/reviews/analysis/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: updatedText }),
      });
      fetchComments(analysisId); // Refresh comments
    } catch (error) {
      console.error('Error updating comment:', error);
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
        <div style={{padding: '20px', display: 'flex', gap: '20px'}}>
          {/* Секция аналитики */}
          <div style={{flex: 2}}>
            <h1 align="center">Аналитика</h1>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {analyses.map((analysis) => (
                  <div
                      key={analysis.id}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <h3 style={{flex: '2', fontWeight: 'bold'}}>{analysis.description.split('.')[0]}</h3>
                      <span style={{
                        flex: '1',
                        textAlign: 'right'
                      }}>{new Date(analysis.time_created).toLocaleString()}</span>
                      <span style={{flex: '1', textAlign: 'right'}}>Специалист: {analysis.specialist_name}</span>
                    </div>
                    <p style={{margin: '0'}}>{analysis.description}</p>
                    <button
                        style={{
                          padding: '10px 15px',
                          backgroundColor: 'rgba(0,123,255,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          alignSelf: 'flex-start',
                        }}
                        onClick={() => {
                          setSelectedAnalysis(analysis);
                          fetchComments(analysis.id);
                        }}
                    >
                      Комментарии
                    </button>
                  </div>
              ))}
            </div>
          </div>

          {/* Секция комментариев */}
          {selectedAnalysis && (
              <div
                  style={{
                    flex: 1,
                    borderLeft: '1px solid #ddd',
                    padding: '20px',
                    overflowY: 'auto',
                  }}
              >
                <h2>Комментарии к {selectedAnalysis.description.split('.')[0]}</h2>
                <div style={{marginTop: '10px'}}>
                  {/* Вывод существующих комментариев */}
                  {comments[selectedAnalysis.id] && comments[selectedAnalysis.id].length > 0 ? (
                      comments[selectedAnalysis.id].map((comment) => (
                          <div
                              key={comment.id}
                              style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '10px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                              }}
                          >
                            {editingCommentId === comment.id ? (
                                <div>
                        <textarea
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              marginBottom: '10px',
                            }}
                            value={editedCommentText}
                            onChange={(e) => setEditedCommentText(e.target.value)}
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
                                      onClick={() => {
                                        handleUpdateComment(comment.id, selectedAnalysis.id, editedCommentText);
                                        setEditingCommentId(null);
                                      }}
                                  >
                                    Сохранить
                                  </button>
                                  <button
                                      style={{
                                        padding: '5px 10px',
                                        backgroundColor: 'rgba(220,53,69,0.7)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => setEditingCommentId(null)}
                                  >
                                    Отмена
                                  </button>
                                </div>
                            ) : (
                                <div>
                                  <p>{comment.description}</p>
                                  {currentUserId === comment.user_id && (
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
                                          onClick={() => handleDeleteComment(comment.id, selectedAnalysis.id)}
                                      >
                                        Удалить
                                      </button>
                                  )}
                                  {currentUserId === comment.user_id && (
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
                                            setEditingCommentId(comment.id);
                                            setEditedCommentText(comment.description);
                                          }}
                                      >
                                        Изменить
                                      </button>
                                  )}
                                </div>
                            )}
                          </div>
                      ))
                  ) : (
                      <p>Нет комментариев.</p>
                  )}
                </div>

                {/* Поле для добавления нового комментария */}
                <div style={{marginTop: '20px'}}>
              <textarea
                  placeholder="Добавить комментарий..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    marginBottom: '10px',
                  }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
              />
                  <button
                      style={{
                        padding: '10px 15px',
                        backgroundColor: 'rgba(40,167,69,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        handleAddComment(selectedAnalysis.id, newComment);
                        setNewComment('');
                      }}
                  >
                    Добавить комментарий
                  </button>
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

export default Analis;
