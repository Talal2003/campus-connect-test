require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Register new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    // Check if username already exists
    const usernameExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (usernameExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Check if email already exists
    const emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const newUser = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id, username, email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      user: {
        id: newUser.rows[0].id,
        username,
        email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    
    // Validate input
    if (!login || !password) {
      return res.status(400).json({ error: 'Login (username or email) and password are required' });
    }
    
    // Check if user exists (by username or email)
    const user = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1', 
      [login]
    );
    
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.rows[0].id, 
        username: user.rows[0].username,
        email: user.rows[0].email 
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new item
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { 
      type, title, category, description, location, building, date, 
      contactName, contactEmail, contactPhone, imageUrl 
    } = req.body;
    
    // Generate reference number
    const referenceNumber = 'REF-' + Math.floor(Math.random() * 10000);
    
    const newItem = await db.query(
      `INSERT INTO items (
        type, title, category, description, location, building, date, 
        contact_name, contact_email, contact_phone, image_url, 
        reference_number, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        type, title, category, description, location, building, date, 
        contactName, contactEmail, contactPhone, imageUrl, 
        referenceNumber, req.user.id
      ]
    );
    
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Server error while creating item' });
  }
});

// Get all items (with optional filters)
app.get('/api/items', async (req, res) => {
  try {
    const { type, category, status, query } = req.query;
    let sqlQuery = 'SELECT * FROM items WHERE 1=1';
    const params = [];
    
    // Add filters if provided
    if (type) {
      params.push(type);
      sqlQuery += ` AND type = $${params.length}`;
    }
    
    if (category) {
      params.push(category);
      sqlQuery += ` AND category = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      sqlQuery += ` AND status = $${params.length}`;
    }
    
    if (query) {
      params.push(`%${query}%`);
      sqlQuery += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    
    sqlQuery += ' ORDER BY created_at DESC';
    
    const items = await db.query(sqlQuery, params);
    res.json(items.rows);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Server error while fetching items' });
  }
});

// Get user's items
app.get('/api/items/my-items', authenticateToken, async (req, res) => {
  try {
    const items = await db.query(
      'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json(items.rows);
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ error: 'Server error while fetching user items' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 