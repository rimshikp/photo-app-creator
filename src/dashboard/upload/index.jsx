import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faTimes,
  faSpinner,
  faCheckCircle,
  faSearch,
  faImage,
  faPlus,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import styles from './PhotoUpload.module.css';
import { api } from '../../utils/api';

const PhotoUpload = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventSearch, setEventSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const searchContainerRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.post("/events/list", {
          page: 1,
          limit: 8,
          search: encodeURIComponent(eventSearch),
        });
        setEvents(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch models');
      }
    };

    if (eventSearch.length > 2) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [eventSearch]);

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      e.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setError('')
    const newFiles = Array.from(e.target.files);
    
    if (files.length + newFiles.length > 5) {
      setError('You can upload a maximum of 5 photos at a time');
      return;
    }

    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== newFiles.length) {
      setError('Only image files under 10MB are allowed');
      return;
    }

    setFiles([...files, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setEventSearch(event.name);
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setEventSearch(e.target.value);
    setShowDropdown(e.target.value.length > 2);
    if (!e.target.value) {
      setSelectedEvent(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uploadPhotos = async () => {
    setError('');

    if (!selectedEvent) {
      setError('Please select a model');
      return;
    }
    
    if (!title) {
      setError('Title is required');
      return;
    }
    
    if (files.length === 0) {
      setError('Please select at least one photo to upload');
      return;
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadStatus('');

    const formData = new FormData();
    formData.append('eventId', selectedEvent._id);
    formData.append('price', price);
    formData.append('title', title);
    tags.forEach(tag => formData.append('tags', tag));
    
    files.forEach((file, index) => {
      formData.append('photos', file);
      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    });

    try {
      const response = await api.post('/photos', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.event.target) {
            const fileIndex = progressEvent.event.target.fileIndex;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => ({
              ...prev,
              [fileIndex]: percentCompleted
            }));
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const statusUpdate = {};
      files.forEach((_, index) => {
        statusUpdate[index] = 'success';
      });
      setUploadStatus(statusUpdate);
      
      setTimeout(() => {
        setFiles([]);
        setPreviews([]);
        setUploadProgress({});
        setUploadStatus({});
        setIsUploading(false);
        setPrice('');
        setTitle('');
        setTags([]);
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setIsUploading(false);
      const statusUpdate = {};
      files.forEach((_, index) => {
        statusUpdate[index] = 'failed';
      });
      setUploadStatus(statusUpdate);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Upload Photos</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup} ref={searchContainerRef}>
          <label className={styles.label}>Select Model</label>
          <div className={styles.searchContainer}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search models..."
              value={eventSearch}
              onChange={handleSearchChange}
              onClick={() => eventSearch.length > 2 && setShowDropdown(true)}
            />
          </div>
          
          {showDropdown && (
            <div className={styles.dropdown}>
              {events.length > 0 ? (
                events.map(event => (
                  <div 
                    key={event._id} 
                    className={styles.dropdownItem}
                    onClick={() => handleEventSelect(event)}
                  >
                    {event.name}
                  </div>
                ))
              ) : (
                <div className={styles.dropdownEmpty}>
                  {eventSearch.length > 2 ? 'No models found' : 'Type at least 3 characters to search'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="20"
            disabled={isUploading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Price (INR)</label>
          <div className={styles.priceInputContainer}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              type="number"
              className={styles.input}
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              step="0.01"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tags</label>
          <div className={styles.tagInputContainer}>
            <div className={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  {tag}
                  <button 
                    type="button"
                    className={styles.removeTag}
                    onClick={() => removeTag(index)}
                    disabled={isUploading}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                className={styles.tagInput}
                placeholder={tags.length === 0 ? "Add tags (press Enter to add)" : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                disabled={isUploading}
              />
            </div>
            <div className={styles.tagHint}>
              <FontAwesomeIcon icon={faTag} /> Press Enter to add tags
            </div>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Photos (Max 5)</label>
          
          <div 
            className={styles.uploadArea}
            onClick={() => !isUploading && fileInputRef.current.click()}
            style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className={styles.fileInput}
              disabled={files.length >= 5 || isUploading}
            />
            
            {files.length === 0 ? (
              <div className={styles.uploadPrompt}>
                <FontAwesomeIcon icon={faImage} size="3x" />
                <p>Click to browse or drag and drop photos</p>
                <p className={styles.uploadHint}>JPEG, PNG up to 10MB each</p>
              </div>
            ) : (
              <div className={styles.thumbnailsContainer}>
                {previews.map((preview, index) => (
                  <div key={index} className={styles.thumbnailWrapper}>
                    <div className={styles.thumbnail}>
                      <img src={preview} alt={`Preview ${index}`} />
                      {!isUploading && (
                        <button 
                          className={styles.removeThumbnail}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                      
                      {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                          <div className={styles.progressText}>
                            {uploadProgress[index]}%
                          </div>
                        </div>
                      )}
                      
                      {uploadStatus[index] === 'success' && (
                        <div className={styles.uploadSuccess}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                      )}
                      
                      {uploadStatus[index] === 'failed' && (
                        <div className={styles.uploadFailed}>
                          Upload Failed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {files.length < 5 && !isUploading && (
                  <div 
                    className={styles.addMore}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                    <span>Add more</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.fileCount}>
            {files.length} of 5 photos selected
            {files.length > 0 && !isUploading && (
              <button 
                className={styles.clearAllButton}
                onClick={() => {
                  setFiles([]);
                  setPreviews([]);
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.actions}>
          <button
            className={styles.uploadButton}
            onClick={uploadPhotos}
            disabled={isUploading || files.length === 0 || !selectedEvent  || !title}
          >
            {isUploading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} />
                <span>Upload Photos</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;