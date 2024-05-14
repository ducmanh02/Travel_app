import React, { useState,useEffect } from "react";
import { getDatabase, ref, push, set } from "firebase/database";



const firebaseApp = require('./firebase.js');

const database = getDatabase(firebaseApp.FIREBASE_APP);
const auth = firebaseApp.FIREBASE_AUTH;
// Component địa điểm
function Place() {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    const userId = auth.currentUser.uid;
    const databaseRef = ref(database,'users/' + userId + '/favoritePlaces/-NxSVquFFb6Rf2JOSy8A');


    if (isFavorite) {
      // Xóa địa điểm yêu thích
      set(databaseRef,null)
        .then(() => {
          setIsFavorite(false);
        })
        .catch((error) => {
          // Xử lý lỗi thêm địa điểm yêu thích
        });
    } else {
      // Thêm địa điểm yêu thích
      set(databaseRef,true)
        .then(() => {
          setIsFavorite(true);
        })
        .catch((error) => {
          // Xử lý lỗi thêm địa điểm yêu thích
        });
    }
  };

  return (
    <div>
      <h3></h3>
      <button onClick={handleToggleFavorite}>
        {isFavorite ? 'Xóa yêu thích' : 'Yêu thích'}
      </button>
    </div>
  );
}

export default Place;