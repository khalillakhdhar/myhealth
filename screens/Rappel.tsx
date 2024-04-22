import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase'; // Ensure the paths are correct

export default function Rappel() {
  const [rappels, setRappels] = useState([]);
  const [newRappelTitle, setNewRappelTitle] = useState('');
  const [newRappelStartDate, setNewRappelStartDate] = useState(new Date());
  const [newRappelEndDate, setNewRappelEndDate] = useState(new Date());
  const [newRappelDescription, setNewRappelDescription] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
    } catch (error) {
      console.error('Error adding rappel:', error);
      Alert.alert('Error', 'Failed to add rappel');
    }
  };

  const handleDeleteRappel = async (id) => {
    try {
      await deleteDoc(doc(db, 'rappels', id));
    } catch (error) {
      console.error('Error deleting rappel:', error);
      Alert.alert('Error', 'Failed to delete rappel');
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || newRappelStartDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setNewRappelStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || newRappelEndDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setNewRappelEndDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Vos rappels</Text>

      <TextInput placeholder="Title" value={newRappelTitle} onChangeText={setNewRappelTitle} style={styles.input} />
      <TextInput placeholder="Description" value={newRappelDescription} onChangeText={setNewRappelDescription} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.buttonText}>Set Start Date</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={newRappelStartDate}
          mode="date"
          display="default"
          onChange={onChangeStartDate}
          maximumDate={new Date(2300, 12, 31)}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.buttonText}>Set End Date</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={newRappelEndDate}
          mode="date"
          display="default"
          onChange={onChangeEndDate}
          maximumDate={new Date(2300, 12, 31)}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddRappel}>
        <Text style={styles.buttonText}>Add Rappel</Text>
      </TouchableOpacity>

      {rappels.map((rappel) => (
        <View key={rappel.id} style={styles.rappelContainer}>
          <Text style={styles.rappelTitle}>{rappel.title}</Text>
          <Text style={styles.rappelDate}>{`Start: ${rappel.startDate}`}</Text>
          <Text style={styles.rappelDate}>{`End: ${rappel.endDate}`}</Text>
          <Text style={styles.rappelDescription}>{rappel.description}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRappel(rappel.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

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
