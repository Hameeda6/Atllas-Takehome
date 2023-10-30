import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import '../styles/styles.css';
import styles from './AddUserPopup.module.css';

interface AddUserPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserPopup: React.FC<AddUserPopupProps> = ({
  isVisible,
  onClose,
  onUserAdded,
}) => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    middleName:'',
    lastName:'',
    email:'',
    phoneNumber:'',
    address:'',
    adminNotes: '',
  });
  const requiredFields = ['firstName', 'lastName', 'email','phoneNumber'];
  const [isMobile, setIsMobile] = useState(false);
  const [emailError, setEmailError] = useState('');


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); 
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError(''); 
    }

    setNewUser((prevUser) => ({
      ...prevUser,
      email: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
  
    try {
      // Check if the email already exists in the database
      const response = await axios.get(`http://localhost:50000/checkEmail/${newUser.email}`);
  
      if (response.data.exists) {
        // Email already exists, show an error message
        alert('Email ID already present in the table');
      } else {
        // Email doesn't exist, proceed to add the user
        await axios.post('http://localhost:50000/users', newUser);
        onClose(); // Close the popup after successful addition
        onUserAdded(); // Trigger a refetch of users to update the table
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  


  return (
  <div className={`fixed inset-0 flex items-center justify-center bg-black sbg-gray-800 bg-opacity-75 ${isVisible ? 'block' : 'hidden'} `}>
{/* <div className={`bg-white p-4 rounded shadow-md md:p-4 ${isMobile ? 'mobile-popup' : ''}`}> */}
<div className={`bg-white p-4 rounded shadow-md md:p-4 ${isMobile ? styles['mobile-popup'] : styles.popup}`}>
 
    
        <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-4 '>Add New User</h2>
        <form onSubmit={handleSubmit}>
          
          <label className='block mb-2 sm:mb-1'>
            First Name {requiredFields.includes('firstName') && <span className="text-red-500">*</span>}:
            <input
              type='text'
              name='firstName'
              value={newUser.firstName}
              onChange={handleInputChange}
              className='border rounded w-full p-1'
              required={requiredFields.includes('firstName')}
            />
          </label>
          <label className='block mb-2 sm:mb-1'>
            Middle Name:
            <input
              type='text'
              name='middleName'
              value={newUser.middleName}
              onChange={handleInputChange}
              className='border rounded w-full p-1'
            />
          </label>
          <label className='block mb-2 sm:mb-1'>
            Last Name: {requiredFields.includes('lastName') && <span className="text-red-500">*</span>}:
            <input
              type='text'
              name='lastName'
              value={newUser.lastName}
              onChange={handleInputChange}
              className='border rounded w-full p-1'
              required={requiredFields.includes('firstName')}
            />
          </label>
          <label className='block mb-2 sm:mb-1'>
            Email: {requiredFields.includes('email') && <span className="text-red-500">*</span>}:
            <input
              type='text'
              name='email'
              value={newUser.email}
            onChange={handleEmailChange}
              className='border rounded w-full p-1'
              required={requiredFields.includes('firstName')}
            />
          </label>
          {emailError && <div className='text-red-500'>{emailError}</div>}
          <label className='block mb-2 sm:mb-1'>
            Phone Number: {requiredFields.includes('phoneNumber') && <span className="text-red-500">*</span>}:
            <input
              type='number'
              name='phoneNumber'
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              className='border rounded w-full p-1'
              required={requiredFields.includes('firstName')}
            />
          </label>
          <label className='block mb-2 sm:mb-1'>
            Address:
            <input
              type='text'
              name='address'
              value={newUser.address}
              onChange={handleInputChange}
              className='border rounded w-full p-1'
            />
          </label>
          <label className='block mb-2 sm:mb-1'>
            Admin Notes:
            <input
              type='text'
              name='adminNotes'
              value={newUser.adminNotes}
              onChange={handleInputChange}
              className='border rounded w-full p-1'
            />
          </label>
          <div className='flex justify-end mt-4 sm:mb-1'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 bg-gray-300 rounded'
            >
              Close
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded sm:mb-1'
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;

