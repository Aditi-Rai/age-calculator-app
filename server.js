const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to calculate age from a given date of birth
function calculateAge(dob) {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    return null;
  }
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    // Get the number of days in the previous month
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

// GET /age endpoint to calculate age based on provided dob query parameter
app.get('/age', (req, res) => {
  const dob = req.query.dob; // expected format: YYYY-MM-DD
  if (!dob) {
    return res.status(400).json({ error: 'Date of birth (dob) query parameter is required in YYYY-MM-DD format' });
  }
  
  const age = calculateAge(dob);
  if (!age) {
    return res.status(400).json({ error: 'Invalid date format for dob. Expected format: YYYY-MM-DD' });
  }
  
  res.json({ dob, age });
});

app.listen(PORT, () => {
  console.log(`Age Calculator App is running on port ${PORT}`);
});
