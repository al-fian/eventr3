import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { EventityListItem } from './EventityListItem';

const EventityList = () => {
    const {eventityStore} = useStore();
    const {groupedEventities} = eventityStore;

    return (
        <>
            {groupedEventities.map(([group, eventities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {eventities.map(eventity => (
                        <EventityListItem key={eventity.id} eventity={eventity} />
                    ))}
                </Fragment>
            ))}
        </>
    )
}

export default observer(EventityList);