import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
                <Image
                  source={require('../assets/logo.png')}
                  style={{ width: 400, height: 300, marginBottom: 8, marginTop: 35 }}
                  resizeMode="contain"
                />
            <Text style={styles.title}>Deckbuilder Companion App</Text>
            <Text style={styles.subtitle}>Choose your Beast. Master your Biome.</Text>
        </View>

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('DecksList')}>
                <Text style={styles.buttonText}>My Decks</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, styles.buildButton]}
            onPress={() => navigation.navigate('DeckBuilder')}>
                <Text style={styles.buttonText}>Deck Builder</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, styles.searchButton]}
            onPress={() => navigation.navigate('CardSearch')}>
                <Text style={styles.buttonText}>Card Search</Text>
            </TouchableOpacity>
        </View>
    
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213E',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
  },
  welcome: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0B0',
  },
  button: {
    backgroundColor: '#0F3460',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buildButton: {
    backgroundColor: '#533483',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  searchButton: {
  backgroundColor: '#1A6B3C',
},
});