import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faHeart,
  faStar,
  faShoppingCart,
  faChevronLeft,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import { api } from "../../utils/api";

import styles from "./PhotoDetail.module.css";
import PhotoDetails from "./PhotoDetails/PhotoDetails";
import LikesList from "./LikesList/LikesList";
import FavoritesList from "./FavoritesList/FavoritesList";
import PurchasesList from "./PurchasesList/PurchasesList";
import TagsInput from "../../components/TagsInput/index";
import RatingsList from "./RatingList/RatingList";



const PhotoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
 
  
  const [editData, setEditData] = useState({
    title: "",
    tags: [],
    price: 0,
  });

  const fetchPhotoDetails = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/photos/fetch-gallery`, {
        photo_id: id,
      });
      setPhoto(response.data.data);
      setEditData({
        title: response.data.data.title,
        tags: response.data.data.tags,
        price: response.data.data.price,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch photo details");
    } finally {
      setLoading(false);
    }
  };

  // const [isSummary, setSummery] = useState(false);


  
  useEffect(() => {
    fetchPhotoDetails();
  }, [id]);


  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log("editData ------", editData);
      const response = await api.put(`/photos/update/${id}`, {
        title: editData.title,
        tags:
          editData.tags.length > 0
            ? editData.tags?.map((tag) => tag?.trim())
            : [],
        price: editData.price,
      });
      fetchPhotoDetails();
      setPhoto(response.data);
      setIsEditing(false);
    } catch (err) {
      console.log("err err", err);
      setError(err.response?.data?.message || "Failed to update photo");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className={styles.errorContainer}>
  //       <p>{error}</p>
  //       <button onClick={() => navigate(-1)} className={styles.backButton}>
  //         <FontAwesomeIcon icon={faChevronLeft} /> Back to Gallery
  //       </button>
  //     </div>
  //   );
  // }


  const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
    try {
      await api.delete(`/photos/delete/${id}`);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete photo");
    }
  }
};

  return (
    <div className={styles.pageContainer}>
      {/* <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FontAwesomeIcon icon={faChevronLeft} /> Back to Gallery
      </button> */}

      <div className={styles.photoHeader}>
        <div className={styles.photoPreview}>
          <img
            src={photo.originalImageUrl}
            alt={photo.title}
            className={styles.mainImage}
          />
        </div>
        <div className={styles.photoInfo}>
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tags</label>
              <TagsInput
                tags={editData.tags}
                setTags={(newTags) =>
                  setEditData({ ...editData, tags: newTags })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={editData.price}
                onChange={handleEditChange}
                step="0.01"
                min="0.01"
              />
            </div>
            <div className={styles.editActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
                <button onClick={handleDelete} className={styles.deleteButton}>
    <FontAwesomeIcon icon={faTrash} /> Delete Photo
  </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("details")}
          className={`${styles.tabButton} ${
            activeTab === "details" ? styles.active : ""
          }`}
        >
          Photo Details
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`${styles.tabButton} ${
            activeTab === "likes" ? styles.active : ""
          }`}
        >
          <FontAwesomeIcon icon={faHeart} /> Likes
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`${styles.tabButton} ${
            activeTab === "favorites" ? styles.active : ""
          }`}
        >
          <FontAwesomeIcon icon={faStar} /> Favorites
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`${styles.tabButton} ${
            activeTab === "purchases" ? styles.active : ""
          }`}
        >
          <FontAwesomeIcon icon={faShoppingCart} /> Purchases
        </button>
        <button
          onClick={() => setActiveTab("ratings")}
          className={`${styles.tabButton} ${
            activeTab === "ratings" ? styles.active : ""
          }`}
        >
          <FontAwesomeIcon icon={faStar} /> Ratings
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "details" && <PhotoDetails photo={photo} />}
        {activeTab === "likes" && <LikesList photoId={photo._id} />}
        {activeTab === "favorites" && <FavoritesList photoId={photo._id} />}
        {activeTab === "purchases" && <PurchasesList photoId={photo._id} />}
        {activeTab === "ratings" && <RatingsList photoId={photo._id} />}
      </div>
    </div>
  );
};

export default PhotoDetailPage;
