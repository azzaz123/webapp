export interface InboxUserLocation {
    approximated_latitude: number;
    approximated_longitude: number;
}


export class InboxUser {
    constructor(private _id: string,
        private _microName: string,
        private _blocked: boolean,
        private _available: boolean) {
    }
    get id(): string {
        return this._id;
    }

    get microName(): string {
        return this._microName;
    }

    get blocked(): boolean {
        return this._blocked;
    }

    set blocked(value: boolean) {
        this._blocked = value;
    }

    get available(): boolean {
        return this._available;
    }

    set available(value: boolean) {
        this._available = value;
    }
}

export const InboxUserPlaceholder = new InboxUser(null, 'unknown', false, false);
