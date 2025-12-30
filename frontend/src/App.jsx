import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null);
  
  // Use environment variable, default to localhost for local dev
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiUrl}/test-db`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Three-Tier K8s Demo 🚀</h1>
      <h2>Frontend is running!</h2>
      <hr />
      <h3>Backend Status:</h3>
      {data ? (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ {data.message} <br/> (DB Time: {data.time})
        </p>
      ) : (
        <p style={{ color: "red" }}>Waiting for Backend...</p>
      )}
    </div>
  )
}

export default App