import { addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { auth, db } from '../firebase/firebase'; // Assurez-vous que le chemin est correct

export default function Profile() {
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [tension, setTension] = useState('');
  const [glycemie, setGlycemie] = useState('');
  const [imc, setImc] = useState(0);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, "usersData"), where("userId", "==", auth.currentUser.uid), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistorique(items);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleCalculIMC = async () => {
    if (!poids || !taille) {
      console.error("Veuillez entrer à la fois le poids et la taille");
      return;
    }
    const imcCalculated = parseFloat(poids) / (parseFloat(taille) / 100) ** 2; // Calcul correct de l'IMC
   setImc(Math.round(imcCalculated));

    try {
      await addDoc(collection(db, "usersData"), {
        userId: auth.currentUser.uid,
        poids,
        taille,
        tension,
        glycemie,
        imc: imcCalculated,
        date: new Date()
      });
      console.log("Document ajouté avec succès !");
      setPoids('');
      setTaille('');
      setTension('');
      setGlycemie('');
    } catch (e) {
      console.error("Erreur lors de l'ajout du document :", e);
    }
  };

  const getIMCRecommendation = (imcValue) => {
    if (imcValue < 18.5) {
      return "Maigreur";
    } else if (imcValue >= 18.5 && imcValue < 25) {
      return "Normal";
    } else {
      return "Surpoids";
    }
  };
  const getPressureRecommendation = (pressureValue) => {
    if (pressureValue < 120) {
      return "Tension artérielle optimale";
    } else if (pressureValue >= 120 && pressureValue < 130) {
      return "Tension artérielle normale haute";
    } else if (pressureValue >= 130 && pressureValue < 140) {
      return "Hypertension légère (stade 1)";
    } else if (pressureValue >= 140 && pressureValue < 180) {
      return "Hypertension modérée à sévère (stade 2)";
    } else {
      return "Hypertension sévère (stade 3)";
    }
  };
  
  const getGlycemiaRecommendation = (glycemiaValue) => {
    if (glycemiaValue < 70) {
      return "Hypoglycémie (trop bas)";
    } else if (glycemiaValue >= 70 && glycemiaValue < 100) {
      return "Glycémie normale (à jeun)";
    } else if (glycemiaValue >= 100 && glycemiaValue < 126) {
      return "Pré-diabète (intolérance au glucose)";
    } else if (glycemiaValue >= 126) {
      return "Diabète";
    } else {
      return "Recommandation pour la glycémie";
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vos coordonnées</Text>

      <TextInput style={styles.input} placeholder="Poids (kg)" onChangeText={setPoids} keyboardType="numeric" value={poids} />
      <TextInput style={styles.input} placeholder="Taille (cm)" onChangeText={setTaille} keyboardType="numeric" value={taille} />
      <TextInput style={styles.input} placeholder="Tension" onChangeText={setTension} keyboardType="numeric" value={tension} />
      <TextInput style={styles.input} placeholder="Glycémie" onChangeText={setGlycemie} keyboardType="numeric" value={glycemie} />

      <TouchableOpacity style={styles.button} onPress={handleCalculIMC}>
        <Text style={styles.buttonText}>Calculer IMC</Text>
      </TouchableOpacity>

      {imc ? <Text style={styles.result}>IMC: {imc} ({getIMCRecommendation(imc)})</Text> : null}

      <View style={styles.historyContainer}>
        {historique.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text>Poids: {item.poids} kg</Text>
            <Text>Taille: {item.taille} cm</Text>
            <Text>IMC: {item.imc.toFixed(2)} ({getIMCRecommendation(item.imc)})</Text>
            <Text>Tension: {item.tension}</Text>
            <Text>Glycémie: {item.glycemie}</Text>
            <Text>Date: {item.date.toDate().toLocaleDateString()}</Text>
            <Text>Recommandations: {getPressureRecommendation(item.tension)}, {getGlycemiaRecommendation(item.glycemie)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.gray,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    padding: 8,
    margin: 10,
    width: 300,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 30,
    width: '100%',
  },
  card: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  }
});
