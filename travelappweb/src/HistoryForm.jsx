import React, { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

import  './Form.css';
const firebaseApp = require('./firebase.js');

const database = getDatabase(firebaseApp.FIREBASE_APP);
const storage = getStorage(firebaseApp.FIREBASE_APP);
const auth = firebaseApp.FIREBASE_AUTH;

const HistoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newHistoryRef = push(ref(database, "history"));

    const newHistory = {
      name: name,
      description: description,
      imageUrls: [],
      address: address
    };

    set(newHistoryRef, newHistory)
      .then(() => {
        const uploadPromises = images.map((image) => {
          const storageReference = storageRef(storage, `images/${newHistoryRef.key}/${image.name}`);
          return uploadBytes(storageReference, image)
            .then(() => getDownloadURL(storageReference))
            .catch((error) => {
              console.error("Error uploading image to Firebase Storage:", error);
              throw error;
            });
        });

        Promise.all(uploadPromises)
          .then((downloadURLs) => {
            const updatedHistory = {
              ...newHistory,
              imageUrls: downloadURLs,
              address: address
            };

            set(ref(database, `history/${newHistoryRef.key}`), updatedHistory)
              .then(() => {
                console.log("Successfully saved historical landmark and image URLs to Firebase");
                setName("");
                setDescription("");
                setImages([]);
                setAddress("");
              })
              .catch((error) => {
                console.error("Error updating historical landmark with image URLs:", error);
              });
          })
          .catch((error) => {
            console.error("Error getting download URLs of uploaded images:", error);
          });
      })
      .catch((error) => {
        console.error("Error saving historical landmark to Firebase:", error);
      });
  };

  return (
    <form className="my-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Tên di tích:</label>
      <input type="text" id="name" name="name" value={name} onChange={handleNameChange} required />

      <label htmlFor="description">Mô tả:</label>
      <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>

      <label htmlFor="address">Địa chỉ:</label>
      <input type="text" id="address" name="address" value={address} onChange={handleAddressChange} required />

      <label htmlFor="image">Ảnh:</label>
      <input type="file" id="image" name="image" accept="image/*" multiple onChange={handleImageChange} required />

      <button type="submit">Lưu</button>
      <Link to="/" className="nav-button">Home</Link>
    </form>
  );
};

export default HistoryForm;