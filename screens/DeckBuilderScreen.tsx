import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from "react-native";

import { searchCards } from "../services/api";
import { saveDeck, getDeckById, updateDeck } from "../services/storage";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "DeckBuilder">;

interface SearchResult {
	id: number;
	name: string;
	cardType: string;
}

interface Deck {
	id: number;
	name: string;
	cards: SearchResult[];
}

export default function DeckBuilderScreen({ route, navigation }: Props) {
	const editingDeckId = route.params?.deckId ?? null;

	const [deckName, setDeckName] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [allCards, setAllCards] = useState<SearchResult[]>([]);
	const [selectedCards, setSelectedCards] = useState<SearchResult[]>([]);
	const [searching, setSearching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const [selectedFilter, setSelectedFilter] = useState<string>("All");
	const filterOptions = ["All", "Beast", "Biome", "Program", "Relic"];

	useEffect(() => {
		if (editingDeckId) {
			loadExistingDeck();
		}
	}, [editingDeckId]);

	useEffect(() => {
		loadAllCards();
	}, []);

	const loadExistingDeck = async () => {
		try {
			const deck: Deck | null = await getDeckById(editingDeckId);
			if (deck) {
				setDeckName(deck.name);
				setSelectedCards(deck.cards);
			}
		} catch (err) {
			console.error("Failed to load deck for editing:", err);
		}
	};

	const loadAllCards = async () => {
		try {
			setSearching(true);
			setError(null);
			const results = await searchCards(""); // empty = all cards
			setAllCards(results);
			setSearchResults(results);
		} catch (err) {
			setError("Failed to load cards. Check your connection!");
			console.error("Initial load error:", err);
		} finally {
			setSearching(false);
		}
	};

	const applyFilters = (text: string, filter: string) => {
		const query = text.trim().toLowerCase();

		let filtered = allCards;

		if (query) {
			filtered = filtered.filter((card) =>
				card.name.toLowerCase().includes(query),
			);
		}

		if (filter !== "All") {
			filtered = filtered.filter(
				(card) => card.cardType.toLowerCase() === filter.toLowerCase(),
			);
		}

		setSearchResults(filtered);
	};

	const handleLiveSearch = (text: string) => {
		setSearchQuery(text);
		applyFilters(text, selectedFilter);
	};

	const handleFilterPress = (filter: string) => {
		setSelectedFilter(filter);
		applyFilters(searchQuery, filter);
	};

	const handleSearch = () => {
		applyFilters(searchQuery, selectedFilter);
	};

	const addCard = (card: SearchResult) => {
		setSelectedCards((prev) => [...prev, card]);
	};

	const removeCard = (index: number) => {
		setSelectedCards((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSave = async () => {
		if (!deckName.trim()) {
			Alert.alert("Missing name", "Please enter a deck name!");
			return;
		}
		if (selectedCards.length === 0) {
			Alert.alert("Empty Deck", "Add at least one card to your deck!");
			return;
		}

		try {
			if (editingDeckId) {
				await updateDeck(editingDeckId, deckName.trim(), selectedCards);
			} else {
				await saveDeck(deckName.trim(), selectedCards);
			}
			navigation.goBack();
		} catch (err) {
			Alert.alert("Error", "Failed to save deck!");
			console.error("Save error:", err);
		}
	};

	const renderSearchResult = ({ item }: { item: SearchResult }) => (
		<TouchableOpacity style={styles.resultCard} onPress={() => addCard(item)}>
			<View style={styles.resultInfo}>
				<Text style={styles.resultName}>{item.name}</Text>
				<Text style={styles.resultType}>{item.cardType}</Text>
			</View>
			<Text style={styles.addIcon}>+</Text>
		</TouchableOpacity>
	);

	const renderSelectedCard = ({
		item,
		index,
	}: {
		item: SearchResult;
		index: number;
	}) => (
		<TouchableOpacity
			style={styles.selectedTile}
			onPress={() =>
				navigation.navigate("CardDetail", {
					cardId: item.id,
					cardType: item.cardType,
				})
			}
			onLongPress={() => removeCard(index)}>
			<Text style={styles.selectedName} numberOfLines={2}>
				{item.name}
			</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.nameInput}
				placeholder="Deck Name"
				placeholderTextColor="#666"
				value={deckName}
				onChangeText={setDeckName}
			/>

			{selectedCards.length > 0 && (
				<View style={styles.selectedSection}>
					<Text style={styles.sectionLabel}>
						Deck ({selectedCards.length} cards) — long press to remove
					</Text>

					<FlatList
						data={selectedCards}
						keyExtractor={(_, index) => `selected-${index}`}
						renderItem={renderSelectedCard}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.selectedList}
					/>
				</View>
			)}

			<View style={styles.searchSection}>
				<View style={styles.searchRow}>
					<TextInput
						style={styles.searchInput}
						placeholder="Search cards..."
						placeholderTextColor="#666"
						value={searchQuery}
						onChangeText={handleLiveSearch}
						onSubmitEditing={handleSearch}
					/>
				</View>

				{/* Filter buttons */}
				<View style={styles.filterRow}>
					{filterOptions.map((item) => (
						<TouchableOpacity
							key={item}
							style={[
								styles.filterButton,
								selectedFilter === item &&
									styles.filterButtonActive,
							]}
							onPress={() => handleFilterPress(item)}>
							<Text
								style={[
									styles.filterText,
									selectedFilter === item &&
										styles.filterTextActive,
								]}>
								{item}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{searching && (
					<ActivityIndicator color="#533483" style={styles.loader} />
				)}
				{error && <Text style={styles.errorText}>{error}</Text>}

				<FlatList
					data={searchResults}
					keyExtractor={(item) => `${item.cardType}-${item.id}`}
					renderItem={renderSearchResult}
					ListEmptyComponent={
						!searching ? (
							<Text style={styles.emptyText}>No results found</Text>
						) : null
					}
					contentContainerStyle={styles.resultsList}
				/>
			</View>

			<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
				<Text style={styles.saveButtonText}>
					{editingDeckId ? "Update Deck" : "Save Deck"}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#16213E",
	},
	nameInput: {
		backgroundColor: "#0F3460",
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
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
		color: "#A0A0B0",
		fontSize: 12,
		marginBottom: 8,
	},
	selectedList: {
		gap: 8,
	},
	selectedTile: {
		backgroundColor: "#533483",
		borderRadius: 8,
		padding: 8,
		width: 72,
		height: 72,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedName: {
		color: "#FFFFFF",
		fontSize: 10,
		textAlign: "center",
	},
	searchSection: {
		flex: 1,
		paddingHorizontal: 16,
	},
	searchRow: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 8,
	},
	searchInput: {
		flex: 1,
		backgroundColor: "#0F3460",
		color: "#FFFFFF",
		padding: 12,
		borderRadius: 10,
		fontSize: 16,
	},

	filterRow: {
		flexDirection: "row",
		marginBottom: 12,
	},
	filterButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		backgroundColor: "#0F3460",
		borderRadius: 16,
		marginRight: 8,
	},
	filterButtonActive: {
		backgroundColor: "#533483",
	},
	filterText: {
		color: "#A0A0B0",
		fontSize: 13,
	},
	filterTextActive: {
		color: "#FFFFFF",
		fontWeight: "600",
	},

	loader: {
		marginVertical: 12,
	},
	errorText: {
		color: "#FF6B6B",
		textAlign: "center",
		marginBottom: 8,
	},
	resultsList: {
		paddingBottom: 8,
	},
	resultCard: {
		backgroundColor: "#0F3460",
		padding: 14,
		borderRadius: 10,
		marginBottom: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	resultInfo: {
		flex: 1,
	},
	resultName: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	resultType: {
		color: "#A0A0B0",
		fontSize: 12,
		textTransform: "uppercase",
		marginTop: 2,
	},
	addIcon: {
		color: "#533483",
		fontSize: 28,
		fontWeight: "bold",
		marginLeft: 12,
	},
	emptyText: {
		color: "#A0A0B0",
		textAlign: "center",
		marginTop: 20,
	},
	saveButton: {
		backgroundColor: "#533483",
		margin: 16,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	saveButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
