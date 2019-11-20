import { ANALYTICS_EVENT_NAMES } from './analytics-event-names';

export enum EVENT_TYPES {
    Navigation = 1,
    Location = 2,
    Search = 3,
    Transaction = 4,
    UserContent = 5,
    UserPreference = 6,
    Social = 7,
    Other = 8
}

export enum SCREENS_IDS {
    Login = 177,
    Wall = 110,
    BumpsSlider = 187,
    ProPreviewProfile = 188,
    Search = 111,
    Filters = 186,
    SearchAlerts = 184,
    ItemDetail = 115,
    EditItem = 162,
    Profile = 29,
    EditProfile = 148,
    MyZone = 140,
    Upload = 41,
    Chat = 27
}

export interface PageViewInterface {
    name: string;
    attributes: Object;
    flags?: Object;
}

export interface EventInterface {
    name: ANALYTICS_EVENT_NAMES;
    eventType: EVENT_TYPES;
    attributes: Object;
}
