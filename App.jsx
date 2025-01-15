import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';

enableScreens();

const Stack = createStackNavigator();


const App = () => {

  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="HomeScreen">
              <Stack.Screen 
                  name="HomeScreen" 
                  component={HomeScreen} 
                  options={{ headerShown: false }} 
              />
          </Stack.Navigator>
      </NavigationContainer>
    );
};

export default App;
