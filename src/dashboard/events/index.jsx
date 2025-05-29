import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faXmark,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Events.module.css";
import { api } from "../../utils/api";

export default function Events() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    _id: null,
    name: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);


  const fetchEvents = async (page = 1, search = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/events/list", {
        page: page,
        limit: itemsPerPage,
        search: encodeURIComponent(search),
      });
      setData(response.data.data || []);
      setTotalPages(Math.ceil(response?.data?.total / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClick = () => {
    setCurrentItem({
      _id: null,
      name: "",
      description: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setCurrentItem({
      _id: item._id,
      name: item.name,
      description: item.description,
    });
    if (item.cover_photo) {
      setPreviewUrl(item.cover_photo);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!currentItem.name) {
      setError("Name is required");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("images", selectedFile);
      }
      formData.append("name", currentItem.name);
      formData.append("description", currentItem.description);

      let response;
      if (currentItem._id) {
        response = await api.put(`/events/${currentItem._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response?.data?.status) {
        resetForm();
        setShowModal(false);
        fetchEvents(currentPage, searchQuery);
      } else {
        throw new Error(response.data.message || "Failed to save models");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server Error");
    } finally {
      setIsLoading(false);
    }
  };


  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/events/${itemToDelete}`);
      if (response?.data?.status) {
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchEvents(currentPage, searchQuery);
      } else {
        throw new Error(response.data.message || "Failed to add models");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server Error");
    }
  };

  const resetForm = () => {
    setCurrentItem({
      _id: null,
      name: "",
      description: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
  };

  const handleClearAll = () => {
    resetForm();
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Models</h1>
          <div className={styles.searchAndAdd}>
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search models..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {/* <button className={styles.addButton} onClick={handleAddClick}>
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Item</span>
            </button>*/}
          </div> 
        </div>

        {isLoading ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>SL</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Description</th>
                  <th className={styles.th}>Created At</th>
                  {/* <th className={styles.th}>Manage</th> */}
                </tr>
              </thead>
              <tbody>
                {[...Array(itemsPerPage)].map((_, index) => (
                  <tr key={index} className={styles.tr}>
                    <td className={styles.td}>
                      <div
                        className={styles.skeleton}
                        style={{ width: "30px" }}
                      ></div>
                    </td>
                    <td className={styles.td}>
                      <div
                        className={styles.skeleton}
                        style={{ width: "80%" }}
                      ></div>
                    </td>
                    <td className={styles.td}>
                      <div
                        className={styles.skeleton}
                        style={{ width: "90%" }}
                      ></div>
                    </td>
                    <td className={styles.td}>
                      <div
                        className={styles.skeleton}
                        style={{ width: "70%" }}
                      ></div>
                    </td>
                    {/* <td className={clsx(styles.td, styles.manageCell)}>
                      <div className={styles.actionButtons}>
                        <div
                          className={styles.skeleton}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <div
                          className={styles.skeleton}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>SL</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Cover Photo</th>
                  <th className={styles.th}>Description</th>
                  <th className={styles.th}>Created At</th>
                  {/* <th className={styles.th}>Manage</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={styles.td}>{item.name}</td>
                    <td className={styles.td}>
                      {item.cover_photo && (
                        <img
                          style={{ width: 80, height: 80 }}
                          src={item.cover_photo}
                        />
                      )}
                    </td>
                    <td className={styles.td}>{item.description}</td>
                    <td className={styles.td}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    {/* <td className={clsx(styles.td, styles.manageCell)}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEdit(item)}
                          aria-label="Edit"
                        >
                          <FontAwesomeIcon icon={faPen} />
                          <span className={styles.tooltip}>Edit</span>
                        </button>
                        <button
                          className={clsx(
                            styles.actionButton,
                            styles.deleteButton
                          )}
                          onClick={() => confirmDelete(item._id)}
                          aria-label="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          <span className={styles.tooltip}>Delete</span>
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={styles.pageButton}
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {currentItem._id ? "Edit Item" : "Add New Item"}
              </h2>
              <button className={styles.closeButton} onClick={handleClearAll}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={currentItem.name}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, name: e.target.value })
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={currentItem.description}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Cover Photo</label>
                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className={styles.fileInput}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={styles.fileUploadLabel}
                  >
                    {selectedFile || previewUrl ? "Change File" : "Choose File"}
                  </label>
                  {(selectedFile || previewUrl) && (
                    <span className={styles.fileName}>
                      {selectedFile?.name || "Current Image"}
                    </span>
                  )}
                </div>
                {previewUrl && (
                  <div className={styles.imagePreview}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={handleClearAll}>
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleSubmit}
                disabled={!currentItem.name || isLoading}
              >
                {currentItem._id ? "Update Item" : "Add Item"}
              </button>
            </div>
            <div className={styles.modalActions}>
              {error && <div className={styles.error}>{error}</div>}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDeleteModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.modalTitle}>Confirm Deletion</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDeleteModal(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={clsx(
                  styles.confirmButton,
                  styles.deleteConfirmButton
                )}
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
