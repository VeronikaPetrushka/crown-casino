import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import AddCrownScreen from './src/screens/AddCrownScreen';
import FavsScreen from './src/screens/FavsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import FavsGalleryScreen from './src/screens/FavsGalleryScreen';
import GalleryDetailsScreen from './src/screens/GalleryDetailsScreen';
import EventsScreen from './src/screens/EventsScreen';
import EventsDetailsScreen from './src/screens/EventsDetailsScreen';
import FavsEventsScreen from './src/screens/FavsEventsScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import SignupScreen from './src/screens/SignupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignsScreen from './src/screens/SignsScreen';
import FavsSignsScreen from './src/screens/FavsSignsScreen';

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
              <Stack.Screen 
                  name="GalleryScreen" 
                  component={GalleryScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="FavsGalleryScreen" 
                  component={FavsGalleryScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="GalleryDetailsScreen" 
                  component={GalleryDetailsScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="EventsScreen" 
                  component={EventsScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="EventsDetailsScreen" 
                  component={EventsDetailsScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="FavsEventsScreen" 
                  component={FavsEventsScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="AddEventScreen" 
                  component={AddEventScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="SignupScreen" 
                  component={SignupScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="ProfileScreen" 
                  component={ProfileScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="SignsScreen" 
                  component={SignsScreen} 
                  options={{ headerShown: false }} 
              />
              <Stack.Screen 
                  name="FavsSignsScreen" 
                  component={FavsSignsScreen} 
                  options={{ headerShown: false }} 
              />
          </Stack.Navigator>
      </NavigationContainer>
    );
};

export default App;
