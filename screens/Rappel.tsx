import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase'; // Ensure the paths are correct
// Même importations et code que précédemment

export default function Rappel() {
  const [rappels, setRappels] = useState([]);
  const [newRappelTitle, setNewRappelTitle] = useState('');
  const [newRappelStartDate, setNewRappelStartDate] = useState(new Date());
  const [newRappelEndDate, setNewRappelEndDate] = useState(new Date());
  const [newRappelDescription, setNewRappelDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'rappels'), where('userId', '==', auth.currentUser.uid), orderBy('startDate'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRappels(data);
      });
      return () => unsubscribe();
    }
  }, []);
  const handleDeleteRappel = async (rappelId) => {
    try {
      await deleteDoc(doc(db, 'rappels', rappelId));
    } catch (error) {
      console.error('Error deleting rappel:', error);
      Alert.alert('Error', 'Failed to delete rappel');
    }
  };
  
  const handleAddRappel = async () => {
    if (!newRappelTitle || !newRappelStartDate || !newRappelEndDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'rappels'), {
        title: newRappelTitle,
        startDate: newRappelStartDate.toISOString(),
        endDate: newRappelEndDate.toISOString(),
        description: newRappelDescription,
        userId: auth.currentUser.uid
      });
      setNewRappelTitle('');
      setNewRappelStartDate(new Date());
      setNewRappelEndDate(new Date());
      setNewRappelDescription('');
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error adding rappel:', error);
      Alert.alert('Error', 'Failed to add rappel');
    }
  };

  // Code pour la suppression des rappels

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Vos rappels</Text>

      <TextInput placeholder="Title" value={newRappelTitle} onChangeText={setNewRappelTitle} style={styles.input} />
      <TextInput placeholder="Description" value={newRappelDescription} onChangeText={setNewRappelDescription} style={styles.input} />

      <DatePicker selected={newRappelStartDate} style={styles.input}  onChange={date => setNewRappelStartDate(date)} />
      <DatePicker selected={newRappelEndDate} style={styles.input}  onChange={date => setNewRappelEndDate(date)} />

      <TouchableOpacity style={styles.button} onPress={handleAddRappel}>
        <Text style={styles.buttonText}>Ajout compte rendu</Text>
      </TouchableOpacity>

      {showConfirmation && (
        <Text style={{ color: 'green', fontSize: 18, marginTop: 10 }}>Compte rendu ajouté avec succès!</Text>
      )}

      {rappels.map((rappel) => (
        <View key={rappel.id} style={styles.rappelContainer}>
          <Text style={styles.rappelTitle}>{rappel.title}</Text>
          <Text style={styles.rappelDate}>Du {new Date(rappel.startDate).toLocaleDateString()} au {new Date(rappel.endDate).toLocaleDateString()}</Text>
          <Text style={styles.rappelDescription}>{rappel.description}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRappel(rappel.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// styles object remains unchanged

// styles object remains unchanged

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
  },
  rappelContainer: {
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  rappelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rappelDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  rappelDescription: {
    fontSize: 16,
  },
});
