export interface Effect {
	text: string;
	trigger: string[];
	available?: string;
}

export interface SoulEffect {
	text: string;
	trigger: string;
	available?: string;
}

export interface Special {
	name: string;
	text: string;
}

export interface CardStats {
	name: string;
	image?: string | null;
	playCost?: number;
	level?: number;
	bts?: number;
	evoCost?: number;
	evoColor?: string;
	color?: string;
	bitEffect?: string | null;
	traits?: string[];
	keywords?: string[];
	restrictions?: string[];
	effects?: Effect[];
	soulEffects?: SoulEffect[];
	special?: Special | null;
}

export interface Card {
	cardType: string;
    stats: CardStats;
}
