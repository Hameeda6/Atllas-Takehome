import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import '../styles/globals.css';
import AddUserPopup from '../components/AddUserPopup'; 
import type { AppProps } from 'next/app';
import { response } from 'express';
import SortingPopup from '../components/SortingPopup';
import SortingPopupBox from '../components/SortingPopupBox';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [users, setUsers] = useState([]);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSortingPopupVisible, setIsSortingPopupVisible] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [openSortField, setOpenSortField] = useState<string | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchButtonClicked, setSearchButtonClicked] = useState(false); 
  const [deleteConfirmationPosition, setDeleteConfirmationPosition] = useState<{ top: string; left: string }>({ top: '0px', left: '0px' });
  //const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(false);
 
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:50000/users');
      console.log("response.data", response.data.data)
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
  
    fetchUsers(); // Initial fetch when app loads
  }, []);


  useEffect(() => {
    // Step 1: Set up an event listener for window resize
    const handleResize = () => {
      console.log("Window Width:", window.innerWidth, "Is Mobile:", isMobile);
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);

    // Step 1: Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEdit = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isEditMode: true } : user
    );
    setUsers(updatedUsers);
  };
  const handleEditChange = (e, userId, field) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, [field]: e.target.value };
      }
      return user;
    });
    setUsers(updatedUsers);
  };
  
  

  const handleSave = async (userId) => {
  const userToUpdate = users.find((user) => user.id === userId);
  try {
    // Update user data in the frontend
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...userToUpdate, isEditMode: false } : user
    );

    setUsers(updatedUsers);
    const response = await axios.put(`http://localhost:50000/saveusers/${userId}`, {
      
      firstName: userToUpdate.firstName,
      middleName: userToUpdate.middleName,
      lastName: userToUpdate.lastName,
      email: userToUpdate.email,
      phoneNumber: userToUpdate.phoneNumber,
      address: userToUpdate.address,
      adminNotes: userToUpdate.adminNotes,
    });
    console.log("ress",response.data);
  } catch (error) {
    console.error(error);
  }
};

const handleDelete = async (userId, event) => {
  const buttonElement = event.currentTarget;
  const rowElement = buttonElement.closest('tr');
  
  const selectedUserIdAsInt = parseInt(selectedUserId, 10);
  console.log(selectedUserIdAsInt)
  const { top, right } = event.currentTarget.getBoundingClientRect();
  const position = {
    top: `${selectedUserId}px`, 
    left: 'auto',
    right: '0px',
  };
  console.log('Position:', position);
  setSelectedUserId(userId);
  setDeleteConfirmationPosition(position);
  setDeleteConfirmationVisible(true);
};


