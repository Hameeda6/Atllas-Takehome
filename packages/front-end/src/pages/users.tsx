import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { User } from '/back-end/src/services/db';

const UsersPage = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post('/api/addUser', {
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        address,
        adminNotes,
      });
      console.log(response.data);
      fetchUsers();
      clearFields();
    } catch (error) {
      console.error(error);
    }
  };
  const updateUser = async (user) => {
    try {
      const response = await axios.put(`/api/updateUser/${user.id}`, user);
      console.log(response.data);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };


  const clearFields = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setAdminNotes('');
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.editMode ? (
              <div>
                <input
                  type="text"
                  value={user.firstName}
                  onChange={(e) => user.setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  value={user.middleName}
                  onChange={(e) => user.setMiddleName(e.target.value)}
                />
                <input
                  type="text"
                  value={user.lastName}
                  onChange={(e) => user.setLastName(e.target.value)}
                />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => user.setEmail(e.target.value)}
                />
                <input
                  type="text"
                  value={user.phoneNumber}
                  onChange={(e) => user.setPhoneNumber(e.target.value)}
                />
                <input
                  type="text"
                  value={user.address}
                  onChange={(e) => user.setAddress(e.target.value)}
                />
                <input
                  type="text"
                  value={user.adminNotes}
                  onChange={(e) => user.setAdminNotes(e.target.value)}
                />
                <button onClick={() => updateUser(user)}>Save</button>
              </div>
              ) : (
                <div>
                  {user.firstName} {user.lastName} - {user.email}
                  <button onClick={() => user.setEditMode(true)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  
};

export default UsersPage;
