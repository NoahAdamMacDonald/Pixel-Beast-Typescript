import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDeckById, deleteDeck } from '../services/storage';

export default function DeckViewScreen({ route, navigation }) {
    const {deckId } = route.params;
    const [deck, setDeck] = useState(null);
    const [loading, setLoading]= useState(true);

    useFocusEffect(
        useCallback(() => {
            loadDeck();
        }, [deckId])
    );

    const loadDeck = async () => {
        try {
            setLoading(true);
            const found = await getDeckById(deckId);
            setDeck(found);
        } catch (error) {
            console.error('Failed to load deck:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert('Delete Deck', 'Are you sure that you want to delete this deck?', [{
            text: 'Cancel', style: 'cancel' 
        }, {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
                await deleteDeck(deckId);
                navigation.goBack();
            },
        },
    ]); 
  };

    const renderCard = ({item}) => (
        <TouchableOpacity style={styles.cardTile}
        onPress={() => navigation.navigate('CardDetail', {
            cardId: item.id,
            cardType: item.cardType,
            cardName: item.name,
        })}>
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.cardType}>{item.cardType}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading deck...</Text>
            </View>
        );
    }

    if (!deck) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Deck not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {deck.cards.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No cards in this deck</Text>
                    <Text style={styles.emptySubtext}>Edit the deck to add cards!</Text>
                </View>
            ) : (
                <FlatList 
                    data={deck.cards}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={renderCard}
                    numColumns={4}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}/>
            )}
            
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton}
                onPress={() => navigation.navigate('DeckBuilder', {deckId: deck.id})}>
                    <Text style={styles.buttonText}>Edit Deck</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213E',
  },
  grid: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTile: {
    backgroundColor: '#0F3460',
    borderRadius: 8,
    padding: 8,
    width: '23%',
    aspectRatio: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardType: {
    color: '#A0A0B0',
    fontSize: 8,
    textTransform: 'uppercase',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#A0A0B0',
    fontSize: 14,
  },
  loadingText: {
    color: '#A0A0B0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#533483',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});