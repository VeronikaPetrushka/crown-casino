import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import AddCrownScreen from './src/screens/AddCrownScreen';
import FavsScreen from './src/screens/FavsScreen';
import DetailsScreen from './src/screens/DetailsScreen';

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
              <Stack.Screen 
                  name="AddCrownScreen" 
                  component={AddCrownScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="FavsScreen" 
                  component={FavsScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="DetailsScreen" 
                  component={DetailsScreen} 
                  options={{ headerShown: false }} 
              />
          </Stack.Navigator>
      </NavigationContainer>
    );
};

export default App;
