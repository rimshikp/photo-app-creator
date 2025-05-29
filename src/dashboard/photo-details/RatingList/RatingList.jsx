import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import styles from '../PhotoDetail.module.css';

const RatingsList = ({ photoId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await api.post(`/photos/rate_users`, { 
          photo_id: photoId,
          page: currentPage 
        });
        setRatings(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [photoId, currentPage]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading ratings...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div>
      <h3>Users who rated this photo</h3>
      {ratings.length === 0 ? (
        <p>No users have rated this photo yet</p>
      ) : (
        <>
          <div className={styles.userList}>
            {ratings.map(rating => (
              <div key={rating._id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {rating?.user_id?.profile ? (
                    <img 
                      src={rating?.user_id?.profile} 
                      alt={rating?.user_id?.full_name} 
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {rating?.user_id?.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <h4>{rating?.user_id?.full_name}</h4>
                  <p>{rating?.user_id?.email}</p>
                  <div className={styles.purchaseDetails}>
                    <span>Rating: {renderStars(rating.rating)}</span>
                    <span>Date: {new Date(rating.createdAt).toLocaleDateString()}</span>
                    {rating.comment && (
                      <div className={styles.comment}>
                        <p>"{rating.comment}"</p>
                      </div>
                    )}
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
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to render star ratings
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span 
        key={i} 
        style={{ 
          color: i <= rating ? '#ffc107' : '#e4e5e9',
          fontSize: '1.2rem'
        }}
      >
        ★
      </span>
    );
  }
  return <span>{stars}</span>;
};

export default RatingsList;