import React, { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

import './Form.css';
const firebaseApp = require('./firebase.js');

const database = getDatabase(firebaseApp.FIREBASE_APP);
const storage = getStorage(firebaseApp.FIREBASE_APP);
const auth = firebaseApp.FIREBASE_AUTH;

const FestivalForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");

  const [images, setImages] = useState([]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = (e) =>{
  e.preventDefault();

  const newFestivalRef = push(ref(database, "festival"));

  const newFestival = {
    name: name,
    description: description,
    date: date,
    address: address,

    imageUrls: []
  };

  set(newFestivalRef, newFestival)
    .then(() => {
      const uploadPromises = images.map((image) => {
        const storageReference = storageRef(storage, `images/${newFestivalRef.key}/${image.name}`);
        return uploadBytes(storageReference, image)
          .then(() => getDownloadURL(storageReference))
          .catch((error) => {
            console.error("Error uploading image to Firebase Storage:", error);
            throw error;
          });
      });

      Promise.all(uploadPromises)
        .then((downloadURLs) => {
          const updatedFestival = {
            ...newFestival,
            imageUrls: downloadURLs
          };

          set(ref(database, `festival/${newFestivalRef.key}`), updatedFestival)
            .then(() => {
              console.log("Successfully saved festival and image URLs to Firebase");
              setName("");
              setDescription("");
              setDate("");
              setAddress("");

              setImages([]);
            })
            .catch((error) => {
              console.error("Error updating festival with image URLs:", error);
            });
        })
        .catch((error) => {
          console.error("Error getting download URLs of uploaded images:", error);
        });
    })
    .catch((error) => {
      console.error("Error saving festival to Firebase:", error);
    });
};

return (
  <form className="my-form" onSubmit={handleSubmit}>
    <label htmlFor="name">Tên Lễ hội:</label>
    <input type="text" id="name" name="name" value={name} onChange={handleNameChange} required />

    <label htmlFor="description">Mô tả:</label>
    <textarea id="description" name="description" value={description} onChange={handleDescriptionChange} required></textarea>

    <label htmlFor="address">Địa chỉ:</label>
    <input type="text" id="address" name="address" value={address} onChange={handleAddressChange} required />

    <label htmlFor="date">Ngày:</label>
    <input type="text" id="date" name="date" value={date} onChange={handleDateChange} required />


    <label htmlFor="images">Hình ảnh:</label>
    <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImageChange} required />

    <button type="submit">Lưu</button>
    <Link to="/" className="nav-button">Home</Link>
  </form>
);

};

export default FestivalForm;