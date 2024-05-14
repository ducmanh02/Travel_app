import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import "./RenderHistory.css";


import { FIREBASE_APP } from "./firebase";


const database = getDatabase(FIREBASE_APP);
const storage = getStorage(FIREBASE_APP);

const RenderHistory = () => {
  const [articleData, setArticleData] = useState([]);

  useEffect(() => {
    const Ref = ref(database, "article");

    onValue(Ref, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const articleArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setArticleData(articleArray);
      } else {
        setArticleData([]);
      }
    });
    console.log(articleData);
  }, []);


  return (
    <div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>

            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {articleData.map((el) => (
            <tr key={el.id}>
              <td>{el.name}</td>
              <td>{el.description}</td>

              <td>
                {el.imageUrls && el.imageUrls.length > 0 && (
                  <div>
                    {el.imageUrls.map((imageUrl) => (
                      <img src={imageUrl} alt="Article" key={imageUrl} />
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenderHistory;
