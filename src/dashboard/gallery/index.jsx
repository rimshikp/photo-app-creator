import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faTimes, 
  faChevronLeft, 
  faChevronRight,
  faHeart,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import styles from './Gallery.module.css';
import { api } from '../../utils/api';


const Gallery = () => {
    const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventIds, setEventIds] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(20);
 
  useEffect(() => {
    fetchPhotos();
  }, [currentPage, searchQuery]);


   const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await api.post('/photos/get_gallery', {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          eventId: eventIds,
        });
        setPhotos(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  

  const openLightbox = (photo) => {
    navigate(`/dashboard/photos/${photo._id}`);
  };



  return (
    <div className={styles.container}>
      <div className={styles.galleryHeader}>
        <h1 className={styles.title}>Photo Gallery</h1>
        
        <div className={styles.controls}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </form>
          
        </div>
        

      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading photos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className={styles.empty}>
          <p>No photos found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className={styles.galleryGrid}>
            {photos.map(photo => (
              <div key={photo._id} className={styles.galleryItem}>
                <div 
                  className={styles.photoContainer}
                  onClick={() => openLightbox(photo)}
                >
                  <img 
                    src={photo.watermarkImageUrl || photo.compressedImageUrl} 
                    alt={photo.metadata?.originalName || 'Gallery photo'}
                    className={styles.photo}
                  />
                  <div className={styles.photoOverlay}>
                    <div className={styles.photoInfo}>
                      <span className={styles.eventName}>{photo.event_id?.name || 'Untitled'}</span>
                      <span className={styles.price}>₹{photo.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </>
      )}
      </div>
  );
};

export default Gallery;