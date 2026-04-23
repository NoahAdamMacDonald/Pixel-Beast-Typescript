import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";

import { searchCards } from "../services/api";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "CardSearch">;

interface SearchResult {
	id: number;
	name: string;
	cardType: string; // beast | biome | program | relic
}

export default function CardSearchScreen({ navigation }: Props) {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [allCards, setAllCards] = useState<SearchResult[]>([]);
	const [initialLoading, setInitialLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedFilter, setSelectedFilter] = useState<string>("All");

	const filterOptions = ["All", "Beast", "Biome", "Program", "Relic"];

	useEffect(() => {
		const loadAll = async () => {
			try {
				setInitialLoading(true);
				const data = await searchCards("");
				setAllCards(data);
				setResults(data);
			} catch (error) {
				console.error("Failed to load all cards:", error);
				setError("Failed to load cards.");
			} finally {
				setInitialLoading(false);
			}
		};

		loadAll();
	}, []);

	const applyFilters = (text: string, filter: string) => {
		const query = text.trim().toLowerCase();

		let filtered = allCards;

		//Text search
		if (query) {
			filtered = filtered.filter((card) =>
				card.name.toLowerCase().includes(query),
			);
		}

		//Type filter		
		if (filter !== "All") {
			filtered = filtered.filter(
				(card) => card.cardType.toLowerCase() === filter.toLowerCase(),
			);
		}

		setResults(filtered);
	};

	const handleLiveSearch = (text: string) => {
		setSearchQuery(text);
		applyFilters(text, selectedFilter);
	};

	const handleFilterPress = (filter: string) => {
		setSelectedFilter(filter);
		applyFilters(searchQuery, filter);
	};

	const renderResult = ({ item }: { item: SearchResult }) => (
		<TouchableOpacity
			style={styles.resultCard}
			onPress={() =>
				navigation.navigate("CardDetail", {
					cardId: item.id,
					cardType: item.cardType,
				})
			}>
			<Text style={styles.resultName}>{item.name}</Text>
			<Text style={styles.resultType}>{item.cardType}</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{/* Search bar */}
			<View style={styles.searchRow}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search cards..."
					placeholderTextColor="#666"
					value={searchQuery}
					onChangeText={handleLiveSearch}
				/>
			</View>

			{/* Filter buttons */}
			<View style={styles.filterRow}>
				<FlatList
					data={filterOptions}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item}
					renderItem={({ item }) => (
						<TouchableOpacity
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
					)}
				/>
			</View>

			{/* Loading spinner */}
			{initialLoading && (
				<ActivityIndicator
					size="large"
					color="#533483"
					style={{ marginTop: 40 }}
				/>
			)}

			{error && <Text style={styles.errorText}>{error}</Text>}

			{/* Results */}
			{!initialLoading && (
				<FlatList
					data={results}
					keyExtractor={(item) => `${item.cardType}-${item.id}`}
					renderItem={renderResult}
					ListEmptyComponent={
						<Text style={styles.emptyText}>No results found!</Text>
					}
					contentContainerStyle={styles.resultsList}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#16213E",
		padding: 16,
	},
	searchRow: {
		flexDirection: "row",
		marginBottom: 16,
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
		paddingVertical: 8,
		paddingHorizontal: 14,
		backgroundColor: "#0F3460",
		borderRadius: 20,
		marginRight: 8,
	},
	filterButtonActive: {
		backgroundColor: "#533483",
	},
	filterText: {
		color: "#A0A0B0",
		fontSize: 14,
		fontWeight: "500",
	},
	filterTextActive: {
		color: "#FFFFFF",
		fontWeight: "700",
	},

	errorText: {
		color: "#FF6B6B",
		textAlign: "center",
		marginBottom: 8,
	},
	resultsList: {
		paddingBottom: 16,
	},
	resultCard: {
		backgroundColor: "#0F3460",
		padding: 16,
		borderRadius: 10,
		marginBottom: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
	},
	emptyText: {
		color: "#A0A0B0",
		textAlign: "center",
		marginTop: 40,
	},
});
