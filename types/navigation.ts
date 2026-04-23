export type RootStackParamList = {
	Home: undefined;
	DecksList: undefined;
	DeckView: {
		deckId: number;
		deckName: string;
	};
	DeckBuilder: {
		deckId?: number;
	};
	CardSearch: undefined;
	CardDetail: {
		cardId: number;
		cardType: string;
		cardName?: string;
	};
};
