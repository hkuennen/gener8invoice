import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [data, setData] = useState({
    date: "",
    programming: "",
  });

useEffect(() => {
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => {
      setData({
        date: data.Date,
        programming: data.programming,
      });
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React and Flask</h1>
        <p>{data.date}</p>
        <p>{data.programming}</p>
      </header>
    </div>
  );
}

export default App;