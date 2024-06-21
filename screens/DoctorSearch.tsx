import { useRoute } from '@react-navigation/native';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const DoctorSearch = () => {
  const route = useRoute();
  const { doctorName } = route.params;

  useEffect(() => {
    const doctorIconUrl = 'https://firebasestorage.googleapis.com/v0/b/medical-dd248.appspot.com/o/doctor.jpg?alt=media&token=ffe4d0a2-e964-4bbc-a530-2c70435a300b';
    const userIconUrl = 'https://firebasestorage.googleapis.com/v0/b/medical-dd248.appspot.com/o/user.png?alt=media&token=4c5bb8e2-48ed-48a3-ac1d-fb1771e8c363';

    // Initialiser la carte
    const map = L.map('map').setView([33.8815, 10.0982], 14);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Icône personnalisée pour la position de l'utilisateur
    const userIcon = L.icon({
      iconUrl: userIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Icône personnalisée pour la position du docteur
    const doctorIcon = L.icon({
      iconUrl: doctorIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    let userLocation;

    // Fonction pour calculer une position légèrement décalée
    const getOffsetLocation = (lat, lon, offset) => {
      const earthRadius = 6378137; // Rayon de la Terre en mètres
      const dLat = offset / earthRadius;
      const dLon = offset / (earthRadius * Math.cos(Math.PI * lat / 180));
      const newLat = lat + dLat * (180 / Math.PI);
      const newLon = lon + dLon * (180 / Math.PI);
      return [newLat, newLon];
    };

    // Obtenir la position actuelle de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 14);

        // Marquer la position de l'utilisateur sur la carte
        L.marker(userLocation, { icon: userIcon }).addTo(map)
          .bindPopup('Vous êtes ici')
          .openPopup();

        // Calculer une position décalée pour le docteur (par exemple, 100 mètres de distance)
        const doctorLocation = getOffsetLocation(userLocation[0], userLocation[1], 100);

        // Ajouter un marqueur pour le docteur fictif
        L.marker(doctorLocation, { icon: doctorIcon }).addTo(map)
          .bindPopup(`<b>${doctorName}</b>`)
          .openPopup();

        // Dessiner la ligne de route entre l'utilisateur et le docteur fictif
        L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(doctorLocation[0], doctorLocation[1])
          ],
          routeWhileDragging: true
        }).addTo(map);

      }, error => {
        console.error("Erreur de géolocalisation : ", error);
        alert('La géolocalisation a échoué.');
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      alert('Votre navigateur ne supporte pas la géolocalisation.');
    }
  }, [doctorName]);

  return (
    <View style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </View>
  );
};

export default DoctorSearch;
