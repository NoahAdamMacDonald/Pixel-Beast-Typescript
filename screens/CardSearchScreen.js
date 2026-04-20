import React, { useState } from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { searchCards } from '../services/api';

export default function CardSearchScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching]= useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
<<<<<<< HEAD
        if (!searchQuery.trim()) 
=======
        if (!searchQuery.trim())
>>>>>>> 37472fa9345cc5aebf4100673a1373e29c9e3ee1
            return;

        try {
            setSearching(true);
            setError(null);
            const data = await searchCards(searchQuery.trim());
            setResults(data);
        } catch (err) {
            setError('Failed to search cards. Please check your connection!');
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    };

    const renderResult = ({ item}) => (
        <TouchableOpacity style={styles.resultCard}
        onPress={() => navigation.navigate('CardDetail', {
            cardId: item.id,
            cardType: item.cardType,
            cardName: item.name,
        })}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultType}>{item.cardType}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <TextInput style={styles.searchInput}
                placeholder="Search cards..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch} />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {searching && <ActivityIndicator color="#533483" style={styles.loader} />}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={results}
                keyExtractor={(item) => `${item.cardType}-${item.id}`}
                renderItem={renderResult}
                ListEmptyComponent={
                    !searching && searchQuery ? (
                        <Text style={styles.emptyText}>No results found!</Text>
                    ) : !searching ? (
                        <Text style={styles.emptyText}>Search for a card by name</Text>
                    ) : null
                }
                contentContainerStyle={styles.resultsList} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213E',
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
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
    paddingBottom: 16,
  },
  resultCard: {
    backgroundColor: '#0F3460',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  emptyText: {
    color: '#A0A0B0',
    textAlign: 'center',
    marginTop: 40,
  },
});