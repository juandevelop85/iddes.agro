import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Splash from '../containers/general/Splash';
import Menu from '../containers/menu/Menu';
import ViewIrrigationInfo from '../containers/maps/ViewIrrigationInfo';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            title: 'My home',
            headerStyle: {
              backgroundColor: '#041952',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen
          name="ViewIrrigationInfo"
          component={ViewIrrigationInfo}
          options={{
            title: 'Marcación',
            headerStyle: {
              backgroundColor: '#041952',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
