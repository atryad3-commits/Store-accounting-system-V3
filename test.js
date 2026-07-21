fetch('http://localhost:3000/api/databases')
  .then(res => res.json())
  .then(console.log);
