
import styles from '../PhotoDetail.module.css';

const PhotoDetails = ({ photo }) => {


   


  return (
    <div className={styles.detailsContainer}>
      <h3>Photo Details</h3>
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <h4>Technical Details</h4>
          <ul>
            <li><strong>Resolution:</strong> {photo.metadata?.width} × {photo.metadata?.height}</li>
            <li><strong>Format:</strong> {photo.metadata?.format}</li>
            <li><strong>Original Size:</strong> {(photo.metadata?.originalSize / 1024 / 1024).toFixed(2)} MB</li>
            <li><strong>Compressed Size:</strong> {(photo.metadata?.compressedSize / 1024 / 1024).toFixed(2)} MB</li>
          </ul>
        </div>
        
        <div className={styles.detailItem}>
          <h4>Statistics</h4>
          <ul>
            <li><strong>Likes:</strong> {photo?.likesCount || 0}</li>
            <li><strong>Favorites:</strong> {photo?.favoritesCount || 0}</li>
            <li><strong>Purchases:</strong> {photo?.isPurchased || 0}</li>
            <li><strong>Rating:</strong> {photo?.averageRating || 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;