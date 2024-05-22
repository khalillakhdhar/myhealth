import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Navigation from './navigation/Navigation';

const initialState = {
  user: {
   /*
      Name: username,
          Email: email,
          PhoneNumber: phone,
          Sexe: sexe,
          Age: age,
          CreatedAt: new Date().toUTCString(),
   */
    // User details
    name: 'John Doe',
    email: 'user@gmail.com',
    phone: '1234567890',
    sexe: 'homme',
    age: '20',
    createdAt: '2021-08-01T12:00:00.000Z',
    // Other user details
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Define actions to update user state if needed
    default:
      return state;
  }
};

const store = createStore(userReducer);
export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.tsx to start working on your app!!!!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <Provider store={store}>

    <Navigation/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
