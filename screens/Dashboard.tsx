import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";

export default function Dashboard({ navigation }: { navigation: any }) {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [userData,setUserData]=useState<any | undefined>(null);

  const handleSignout = async () => {
    if(confirm("vous voulez vous deconnecter?"))
    await auth.signOut();
  };

  const Modal = () => {
    Alert.alert("Auth App", "Vous voulez vous déconnecter", [
      {
        text: "Cancel",
        onPress: () => console.log("Annulation de la déconnexion!"),
      },
      { text: "Logout", onPress: handleSignout },
    ]);
  };

  const getData = async () => {

    const docRef = doc(db, "users", "info");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data());
    } else {
      console.log("aucun document!");
    }
    // read data from firestore database user

  };
// get data with email from firestore database users collection
const readDataFromFirestore = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  usersSnapshot.forEach((doc) => {
    if (doc.data().email === auth.currentUser?.email) {
      console.log("Document data:", doc.data());
      setUserData(doc.data());
      setUserInfo(doc.data());
    }
  });
};

useEffect(() => {
  getData();
  setUserInfo(auth.currentUser);
  readDataFromFirestore();
}, []);






  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Bienvenue à la supervision ! </Text>
      <View>
        <Text style={styles.userInfo}>{userInfo ? `Email: ${userInfo.email}` : ""}</Text>

      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
          <Text style={{ color: Colors.white, fontSize: 20 }}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DoctorSearch')}>
          <Text style={{ color: Colors.white, fontSize: 16 }}>Cherchez  docteur</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <Text style={{ color: Colors.white, fontSize: 20 }}>Suivi</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rappel')}>
          <Text style={{ color: Colors.white, fontSize: 20 }}>Rappel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Prescription')}>
          <Text style={{ color: Colors.white, fontSize: 20 }}>Prescription</Text>
        </TouchableOpacity>
        </View>
      <View>
        
        <TouchableOpacity style={styles.button} onPress={handleSignout}>
          <Text style={{ color: Colors.white, fontSize: 20 }}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginTop: 30,
  },
  // center iframe
  iframe: {
    display: "flex",
    margin: "auto",
  },
  userInfo: {
    fontSize: 18,
    marginVertical: 5,
  },
});
