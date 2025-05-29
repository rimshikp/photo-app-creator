import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone,
  faCamera,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { getUser } from "../../pages/actions/userSlice";

// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { updateProfile } from '../../features/auth/authSlice';
import defaultAvatar from '../../assets/profile-icon.png'; 

import styles from './EditProfile.module.css';
import { api } from "../../utils/api";



export default function EditProfile() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_pic: null
  });
  
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile: user.profile
      });
      setPreviewImage(user.profile || defaultAvatar);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, profile_pic: 'Please select an image file' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profile_pic: 'Image must be less than 2MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, profile_pic: file }));
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      
      if (errors.profile_pic) {
        setErrors(prev => ({ ...prev, profile_pic: '' }));
      }
    }
  };

  const removeProfilePic = () => {
    setFormData(prev => ({ ...prev, profile_pic: null }));
    setPreviewImage(user?.profile_pic || defaultAvatar);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {

      const formDataToSend = new FormData();
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      if (formData.profile_pic) {
        formDataToSend.append('profile', formData.profile_pic);
      }

      await api
        .put(`/users/update/${user?._id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      dispatch(getUser());
        })
      
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        server: error.message || 'Failed to update profile'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Edit Profile</h1>
        <p className={styles.subtitle}>Update your personal information</p>

        {errors.server && (
          <div className={styles.errorMessage}>{errors.server}</div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Profile Picture Section */}
          <div className={styles.profilePicSection}>
            <div className={styles.profilePicContainer}>
              <img 
                src={previewImage} 
                alt="Profile" 
                className={styles.profilePic}
              />
              <button
                type="button"
                className={styles.changePicButton}
                onClick={() => fileInputRef.current.click()}
              >
                <FontAwesomeIcon icon={faCamera} />
                <span>Change</span>
              </button>
              {previewImage !== (user?.profile_pic || defaultAvatar) && (
                <button
                  type="button"
                  className={styles.removePicButton}
                  onClick={removeProfilePic}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {errors.profile_pic && (
              <span className={styles.errorText}>{errors.profile_pic}</span>
            )}
          </div>

          {/* Form Fields */}
          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <FontAwesomeIcon icon={faUser} className={styles.icon} />
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                className={`${styles.input} ${errors.full_name ? styles.error : ''}`}
              />
            </div>
            {errors.full_name && (
              <span className={styles.errorText}>{errors.full_name}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
              />
            </div>
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <FontAwesomeIcon icon={faPhone} className={styles.icon} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              />
            </div>
            {errors.phone && (
              <span className={styles.errorText}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}