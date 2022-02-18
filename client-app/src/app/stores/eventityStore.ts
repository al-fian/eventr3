import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Eventity, EventityFormValues } from "../models/eventity";
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class EventityStore {
    eventityRegistry = new Map<string, Eventity>();
    selectedEventity: Eventity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.eventityRegistry.clear();
                this.loadEventities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString());
            } else {
                params.append(key, value);
            }
        })
        return params;
    }

    get eventitiesByDate() {
        return Array.from(this.eventityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedEventities() {
        return Object.entries(
            this.eventitiesByDate.reduce((eventities, eventity) => {
                const date = format(eventity.date!, 'dd MMM yyyy');
                eventities[date] = eventities[date] ? [...eventities[date], eventity] : [eventity];
                return eventities;
            }, {} as {[key: string]: Eventity[]})
        );
    }

    loadEventities = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Eventities.list(this.axiosParams);
            result.data.forEach(eventity => {
                this.setEventity(eventity);
            });
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);     
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadEventity = async (id: string) => {
        let eventity = this.getEventity(id);
        if (eventity) {
            this.selectedEventity = eventity;
            return eventity;
        } else {
            this.loadingInitial = true;
            try {
                eventity = await agent.Eventities.details(id);
                this.setEventity(eventity);
                runInAction(() => {
                    this.selectedEventity = eventity;
                })
                this.setLoadingInitial(false);
                return eventity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setEventity = (eventity: Eventity) => {
        const user = store.userStore.user;
        if (user) {
            eventity.isGoing = eventity.attendees!.some(
                u => u.username === user.username
            );
            eventity.isHost = eventity.hostUsername === user.username;
            eventity.host = eventity.attendees?.find(x => x.username === eventity.hostUsername);
        }
        eventity.date = new Date(eventity.date!);
        this.eventityRegistry.set(eventity.id, eventity);
    }

    private getEventity = (id: string) => {
        return this.eventityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createEventity = async (eventity: EventityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Eventities.create(eventity);
            const newEventity = new Eventity(eventity);
            newEventity.hostUsername = user!.username;
            newEventity.attendees = [attendee];
            this.setEventity(newEventity);
            runInAction(() => {
                this.selectedEventity = newEventity;
            });
        } catch (error) {
            console.log(error);
        }
    }

    updateEventity = async (eventity: EventityFormValues) => {
        try {
            await agent.Eventities.update(eventity);
            runInAction(() => {
                if (eventity.id) {
                    let updatedEventity = {...this.getEventity(eventity.id), ...eventity};
                    this.eventityRegistry.set(eventity.id, updatedEventity as Eventity);
                    this.selectedEventity = updatedEventity as Eventity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteEventity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Eventities.delete(id);
            runInAction(() => {
                this.eventityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Eventities.attend(this.selectedEventity!.id);
            runInAction(() => {
                if (this.selectedEventity?.isGoing) {
                    this.selectedEventity.attendees =
                        this.selectedEventity.attendees?.filter(e => e.username !== user?.username);
                        this.selectedEventity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedEventity?.attendees?.push(attendee);
                    this.selectedEventity!.isGoing = true;
                }
                this.eventityRegistry.set(this.selectedEventity!.id, this.selectedEventity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelEventityToggle = async () => {
        this.loading = true;
        try {
            await agent.Eventities.attend(this.selectedEventity!.id);
            runInAction(() => {
                this.selectedEventity!.isCancelled = !this.selectedEventity?.isCancelled;
                this.eventityRegistry.set(this.selectedEventity!.id, this.selectedEventity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedEventity = () => {
        this.selectedEventity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.eventityRegistry.forEach(eventity => {
            eventity.attendees.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }

}