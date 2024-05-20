import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off, child, get } from "firebase/database";
import { FIREBASE_APP, FIREBASE_AUTH } from './firebase.js';
import 'firebase/firestore';

const database = getDatabase(FIREBASE_APP);
const auth = FIREBASE_AUTH;

// Component hiển thị danh sách địa điểm yêu thích
function FavoritePlaces() {
    const [favoritePlaces, setFavoritePlaces] = useState([]);

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        
        const databaseRef = ref(database, 'users/' + userId + '/favoritePlaces');
        const historyRef = ref(database, 'history/');

        const fetchData = async () => {
            try {
                const snapshot = await get(databaseRef);
                const places = snapshot.val();

                if (places) {
                    const placeIds = Object.keys(places);
                    const favoritePlacesData = await Promise.all(placeIds.map(async (placeId) => {
                        const snapshot = await get(child(historyRef, placeId));

                        if (snapshot.exists()) {
                            const place = snapshot.val();

                            if (place) {
                                const { name, description, address, imageUrls } = place;
                                console.log("Name:", name);
                                console.log("Description:", description);
                                console.log("Address:", address);
                                console.log("Image URLs:", imageUrls);
                                return place;
                            } else {
                                console.log("Place not found");
                                return null;
                            }
                        } else {
                            console.log("No data available");
                            return null;
                        }
                    }));

                    setFavoritePlaces(favoritePlacesData.filter(place => place !== null));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        return () => {
            off(databaseRef, 'value');
        };
    }, []);

    console.log(favoritePlaces);

    return (
        <div>
            <h2>Danh sách địa điểm yêu thích</h2>
            <ul>
                {favoritePlaces.map((place) => (
                    <li key={place.placeId}>
                        <h3>{place.name}</h3>
                    
                        {place.imageUrls.map((imageUrl, index) => (
                            <img key={index} src={imageUrl} width={200} alt={`Image ${index}`} />
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FavoritePlaces;