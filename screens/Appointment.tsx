import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";

export default function Appointment({ route }) {
  const { doctorId } = route.params;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({
    lundi: { start: "08:00", end: "17:00" },
    mardi: { start: "08:00", end: "17:00" },
    mercredi: { start: "08:00", end: "17:00" },
    jeudi: { start: "08:00", end: "17:00" },
    vendredi: { start: "08:00", end: "17:00" },
    samedi: { start: "09:00", end: "13:00" },
    dimanche: { start: "", end: "" }
  });

  useEffect(() => {
    if (auth.currentUser) {
      console.log("Fetching appointments for doctor:", doctorId, "and user:", auth.currentUser.uid);
      const q = query(
        collection(db, "appointments"),
        where("doctorId", "==", doctorId),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const appointmentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched appointments:", appointmentsList);
        setAppointments(appointmentsList);
      });
      return () => unsubscribe();
    }
  }, [doctorId]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const docRef = doc(db, "doctor_schedule", doctorId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAvailability(docSnap.data().workingHours);
      } else {
        console.log("No such document!");
      }
    };

    fetchAvailability();
  }, [doctorId]);

  const handleSchedule = async () => {
    if (date.trim() === "" || time.trim() === "") {
      alert("Veuillez entrer une date et une heure.");
      return;
    }

    await addDoc(collection(db, "appointments"), {
      doctorId,
      userId: auth.currentUser.uid,
      date,
      time,
      status: "en attente",
      createdAt: new Date().toISOString(),
    });
    setDate("");
    setTime("");
    alert("Rendez-vous créé");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en attente":
        return Colors.orange;
      case "confirmé":
        return Colors.green;
      case "annulé":
        return Colors.red;
      default:
        return Colors.gray;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.availability}>
        <Text style={styles.title}>Disponibilité du Docteur</Text>
        <FlatList
          data={Object.entries(availability)}
          keyExtractor={([day]) => day}
          renderItem={({ item: [day, hours] }) => (
            <View style={styles.availabilityItem}>
              <Text><strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {hours.start} - {hours.end}</Text>
            </View>
          )}
        />
      </View>
      <input
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        type="date"
        onChange={(event) => setDate(event.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Heure (HH:MM)"
        value={time}
        type="time"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTime(event.target.value)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSchedule}>
        <Text style={styles.buttonText}>Créer un rendez-vous</Text>
      </TouchableOpacity>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.appointmentCard, { borderColor: getStatusColor(item.status) }]}>
            <Text>Date: {item.date}</Text>
            <Text>Heure: {item.time}</Text>
            <Text>Status: <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text></Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  availability: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  availabilityItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    color: "white",
    padding: 10,
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
    width: "100%",
    textAlign: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
  appointmentList: {
    listStyleType: "none",
    padding: 0,
  },
  appointmentCard: {
    backgroundColor: Colors.light,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
  },
});
