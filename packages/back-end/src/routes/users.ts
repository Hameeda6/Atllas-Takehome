import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';

const UsersRouter: IRoute = {
  route: '/users',
  router() {
    const router = Router();

    router.post('/', async (req, res) => {
      try {
        const newUser = await User.create(req.body); 
        console.log('New user added:', newUser.toJSON());
        res.status(201).json({ message: 'User added successfully' });
      } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Error adding user' });
      }
    });
    router.route('/')
    .get(async (req, res) => {
      return User.findAll({
        attributes: ['id', 'registered', 'firstName', 'middleName', 'lastName', 'email', 'phoneNumber', 'address', 'adminNotes', 'createdAt', 'updatedAt']
      })
      .then(users => {
        return res.json({
          success: true,
          data: users,
        });
      })
      .catch(err => {
        console.error('Failed to list all users.', err);
        res.status(500).json({
          success: false,
        });
      });
    });
  

  return router;
},
};

export default UsersRouter;