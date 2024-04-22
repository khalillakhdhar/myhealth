import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../screens/Dashboard";
import Profile from "../screens/Profile";
import Prescription from "../screens/Prescription";
import Rappel from "../screens/Rappel";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Prescription"
        component={Prescription}
        options={{
          headerShown: true,
        }}
        ></Stack.Screen>
        <Stack.Screen
        name="Rappel"
        component={Rappel}
        options={{
          headerShown: true,
        }}
        ></Stack.Screen>
        <Stack.Screen
        name="Prescriptions"
        component={Prescription}
        options={{
          headerShown: true,
        }}
        ></Stack.Screen>
    
    </Stack.Navigator>
  );
}
