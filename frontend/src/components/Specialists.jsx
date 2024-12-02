import React, { useEffect, useState } from 'react';

function SpecialistsList() {
  const [specialists, setSpecialists] = useState([]);

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

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '20px' }}>
      {specialists.map((specialist) => (
        <div key={specialist.id} style={{ border: '1px solid #ddd', borderRadius: '8px', width: '300px', margin: '10px', padding: '15px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <img
            src={specialist.photo_url}
            alt={`${specialist.name} photo`}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          <h3 style={{ margin: '10px 0' }}>{specialist.name}</h3>
          <p><strong>Email:</strong> {specialist.email}</p>
          <p><strong>Phone:</strong> {specialist.phone_number}</p>
          <p><strong>Years of Experience:</strong> {specialist.years_of_experience}</p>
          <p><strong>Description:</strong> {specialist.description}</p>
          <p><strong>Social media:</strong> {specialist.social_media_url}</p>
        </div>
      ))}
    </div>
  );
}

export default SpecialistsList;
