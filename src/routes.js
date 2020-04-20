import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './pages/Main';
import User from './pages/User';
import GitHub from './pages/GitHub';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#7159c1',
          },
        }}>
        <Stack.Screen name="Main" component={Main} />

        <Stack.Screen
          name="User"
          component={User}
          options={User.navigationOptions}
        />

        <Stack.Screen
          name="GitHub"
          component={GitHub}
          options={GitHub.navigationOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
