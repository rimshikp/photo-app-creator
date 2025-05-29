import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import styles from '../PhotoDetail.module.css';

const FavoritesList = ({ photoId }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
       const response = await api.post(`/photos/favorite_users/`,{photo_id:photoId,page:currentPage});
        setFavorites(response?.data?.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [photoId, currentPage]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading favorites...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div>
      <h3 style={{color:"#fff"}}>Users who favorited this photo</h3>
      {favorites.length === 0 ? (
        <p>No users have favorited this photo yet</p>
      ) : (
        <>
          <div className={styles.userList}>
            {favorites?.map(user => (
              <div key={user?.user_id?._id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {user?.user_id?.profile ? (
                    <img src={user?.user_id?.profile} alt={user?.user_id?.full_name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user?.user_id?.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <h4>{user?.user_id?.full_name}</h4>
                  <p>{user?.user_id?.email}</p>
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

export default FavoritesList;