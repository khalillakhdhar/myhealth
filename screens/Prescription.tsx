import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase';

export default function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'prescriptions'), where('userId', '==', user.uid), orderBy('startDate'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPrescriptions(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'start' ? startDate : endDate);
    if (type === 'start') {
      setStartDate(currentDate);
      setShowStartDatePicker(Platform.OS === 'ios');
    } else {
      setEndDate(currentDate);
      setShowEndDatePicker(Platform.OS === 'ios');
    }
  };

  const handleAddPrescription = async () => {
    if (!title || !startDate || !endDate || !description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'prescriptions'), {
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        description,
        userId: user.uid
      });
      setTitle('');
      setStartDate(new Date());
      setEndDate(new Date());
      setDescription('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeletePrescription = async (id) => {
    try {
      await deleteDoc(doc(db, 'prescriptions', id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

      <TouchableOpacity style={styles.button} onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.buttonText}>Set Start Date</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          testID="startDatePicker"
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'start')}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.buttonText}>Set End Date</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          testID="endDatePicker"
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'end')}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddPrescription}>
        <Text style={styles.buttonText}>Add Prescription</Text>
      </TouchableOpacity>

      {prescriptions.map((prescription) => (
        <View key={prescription.id} style={styles.prescriptionContainer}>
          <Text style={styles.prescriptionTitle}>{prescription.title}</Text>
          <Text style={styles.prescriptionDate}>{`Start: ${prescription.startDate}`}</Text>
          <Text style={styles.prescriptionDate}>{`End: ${prescription.endDate}`}</Text>
          <Text style={styles.prescriptionDescription}>{prescription.description}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePrescription(prescription.id)}>
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
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
  },
  prescriptionContainer: {
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  prescriptionTitle: {
    fontWeight: 'bold',
  },
  prescriptionDate: {},
  prescriptionDescription: {},
});