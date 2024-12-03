import React, { useEffect, useState } from 'react';

function Analis() {
  const [analyses, setAnalyses] = useState([]);

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

  return (
    <div style={{ padding: '20px' }}>
      <h1 align='center'>Аналитика</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ flex: '2', fontWeight: 'bold' }}>
                {analysis.description.split('.')[0]}
              </h3>
              <span style={{ flex: '1', textAlign: 'right' }}>{new Date(analysis.time_created).toLocaleString()}</span>
              <span style={{ flex: '1', textAlign: 'right' }}>Специалист: {analysis.specialist_name}</span>
            </div>
            <p style={{ margin: '0' }}>{analysis.description}</p>
            <button
              style={{
                padding: '10px 15px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
              onClick={() => console.log(`Comment on Analysis ID: ${analysis.id}`)}
            >
              Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analis;
