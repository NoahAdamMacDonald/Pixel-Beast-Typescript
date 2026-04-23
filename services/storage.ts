import AsyncStorage from "@react-native-async-storage/async-storage";

const DECKS_KEY = 'tcg_decks';

//Getting all saved decks

export async function getDecks() {
    try {
        const data= await AsyncStorage.getItem(DECKS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error ('Failed to get decks:', error);
        return[];
    }
}

//Get a single deck by ID

export async function getDeckById(deckId: number | null) {
    try {
        const decks = await getDecks();
        return decks.find((d: any) => d.id === deckId) || null; 
    } catch (error) {
        console.error ('Failed to get deck:', error);
        return null;
    }
}

//Save a new deck
export async function saveDeck(name: string, cards: any) {
    try {
        const decks = await getDecks();
        const newDeck = {
            id: Date.now().toString(),
            name,
            cards,
            createdAt: new Date().toISOString(),
        };
        decks.push(newDeck);
        await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
        return newDeck;
    } catch (error) {
        console.error ('Failed to get deck:', error);
        throw error;
    }
}

//Update an existing deck
export async function updateDeck(deckId: number, name: string, cards: any) {
    try {
        const decks = await getDecks();
        const index = decks.findIndex((d: any) => d.id === deckId);
        if (index === -1) throw new Error('Deck not found');

        decks[index] = {
            ...decks[index],
            name,
            cards,
            updatedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
        return decks[index];
    } catch (error) {
        console.error ('Failed to get deck:', error);
        throw error;
    }
}

//Delete a deck
export async function deleteDeck(deckId: number) {
    try {
        const decks = await getDecks();
        const filtered = decks.filter((d: any) => d.id !== deckId);
        await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete deck:', error);
        throw error;
    }
}