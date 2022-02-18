import { observer } from 'mobx-react-lite';
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react'
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import EventityDetailedChat from './EventityDetailedChat';
import EventityDetailedHeader from './EventityDetailedHeader';
import EventityDetailedInfo from './EventityDetailedInfo';
import EventityDetailedSidebar from './EventityDetailedSidebar';

const EventityDetails = () => {
    const {eventityStore} = useStore();
    const {selectedEventity: eventity, loadEventity, loadingInitial, clearSelectedEventity} = eventityStore;
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if (id) loadEventity(id);
        return () => clearSelectedEventity();
    }, [id, loadEventity, clearSelectedEventity]);

    if (loadingInitial || !eventity) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <EventityDetailedHeader eventity={eventity} />
                <EventityDetailedInfo eventity={eventity} />
                <EventityDetailedChat eventityId={eventity.id} />
            </Grid.Column>
            <Grid.Column width={6}>
                <EventityDetailedSidebar eventity={eventity} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(EventityDetails);
