import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import styles from '../PhotoDetail.module.css';

const PurchasesList = ({ photoId }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await api.post(`/photos/purchased_users`,{photo_id:photoId,page:currentPage});
        setPurchases(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch purchases');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [photoId, currentPage]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading purchases...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div>
      <h3>Users who purchased this photo</h3>
      {purchases.length === 0 ? (
        <p>No users have purchased this photo yet</p>
      ) : (
        <>
          <div className={styles.userList}>
            {purchases.map(purchase => (
              <div key={purchase._id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {purchase?.user_id?.profile ? (
                    <img src={purchase?.user_id?.profile} alt={purchase?.user_id?.full_name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {purchase?.user_id?.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <h4>{purchase?.user_id?.full_name}</h4>
                  <p>{purchase?.user_id?.email}</p>
                  <div className={styles.purchaseDetails}>
                    <span>Amount: ₹ {purchase.totalAmount}</span>
                    <span>Date: {new Date(purchase.createdAt).toLocaleDateString()}</span>
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

export default PurchasesList;