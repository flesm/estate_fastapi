import React, { useState, useEffect } from 'react';

const News = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  );
};

// Inline styles
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
