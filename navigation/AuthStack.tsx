import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Appointment from "../screens/Appointment";
import Chat from "../screens/Chat";
import Dashboard from "../screens/Dashboard";
import DoctorList from "../screens/DoctorList";
import DoctorSearch from "../screens/DoctorSearch";
import Prescription from "../screens/Prescription";
import Profile from "../screens/Profile";
import Rappel from "../screens/Rappel";
import UpdateProfile from "../screens/UpdateProfile";

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
      />
      <Stack.Screen
        name="Rappel"
        component={Rappel}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="DoctorSearch"
        component={DoctorSearch}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="DoctorList"
        component={DoctorList}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Appointment"
        component={Appointment}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
