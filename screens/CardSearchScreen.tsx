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
	cardType: string;
}

export default function CardSearchScreen({ navigation }: Props) {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [allCards, setAllCards] = useState<SearchResult[]>([]);
	const [initialLoading, setInitialLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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

	const handleLiveSearch = (text: string) => {
		setSearchQuery(text);

		const query = text.trim().toLowerCase();

		if (!query) {
			setResults(allCards);
			return;
		}

		const filtered = allCards.filter((card) =>
			card.name.toLowerCase().includes(query),
		);

		setResults(filtered);
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
			<View style={styles.searchRow}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search cards..."
					placeholderTextColor="#666"
					value={searchQuery}
					onChangeText={handleLiveSearch} // ⭐ live search
				/>
			</View>

			{initialLoading && (
				<ActivityIndicator
					size="large"
					color="#533483"
					style={{ marginTop: 40 }}
				/>
			)}

			{error && <Text style={styles.errorText}>{error}</Text>}

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
		gap: 8,
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
