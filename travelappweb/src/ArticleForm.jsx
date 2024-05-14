import React, { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

import './Form.css';
const firebaseApp = require('./firebase.js');

const database = getDatabase(firebaseApp.FIREBASE_APP);
const storage = getStorage(firebaseApp.FIREBASE_APP);
const auth = firebaseApp.FIREBASE_AUTH;

const HistoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const Ref = push(ref(database, "article"));

    const newArticle = {
      name: name,
      description: description,
      imageUrls: [],

    };

    set(Ref, newArticle)
      .then(() => {
        const uploadPromises = images.map((image) => {
          const storageReference = storageRef(storage, `images/${Ref.key}/${image.name}`);
          return uploadBytes(storageReference, image)
            .then(() => getDownloadURL(storageReference))
            .catch((error) => {
              console.error("Error uploading image to Firebase Storage:", error);
              throw error;
            });
        });

        Promise.all(uploadPromises)
          .then((downloadURLs) => {
            const updated = {
              ...newArticle,
              imageUrls: downloadURLs,

            };

            set(ref(database, `article/${Ref.key}`), updated)
              .then(() => {
                console.log("Successfully saved artical and image URLs to Firebase");
                setName("");
                setDescription("");
                setImages([]);

              })
              .catch((error) => {
                console.error("Error updating artical with image URLs:", error);
              });
          })
          .catch((error) => {
            console.error("Error getting download URLs of uploaded images:", error);
          });
      })
      .catch((error) => {
        console.error("Error saving artical to Firebase:", error);
      });
  };

  return (
    <><form className="my-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Tên bài báo:</label>
      <input type="text" id="name" name="name" value={name} onChange={handleNameChange} required />

      <label htmlFor="description">Nội dung:</label>
      <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>

      <label htmlFor="image">Ảnh:</label>
      <input type="file" id="image" name="image" accept="image/*" multiple onChange={handleImageChange} required />

      <button type="submit">Lưu</button>
    </form>
      <Link to="/" className="nav-button">Home</Link></>
  );
};

export default HistoryForm;