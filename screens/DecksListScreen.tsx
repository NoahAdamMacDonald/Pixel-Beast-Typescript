import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { getDecks } from "../services/storage";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "DecksList">;

interface Deck {
	id: number;
	name: string;
	cards: {
		id: number;
		name: string;
		cardType: string;
	}[];
}

export default function DecksListScreen({ navigation }: Props) {
	const [decks, setDecks] = useState<Deck[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useFocusEffect(
		useCallback(() => {
			loadDecks();
		}, []),
	);

	const loadDecks = async () => {
		try {
			setLoading(true);
			const saved: Deck[] = await getDecks();
			setDecks(saved);
		} catch (error) {
			console.error("Failed to load decks:", error);
		} finally {
			setLoading(false);
		}
	};

	const renderDeck = ({ item }: { item: Deck }) => (
		<TouchableOpacity
			style={styles.deckCard}
			onPress={() =>
				navigation.navigate("DeckView", {
					deckId: item.id,
					deckName: item.name,
				})
			}>
			<Text style={styles.deckName}>{item.name}</Text>
			<Text style={styles.deckCount}>{item.cards.length} cards</Text>
		</TouchableOpacity>
	);

	const renderEmpty = () => (
		<View style={styles.emptyState}>
			<Text style={styles.emptyText}>No decks yet</Text>
			<Text style={styles.emptySubtext}>
				Tap "Create new" to get started!
			</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<Text style={styles.loadingText}>Loading Decks...</Text>
			) : (
				<FlatList
					data={decks}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderDeck}
					ListEmptyComponent={renderEmpty}
					contentContainerStyle={
						decks.length === 0
							? styles.emptyContainer
							: styles.listContent
					}
				/>
			)}

			<TouchableOpacity
				style={styles.createButton}
				onPress={() => navigation.navigate("DeckBuilder", {})}>
				<Text style={styles.createButtonText}>Create new</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#16213E",
	},
	listContent: {
		padding: 16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	deckCard: {
		backgroundColor: "#0F3460",
		padding: 20,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	deckName: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	deckCount: {
		color: "#A0A0B0",
		fontSize: 14,
	},
	emptyState: {
		alignItems: "center",
	},
	emptyText: {
		color: "#FFFFFF",
		fontSize: 18,
		marginBottom: 8,
	},
	emptySubtext: {
		color: "#A0A0B0",
		fontSize: 14,
	},
	loadingText: {
		color: "#A0A0B0",
		fontSize: 16,
		textAlign: "center",
		marginTop: 40,
	},
	createButton: {
		backgroundColor: "#533483",
		margin: 16,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	createButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
