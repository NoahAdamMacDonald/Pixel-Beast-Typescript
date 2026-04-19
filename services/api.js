const BASE_URL = 'https://card-api.fly.dev/api'

//Searching across all card types by name

export async function searchCards(query){
    const types = ['beast', 'biome', 'program', 'relic'];

    try{
        const requests = types.map((type) => fetch(`${BASE_URL}/${type}?name=${encodeURIComponent(query)}&limit=10`)
    .then((res) => res.json())
    .then((data) => {
        if (data.results) {
            return data.results.map((card) => ({
                ...card,
                cardType: type,
            }));
        }
        return [];
    })
    .catch(() => []) 
    );
    const results = await Promise.all(requests);
    return results.flat();
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
}

//Get a single card by type and ID

export async function getCardById(cardType, cardId) {
    try {
        const response = await fetch(`${BASE_URL}/${cardType}/${cardId}`);

        if  (!response.ok) {
            throw new Error(`Card not found (${response.status})`);
        }
        return await response.json();
    } catch (error) {
        console.error('Get card failed:', error);
        throw error;
    }
}

//Get all cards of a specific type (with optional filters)
export async function getCardsByType(cardType, options = {}) {
    try {
        const params = new URLSearchParams();

        if (options.page) params.set('page', options.page);
        if (options.limit) params.set('limit', options.limit);
        if (options.name) params.set('name', options.name);
        if (options.order) params.set('order', options.order);

        const query = params.toString();
        const url = `${BASE_URL}/${cardType}${query ? '?' + query : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${cardType}s (${response.status})`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Get ${cardType}s failed:`, error);
        throw error;
    }
}