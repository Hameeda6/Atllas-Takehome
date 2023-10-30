
import express from 'express'
//import express from 'express';
//import { Express, Request, Response, NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { attachSequelize } from './middleware/db';
import IRoute from './types/IRoute';
import UsersRouter from './routes/users';
import { User } from './services/db'; 
import { Op } from 'sequelize';



const app = express();

const appCfg = {
  port: parseInt(process.env.EXPRESS_PORT) || 50000,
  hostname: process.env.EXPRESS_HOST ?? '127.0.0.1',
};
app.use(attachSequelize);


const allowedOrigins = ['http://localhost:3000']; 
app.use(
  cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

const _ROUTES_ROOT = resolve(join(__dirname, './routes/'));
const queue = readdirSync(_ROUTES_ROOT)
  .map(entry => join(_ROUTES_ROOT, entry)) 
  .filter(isFile);

//injecting each item in the queue as an API route
queue.forEach(entry => {
  try {
    const required = require(entry);
    if (required?.default) {
      const { route, router }: IRoute = required.default;
      app.use(route, router());

      console.log('Injected route "%s"', route);
    } else {
      console.error('Invalid route: "%s". No `default` key defined.', entry);
    }
  } catch (e) {
    console.error('Failed to inject route on entry "%s".', entry, e);
  }
});

app.options('*', cors());

app.listen(appCfg.port, appCfg.hostname, () => {
  console.log(`Listening on http://${appCfg.hostname}:${appCfg.port}/`);
});

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch (ignored) {
    return false;
  }
}

app.get('/checkEmail/:email', async (req, res) => {
  const email = req.params.email;
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.json({ exists: true }); // Email exists
    } else {
      res.json({ exists: false }); // Email doesn't exist
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: 'Error checking email' });
  }
});


app.post('/users', async (req, res) => {
  console.log("inside add");
  try {
    console.log('req', req);
    const newUser = req.body; 

    console.log('New user added:', newUser);
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Retrieve the user by ID from the database
    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await userToDelete.destroy();
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});


app.put('/saveusers/:id', async (req, res) => {
  console.log()
  const userId = req.params.id;
  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber,
    address,
    adminNotes,
  } = req.body;

  try {

    // Retrieve the user by ID from the database
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user properties based on the request data
    userToUpdate.firstName = firstName;
    userToUpdate.middleName = middleName;
    userToUpdate.lastName = lastName;
    userToUpdate.email = email;
    userToUpdate.phoneNumber = phoneNumber;
    userToUpdate.address = address;
    userToUpdate.adminNotes = adminNotes;

    // Save the updated user
    await userToUpdate.save();

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

//query to search the users
app.get('/searchusers', async (req, res) => {
  console.log("req search 1")
  try {
    console.log("req search", req.query)
    const searchQuery = req.query.search || ''; 
    console.log("search query", searchQuery)
    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchQuery}%` } },
          { middleName: { [Op.like]: `%${searchQuery}%` } },
          { lastName: { [Op.like]: `%${searchQuery}%` } },
          { email: { [Op.like]: `%${searchQuery}%` } },
          { phoneNumber: { [Op.like]: `%${searchQuery}%` } },
          { address: { [Op.like]: `%${searchQuery}%` } },
          { adminNotes: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    const users = await User.findAll({ where: whereClause });

    res.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});
 


