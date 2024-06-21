import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";

const { width, height } = Dimensions.get("window");
let top;
if (Platform.OS === "ios") {
  top = height * 0.02;
} else {
  top = 0;
}

export default function Signup({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [sexe, setSexe] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let valid = true;
    let errors: any = {};

    if (!username) {
      errors.username = "Nom d'utilisateur est requis";
      valid = false;
    }
    if (!email) {
      errors.email = "Email est requis";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email n'est pas valide";
      valid = false;
    }
    if (!phone) {
      errors.phone = "Numéro de téléphone est requis";
      valid = false;
    } else if (!/^\d+$/.test(phone)) {
      errors.phone = "Numéro de téléphone n'est pas valide";
      valid = false;
    }
    if (!password) {
      errors.password = "Mot de passe est requis";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
      valid = false;
    }
    if (!sexe) {
      errors.sexe = "Sexe est requis";
      valid = false;
    } else if (sexe !== "Homme" && sexe !== "Femme") {
      errors.sexe = "Sexe doit être 'Homme' ou 'Femme'";
      valid = false;
    }
    if (!age) {
      errors.age = "Age est requis";
      valid = false;
    } else if (!/^\d+$/.test(age)) {
      errors.age = "Age doit être un nombre";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        setDoc(doc(db, "users", user.uid), {
          Name: username,
          Email: email,
          PhoneNumber: phone,
          Sexe: sexe,
          Age: age,
          CreatedAt: new Date().toUTCString(),
        });
        Alert.alert("Succès", "Compte créé avec succès 🎉");
      })
      .catch((err: any) => {
        setLoading(false);
        Alert.alert("Erreur", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginHeader}>
        <Text style={styles.loginHeaderText}>S'inscrire maintenant 🎉</Text>
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>
        {/* Username */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Nom d'utilisateur</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>
        {/* Email */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Email</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Votre email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        {/* Phone Number */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Numéro de téléphone</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Votre numéro ici"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={(text) => setPhone(text)}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        {/* Password */}
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordText}>Mot de passe</Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Votre mot de passe"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        {/* Sexe */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Sexe</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Votre sexe (Homme/Femme)"
            value={sexe}
            onChangeText={(text) => setSexe(text)}
          />
          {errors.sexe && <Text style={styles.errorText}>{errors.sexe}</Text>}
        </View>
        {/* Age */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Age</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Votre âge"
            value={age}
            keyboardType="numeric"
            onChangeText={(text) => setAge(text)}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        <View style={styles.loginButton}>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.loginButtonText}>
              {loading ? "Création d'un compte..." : "Créer un compte"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupGroup}>
          <Text style={styles.new}>Déjà membre?</Text>
          <TouchableOpacity onPress={() => navigation.push("Login")}>
            <Text style={styles.signup}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: height * 0.05,
  },
  loginHeader: {
    marginTop: 20,
  },
  loginHeaderText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  loginContainer: {
    marginTop: 20,
  },
  emailContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emailInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    paddingLeft: 10,
  },
  passwordContainer: {
    marginTop: 20,
  },
  passwordText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: Colors.light,
    borderRadius: 8,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  loginButton: {
    marginTop: 20,
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  signupGroup: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signup: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  new: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
