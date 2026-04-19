import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import DecksListScreen from './screens/DecksListScreen';
import DeckViewScreen from './screens/DeckViewScreen';
import DeckBuilderScreen from './screens/DeckBuilderScreen';
import CardDetailScreen from './screens/CardDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#1A1A2E' },
        headerTintColor: '#FFFFFF', 
        headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#16213E' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DecksList"
          component={DecksListScreen}
          options={{ title: 'My Decks' }}
        />
        <Stack.Screen
          name="DeckView"
          component={DeckViewScreen}
          options={({ route }) => ({ title: route.params?.deckName || 'Deck' })}
        />
        <Stack.Screen
          name="DeckBuilder"
          component={DeckBuilderScreen}
          options={{ title: 'Deck Builder' }}
        />
        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={({ route }) => ({ title: route.params?.cardName || 'Card Detail' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}