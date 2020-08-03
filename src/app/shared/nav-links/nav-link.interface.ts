export interface NavLinkCounter {
    currentVal: number;
    maxVal?: number;
}

export interface NavLink {
    id: string;
    display: string;
    counter?: NavLinkCounter;
}

export interface SortLink {
    value: string;
    label: string;
}
