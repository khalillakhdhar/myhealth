import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const DoctorSearch = () => {
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

    // Icône par défaut pour les docteurs
    const doctorIcon = L.icon({
      iconUrl: doctorIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    let userLocation;

    // Obtenir la position actuelle de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 14);

        // Marquer la position de l'utilisateur sur la carte
        L.marker(userLocation, { icon: userIcon }).addTo(map)
          .bindPopup('Vous êtes ici')
          .openPopup();

        // Liste des docteurs et cliniques, y compris les cabinets privés
        const doctors = [
          { name: 'Hopital Régional de Gabés Mohamed Ben Sassi', lat: 33.8815, lon: 10.0982 },
          { name: 'Institut supérieur des sciences infirmiéres de Gabes', lat: 33.8920, lon: 10.0975 },
          { name: 'Clinic Mtorrech', lat: 33.8900, lon: 10.1000 },
          { name: 'Les Urgences - Hôpital de Gabès', lat: 33.8840, lon: 10.1020 },
          { name: 'Clinique Elmanara', lat: 33.8860, lon: 10.0940 },
          { name: 'المستشفى العسكري بقابس', lat: 33.8790, lon: 10.0950 },
          { name: 'Cabinet Dr. Ali', lat: 33.8830, lon: 10.0930 },
          { name: 'Cabinet Dr. Fatima', lat: 33.8850, lon: 10.0960 }
        ];

        // Ajouter les marqueurs sur la carte et les événements onclick
        doctors.forEach(doctor => {
          const marker = L.marker([doctor.lat, doctor.lon], { icon: doctorIcon }).addTo(map)
            .bindPopup(`<b>${doctor.name}</b>`);

          marker.on('click', () => {
            if (userLocation) {
              L.Routing.control({
                waypoints: [
                  L.latLng(userLocation[0], userLocation[1]),
                  L.latLng(doctor.lat, doctor.lon)
                ],
                routeWhileDragging: true
              }).addTo(map);
            }
          });
        });
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
  }, []);

  return (
    <View style={{ height: '100vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </View>
  );
};

export default DoctorSearch;
