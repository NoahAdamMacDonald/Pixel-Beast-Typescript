import React, {useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,  
} from 'react-native';
import { searchCards } from '../services/api';
import { saveDeck, getDeckById, updateDeck } from '../services/storage';

export default function DeckBuilderScreen({ route, navigation }) {
    const editingDeckId = route.params?.deckId || null;

    const [deckName, setDeckName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingDeckId) {
            loadingExistingDeck();
        }
    }, [editingDeckId]);

    const loadingExistingDeck = async () => {
        try {
            const deck = await getDeckById(editingDeckId);
            if (deck) {
                setDeckName(deck.name);
                setSelectedCards(deck.cards);
            }
        } catch (err){
            console.error('Failed to load deck for editing:', err);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;;
        try {
            setSearching(true);
            setError(null);
            const results = await searchCards(searchQuery.trim());
            setSearchResults(results);
        } catch (err) { 
            setError('Failed to search cards. Check your connection!.');
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    };
    
    const addCard = (card) => {
        setSelectedCards((prev) => [...prev, card]);
    };

    const removeCrd = (index) => {
        setSelectedCards((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!deckName.trim()) {
            Alert.alert('Missing name', 'Please enter a deck name!');
            return;
        }
        if(selectedCards.length === 0) {
            Alert.alert('Empty Deck', 'Add at least one card to your deck!');
            return;
        }

        try {
            if (editingDeckId) {
                await updatedDeck(editingDeckId, deckName.trim(), selectedCards);
            } else {
                await saveDeck(deckName.trim(), selectedCards);
            }
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Failed to save deck!');
            console.error('There was a error when saving:', err);
        }
    };

    const renderSearchResult = ({ item}) => (
        <TouchableOpacity style={styles.resultCard} onPress={() => addCard(item)}>
            <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultType}>{item.cardType}</Text>
            </View>
            <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
    );

    const renderSelectedCard = ({item, index}) => (
        <TouchableOpacity style={styles.selectedTile}
        onPress={() => navigation.navigate('CardDetail', {
            cardId: item.id,
            cardType: item.cardType,
            cardName: item.name,
        })}
        onLongPress={() => removeCard(index)}>
            <Text style={styles.selectedName} numberOfLines={2}>{item.name}</Text>
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.container}>
            <TextInput 
            style={styles.nameInput}
            placeholder="Deck Name"
            placeholderTextColor="#666"
            value={deckName}
            onChangeText={setDeckName}/>

            {selectedCards.length > 0 && (
                <View style={styles.selectedSection}>
                    <Text style={styles.sectionLabel}>
                        Deck ({selectedCards.length} cards) - long press to remove
                    </Text>
                    <FlatList 
                        data={selectedCards}
                        keyExtractor={(_, index) => `selected-${index}`}
                        renderItem={renderSelectedCard}
                        horizontal
                        showHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.selectedList}/>
        
                </View>
    )}
                <View style={styles.searchSection}>
                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search cards..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}/>
                        <TouchableOpacity styles={styles.searchButton} onPress={handleSearch}>
                            <Text style={styles.searchButtonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                    {searching && <ActivityIndicator color="#533483" style={styles.loader} />}
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => `${item.cardType}-${item.id}`}
                        renderItem={renderSearchResult}
                        ListEmptyComponent={
                            !searching && searchQuery ? (
                                <Text style={styles.emptyText}>No results found</Text>
                            ) : null
                        }
                        contentContainerStyle={styles.resultsList}/>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>
                        {editingDeckId ? 'Update Deck' : 'Save Deck'}
                    </Text>
                </TouchableOpacity>
                </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#16213E',
  },
  nameInput: {
    backgroundColor: '#0F3460',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  selectedSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#A0A0B0',
    fontSize: 12,
    marginBottom: 8,
  },
  selectedList: {
    gap: 8,
  },
  selectedTile: {
    backgroundColor: '#533483',
    borderRadius: 8,
    padding: 8,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedName: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
  },
  searchSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#0F3460',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#533483',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultsList: {
    paddingBottom: 8,
  },
  resultCard: {
    backgroundColor: '#0F3460',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultType: {
    color: '#A0A0B0',
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  addIcon: {
    color: '#533483',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  emptyText: {
    color: '#A0A0B0',
    textAlign: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#533483',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
