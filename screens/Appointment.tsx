import { addDoc, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";

export default function Appointment({ route }) {
  const { doctorId } = route.params;
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [appointments, setAppointments] = useState<any[]>([]);

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

  const handleSchedule = async () => {
    if (date.trim() === "" || time.trim() === "") {
      alert("Please enter both date and time.");
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
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Heure (HH:MM)"
        value={time}
        onChangeText={setTime}
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
  input: {
    height: 50,
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
  appointmentCard: {
    backgroundColor: Colors.light,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
  },
});
