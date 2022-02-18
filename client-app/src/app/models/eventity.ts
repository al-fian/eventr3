import { Profile } from "./profile";

export interface Eventity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[];
}

export class Eventity implements Eventity {
    constructor(init?: EventityFormValues) {
        Object.assign(this, init);
    }
}

export class EventityFormValues {
    id?: string = undefined;
    title: string = '';
    date: Date | null = null;
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';

    constructor(eventity?: EventityFormValues) {
        if (eventity) {
            this.id = eventity.id;
            this.title = eventity.title;
            this.date = eventity.date;
            this.description = eventity.description;
            this.category = eventity.category;
            this.city = eventity.city;
            this.venue = eventity.venue;
        }
    }
}