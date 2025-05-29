import {useState} from 'react'
import styles from '../../dashboard/photo-details/PhotoDetail.module.css';

const TagsInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.tagsInputContainer}>
      <div className={styles.tagsList}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tag}>
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(index)}
              className={styles.removeTag}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press enter to add tags"
        className={styles.tagsInput}
      />
    </div>
  );
};
export default TagsInput;
