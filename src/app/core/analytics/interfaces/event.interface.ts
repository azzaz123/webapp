export const EVENT_TYPES = {
    Navigation: 1,
    Location: 2,
    Search: 3,
    Transaction: 4,
    UserContent: 5,
    UserPreference: 6,
    Social: 7,
    Other: 8
}

export interface EventInterface {
    name: string;
    eventType: number;
    attributes: Object;
}