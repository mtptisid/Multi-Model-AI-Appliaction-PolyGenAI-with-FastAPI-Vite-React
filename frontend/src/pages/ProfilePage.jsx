import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiUpload, FiArrowLeft } from 'react-icons/fi';
import styles from '../styles';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ id: null, name: '', email: '' });
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.token) {
        alert('Please log in to view your profile.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/user/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }

        const data = await response.json();
        setUserDetails(data);
        setNewName(data.name);
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to load user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, [user?.token, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!userDetails.id || !user?.token) {
      alert('User not authenticated.');
      return;
    }

    if (!newName.trim()) {
      alert('Name cannot be empty.');
      return;
    }

    const updateData = { name: newName };
    if (newPassword.trim()) {
      updateData.password = newPassword;
    }

    try {
      const response = await fetch(`/api/user/update/${userDetails.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUserDetails(updatedUser);
      setNewName(updatedUser.name);
      setNewPassword('');
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div style={{ ...styles.container, flexDirection: 'column' }}>
      <nav style={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            style={styles.backButton}
            onClick={() => navigate('/api/ai_chat/home')}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ffffff')}
            aria-label="Back to Home"
          >
            <FiArrowLeft size={18} color="#4b5563" />
          </button>
          <h1 style={styles.appName}>Profile & Settings</h1>
        </div>
      </nav>

      <div style={styles.profileContainer}>
        <div style={styles.profilePictureContainer}>
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" style={styles.profilePicture} />
          ) : (
            <div style={styles.profilePicture}>
              <FiUser size={60} color="#6b7280" />
            </div>
          )}
          <button
            style={styles.uploadButton}
            onClick={() => fileInputRef.current.click()}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ffffff')}
          >
            <FiUpload size={18} style={{ marginRight: '0.5rem' }} />
            Upload Picture
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <div style={styles.inputContainerProfile}>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={styles.input}
          />
          <input type="email" placeholder="Email" value={userDetails.email} disabled style={styles.disabledInput} />
          <input
            type="password"
            placeholder="New Password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button
          style={styles.updateButton}
          onClick={handleUpdate}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;