const handleConfirmDelete = async () => {
  try {
    // Perform the delete operation using the selectedUserId
    await axios.delete(`http://localhost:50000/users/${selectedUserId}`);
    fetchUsers(); // Fetch updated user list

    // Close the confirmation dialog
    setDeleteConfirmationVisible(false);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const handleCancelDelete = () => {

  // Close the confirmation dialog without performing the delete operation
  setDeleteConfirmationVisible(false);
};
const handleSearch = async () => {
  setSearchButtonClicked(true);
  console.log("search button clicked", searchInput)
  try {
    const response = await axios.get(`http://localhost:50000/searchusers?search=${searchInput}`);
    console.log("search",response.data.data)
    setUsers(response.data.data);
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

const handleSortAscending = (field: string) => {
  setOpenSortField(field);
  fetchData(field, 'asc');
  setIsSortingPopupVisible(false);
};
const handleSortDescending = (field: string) => {
  setOpenSortField(field);
  fetchData(field, 'desc');
  setIsSortingPopupVisible(false);
};

const handleClearSearch = () => {
  setSearchButtonClicked(false);
  setSearchInput(''); // Clear the search input
  fetchUsers(); // Fetch all users ie returning to original state
};

const handleSortPopupToggle = (field: string) => {
  if (openSortField === field) {
    setOpenSortField(null);
  } else {
    setOpenSortField(field);
  }
};
const fetchData = async (sortField: string, sortOrder: string) => {
  try {
    const response = await axios.get('http://localhost:50000/users');
    let users = response.data.data;

    if (sortField) {
      users = [...users].sort((a, b) => {
        if (sortOrder === 'asc') {
          if (a[sortField] < b[sortField]) return -1;
          if (a[sortField] > b[sortField]) return 1;
          return 0;
        } else if (sortOrder === 'desc') {
          if (a[sortField] > b[sortField]) return -1;
          if (a[sortField] < b[sortField]) return 1;
          return 0;
        }
      });
    }

    setUsers(users);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

  return (
    <>
      <Head>
        <title>Atllas Takehome</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/public/favicon.ico' />
      </Head>
      <main className={inter.className}>
        <h1 className='border-b border-neutral-300 px-4 py-2 text-2xl font-medium text-center'>
          User Management
        </h1>
        <div className='flex justify-center mt-4 space-x-1'>
          <button className='border border-gray-300 p-2 sm:p-3 lg:p-2 rounded-lg text-center bg-grey-500 font-bold hover:bg-gray-200 hover:border-gray-400 sm:w-40 sm:h-10 lg:w-40 lg:h-10' onClick={() => setIsAddPopupVisible(true)}>
            Add New User
          </button>
          
          <input
            className='border border-gray-300 p-2 sm:p-3 lg:p-4 tex-center rounded-lg hover:bg-gray-200 hover:border-gray-400 sm:w-32 lg:w-32 sm:h-6 lg:h-10'
            type='text'
            placeholder='Search'
            onChange={(e) => setSearchInput(e.target.value)}
          />
           <button className='border border-gray-300 p-2 sm:p-3 lg:p-2 text-center rounded-lg hover:bg-gray-200 hover:border-gray-400 bg-grey-500 font-bold sm:w-32 lg:w-32 sm:h-6 lg:h-10' onClick={handleSearch}>Search</button>
           
           {searchButtonClicked && searchInput && ( 
          <button
            className='border border-gray-300 p-2 sm:p-3 lg:p-2 rounded-lg font-bold hover:bg-gray-200 hover:border-gray-400 sm:w-32 lg:w-32 sm:h-6 lg:h-10'
            onClick={handleClearSearch}
          >
            Clear
          </button>
        )}
        </div>
        <div className='table-container mt-4'>
          <table className='table w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
              <th className="p-2 w-16 sm:p-3 border border-gray-300 ">
      <div className="flex items-center space-x-1">
        ID
        <img
          src="arrow1.png"
          className="ml-1 cursor-pointer w-4 h-3"
          onClick={() => handleSortPopupToggle('id')}
        />
      </div>
      {openSortField === 'id' && (
        <SortingPopupBox
          onSortAscending={() => {
            handleSortAscending('id');
            setOpenSortField(null); // Close the popup
          }}
          onSortDescending={() => {
            handleSortDescending('id');
            setOpenSortField(null); // Close the popup
          }}
            />
          )}
        </th>
        <th className="p-2 w-48 sm:w-24 border border-gray-300">
            <div className="flex items-center justify-center space-x-1">
              First Name
              <img
                src="arrow1.png"
                className="ml-1 cursor-pointer w-4 h-3"
                onClick={() => handleSortPopupToggle('firstName')}
              />
            </div>
            {openSortField === 'firstName' && (
              <SortingPopupBox
                onSortAscending={() => {
                  handleSortAscending('firstName');
                  setOpenSortField(null); // Close the popup
                }}
                onSortDescending={() => {
                  handleSortDescending('firstName');
                  setOpenSortField(null); // Close the popup
                }}
              />
            )}
          </th>

            <th className="p-2 w-36 border border-gray-300 sm:w-40">
          <div className="flex items-center justify-center space-x-1">
            Middle Name
            <img
              src="arrow1.png"
              className="ml-1 cursor-pointer w-4 h-3"
              onClick={() => handleSortPopupToggle('middleName')}
            />
          </div>
          {openSortField === 'middleName' && (
            <SortingPopupBox
              onSortAscending={() => {
                handleSortAscending('middleName');
                setOpenSortField(null); // Close the popup
              }}
              onSortDescending={() => {
                handleSortDescending('middleName');
                setOpenSortField(null); // Close the popup
              }}
            />
          )}
        </th>

              <th className="p-2 w-32 border border-gray-300 sm:w-40">
        <div className="flex items-center justify-center space-x-1">
          Last Name
          <img
            src="arrow1.png"
            className="ml-1 cursor-pointer w-4 h-3"
            onClick={() => handleSortPopupToggle('lastName')}
          />
        </div>
        {openSortField === 'lastName' && (
          <SortingPopupBox
            onSortAscending={() => {
              handleSortAscending('lastName');
              setOpenSortField(null); // Close the popup
            }}
            onSortDescending={() => {
              handleSortDescending('lastName');
              setOpenSortField(null); // Close the popup
            }}
          />
        )}
      </th>

        <th className="p-2 text-center border border-gray-300 sm:w-40">
          <div className="flex items-center justify-center space-x-1">
            Email
            <img
              src="arrow1.png"
              className="ml-1 cursor-pointer w-4 h-3"
              onClick={() => handleSortPopupToggle('email')}
            />
          </div>
          {openSortField === 'email' && (
            <SortingPopupBox
              onSortAscending={() => {
                handleSortAscending('email');
                setOpenSortField(null); // Close the popup
              }}
              onSortDescending={() => {
                handleSortDescending('email');
                setOpenSortField(null); // Close the popup
              }}
            />
          )} 
        </th> 
              
                <th className='p-2 border border-gray-300 sm:w-40'>Phone Number </th>
                <th className={`p-2 border border-gray-300 ${isMobile ? 'hidden' : 'sm:w-40'}`}>Address</th>


                {/* <th className={`p-2 border border-gray-300 ${isMobile ? 'sm:hidden' : 'sm:w-40'}`}>Address</th> */}
                <th className='p-2  sm:w-40 border border-gray-300'>Admin Notes</th>
                <th className='p-2 border border-gray-300 sm:w-40'>Action Item</th> 
              </tr>
            </thead>
            
            <tbody>
              <tr>
              <td>
              {openSortField === 'id' && (
                <SortingPopup
                  onSortAscending={() => {

                    // Handle ascending sorting for the selected field
                    setOpenSortField(null); // Close the popup
                  }}
                  onSortDescending={() => {

                    // Handle descending sorting for the selected field
                    setOpenSortField(null); // Close the popup
                  }}
                />
              )}
            </td>
                <td>
              {openSortField === 'firstName' && (
                <SortingPopup
                  onSortAscending={() => {
                    setOpenSortField(null);
                  }}
                  onSortDescending={() => {
                    setOpenSortField(null); 
                  }}
                />
              )}
            </td>

            <td>
              {openSortField === 'middleName' && (
                <SortingPopup
                  onSortAscending={() => {
                    setOpenSortField(null); 
                  }}
                  onSortDescending={() => {
                    setOpenSortField(null); 
                  }}
                />
              )}
            </td>
            <td>
              {openSortField === 'lastName' && (
                <SortingPopup
                  onSortAscending={() => {
                    setOpenSortField(null); 
                  }}
                  onSortDescending={() => {
                    setOpenSortField(null); 
                  }}
                />
              )}
            </td>
            <td>
              {openSortField === 'email' && (
                <SortingPopup
                  onSortAscending={() => {
                    setOpenSortField(null); 
                  }}
                  onSortDescending={() => {
                    setOpenSortField(null);
                  }}
                />
              )}
            </td>
                
              </tr>
  {users.map(user => (
    <tr key={user.id} className='hover:bg-gray-100'>
      <td className='p-2 hover:bg-gray-200'>{user.id}</td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.firstName}
            onChange={(e) => handleEditChange(e, user.id, 'firstName')}
          />
        ) : (
          user.firstName
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.middleName}
            onChange={(e) => handleEditChange(e, user.id, 'middleName')}
          />
        ) : (
          user.middleName
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.lastName}
            onChange={(e) => handleEditChange(e, user.id, 'lastName')}
          />
        ) : (
          user.lastName
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.email}
            onChange={(e) => handleEditChange(e, user.id, 'email')}
          />
        ) : (
          user.email
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.phoneNumber}
            onChange={(e) => handleEditChange(e, user.id, 'phoneNumber')}
          />
        ) : (
          user.phoneNumber
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.address}
            onChange={(e) => handleEditChange(e, user.id, 'address')}
          />
        ) : (
          user.address
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
        {user.isEditMode ? (
          <input
            type='text'
            value={user.adminNotes}
            onChange={(e) => handleEditChange(e, user.id, 'adminNotes')}
          />
        ) : (
          user.adminNotes
        )}
      </td>
      <td className='p-2 hover:bg-gray-200'>
  {user.isEditMode ? (
    <div className='flex space-x-2'>
      <span className='cursor-pointer px-2 py-1 border rounded border-gray-300 hover:bg-gray-100 text-black-500 bg-blue-500 font-bold' onClick={() => handleSave(user.id)}>Save</span>
      {/* <span className='cursor-pointer px-2 py-1 border rounded border-gray-300 hover:bg-gray-100 text-blue-500' onClick={() => handleEdit(user.id)}>Edit</span> */}
    </div>
  ) : (
    <div className='flex space-x-2'>
      <span className='cursor-pointer px-2 py-1 border rounded border-gray-300 hover:bg-gray-100 text-black-500 bg-green-500 font-bold' onClick={() => handleEdit(user.id)}>Edit</span>
      <span className='cursor-pointer px-2 py-1 border rounded border-gray-300 hover:bg-gray-100 text-black-500 bg-red-500 font-bold' onClick={() => handleDelete(user.id, event)}>Delete</span>
    </div>
  )}
</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
        <AddUserPopup
  isVisible={isAddPopupVisible}
  onClose={() => setIsAddPopupVisible(false)}
  onUserAdded={() => fetchUsers()}
/>
        <Component {...pageProps} users={users} />
        <DeleteConfirmationPopup
        isVisible={isDeleteConfirmationVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        position={deleteConfirmationPosition}
        selectedUserId={selectedUserId} 
      />
      </main>
    </>
  );
}