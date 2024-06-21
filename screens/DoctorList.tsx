import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";
import { db } from "../firebase/firebase";

export default function DoctorList() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, "users"), where("grade", "==", "medecin"));
      const querySnapshot = await getDocs(q);
      const doctorsList: any[] = [];
      querySnapshot.forEach((doc) => {
        doctorsList.push({ id: doc.id, ...doc.data() });
      });
      setDoctors(doctorsList);
      setFilteredDoctors(doctorsList);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = doctors.filter((doctor) => 
      doctor.Name.toLowerCase().includes(text.toLowerCase()) || 
      doctor.Speciality.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom ou spécialité"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.Name}</Text>
            <Text style={styles.email}>{item.Email}</Text>
            <Text style={styles.phone}>{item.PhoneNumber}</Text>
            <Text style={styles.speciality}>{item.Speciality}</Text>
            <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={styles.button}
                
              >
               <a style={styles.buttonText} href='https://appcall.daily.co/visio'>joindre la visio</a>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("DoctorSearch", { doctorName: item.Name })}
              >
                <Text style={styles.buttonText}>Afficher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Chat", { doctorId: item.id } )}
              >
                <Text style={styles.buttonText}>Contacter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Appointment", { doctorId: item.id })}
              >
                <Text style={styles.buttonText}>Rendez-vous</Text>
              </TouchableOpacity>
             
            </View>
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
  searchInput: {
    height: 50,
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.light,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: Colors.dark,
  },
  phone: {
    fontSize: 16,
    color: Colors.dark,
  },
  speciality: {
    fontSize: 16,
    color: Colors.dark,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
});
