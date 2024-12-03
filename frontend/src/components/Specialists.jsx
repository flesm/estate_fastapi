import React, { useEffect, useState } from 'react';

function SpecialistsList() {
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState('');

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
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px' }}>
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
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <h3 style={{ margin: '10px 0', fontSize: '16px' }}>{specialist.name}</h3>
            <p style={{ fontSize: '14px' }}><strong>Email:</strong> {specialist.email}</p>
            <p style={{ fontSize: '14px' }}><strong>Phone:</strong> {specialist.phone_number}</p>
            <p style={{ fontSize: '14px' }}><strong>Years of Experience:</strong> {specialist.years_of_experience}</p>
            <p style={{ fontSize: '14px' }}><strong>Description:</strong> {specialist.description}</p>
            <p style={{ fontSize: '14px' }}><strong>Social media:</strong> {specialist.social_media_url}</p>
            <button
              style={{ marginTop: '10px', padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px' }}
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
              <button onClick={() => handleDeleteReview(review.id)}>Удалить</button>
              <button
                onClick={() => {
                  setEditingReviewId(review.id);
                  setEditedReview(review.description);
                }}
              >
                Изменить
              </button>
            </div>
          ))}

          {editingReviewId && (
            <div>
              <textarea
                value={editedReview}
                onChange={(e) => setEditedReview(e.target.value)}
                rows={4}
                style={{ width: '100%', margin: '10px 0' }}
              />
              <button onClick={handleEditReview}>Сохранить</button>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              style={{ width: '100%', margin: '10px 0' }}
              placeholder="Напишите свой отзыв..."
            />
            <button onClick={handleAddReview}>Добавить отзыв</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecialistsList;
