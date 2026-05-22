const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    userId: 'admin',
    password: 'Admin@123',
    name: 'Workspace Admin',
    email: 'admin@company.com',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 2,
    userId: 'user01',
    password: 'User@123',
    name: 'General User',
    email: 'user01@company.com',
    role: 'General User',
    status: 'Active'
  }
];

const nextUserId = { value: 3 };

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/api/login', async (req, res) => {
  const { userId, password, role } = req.body;
  await delay(2000);
  const user = users.find(
    item => item.userId === userId && item.password === password && item.role === role
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials or role' });
  }

  return res.json({
    token: `fake-jwt-token-${user.userId}-${Date.now()}`,
    user: {
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
});

app.get('/api/users', async (req, res) => {
  await delay(1500);
  return res.json(users.map(u => ({
    id: u.id,
    userId: u.userId,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status
  })));
});

app.post('/api/users', async (req, res) => {
  await delay(1500);
  const { userId, name, email, role, status, password } = req.body;
  if (!userId || !name || !email || !role) {
    return res.status(400).json({ message: 'Missing required user fields' });
  }

  const existing = users.find(item => item.userId === userId || item.email === email);
  if (existing) {
    return res.status(409).json({ message: 'User ID or email already exists' });
  }

  const user = {
    id: nextUserId.value++,
    userId,
    password: password || 'ChangeMe123!',
    name,
    email,
    role,
    status: status || 'Active'
  };
  users.push(user);
  return res.status(201).json(user);
});

app.put('/api/users/:id', async (req, res) => {
  await delay(1500);
  const userIdParam = Number(req.params.id);
  const existing = users.find(item => item.id === userIdParam);
  if (!existing) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email, role, status, password } = req.body;
  existing.name = name || existing.name;
  existing.email = email || existing.email;
  existing.role = role || existing.role;
  existing.status = status || existing.status;
  if (password) {
    existing.password = password;
  }

  return res.json(existing);
});

app.delete('/api/users/:id', async (req, res) => {
  await delay(1500);
  const userIdParam = Number(req.params.id);
  const index = users.findIndex(item => item.id === userIdParam);
  if (index < 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  const deleted = users.splice(index, 1)[0];
  return res.json(deleted);
});

app.get('/api/records', async (req, res) => {
  await delay(1500);
  return res.json([
    { id: 101, title: 'Sales report', status: 'Completed', owner: 'Workspace Admin', updated: '2 days ago' },
    { id: 102, title: 'New feature design', status: 'In progress', owner: 'General User', updated: '4 hours ago' },
    { id: 103, title: 'Support ticket backlog', status: 'Review', owner: 'Workspace Admin', updated: '1 day ago' }
  ]);
});

app.listen(3000, () => {
  console.log('Backend API running on http://localhost:3000');
});
