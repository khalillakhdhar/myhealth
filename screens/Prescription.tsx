import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase';

export default function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const q = query(collection(db, 'prescriptions'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrescriptions(data);
    };

    if (auth.currentUser) {
      fetchPrescriptions();
    }
  }, []);

  return (
    <View style={styles.container}>
      {prescriptions.length === 0 ? (
        <Text style={styles.noPrescriptionsText}>Aucune prescription</Text>
      ) : (
        prescriptions.map(prescription => (
          <View key={prescription.id} style={styles.prescriptionCard}>
            <Text style={styles.prescriptionTitle}>{prescription.title}</Text>
            <Text style={styles.prescriptionDate}>
              Du {new Date(prescription.startDate).toLocaleDateString()} au {new Date(prescription.endDate).toLocaleDateString()}
            </Text>
            <Text style={styles.prescriptionDescription}>{prescription.description}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noPrescriptionsText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  prescriptionCard: {
    backgroundColor: Colors.grey,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  prescriptionDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  prescriptionDescription: {
    fontSize: 16,
  },
});
