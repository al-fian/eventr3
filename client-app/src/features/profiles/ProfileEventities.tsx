import { format } from 'date-fns';
import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Tab, TabProps, Image } from 'semantic-ui-react';
import { UserEventity } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' }},
    { menuItem: 'Past Events', pane: { key: 'past' }},
    { menuItem: 'Hosting', pane: { key: 'hosting' }},
]

const ProfileEventities = () => {
    const {profileStore} = useStore();
    const {
        loadUserEventities,
        profile,
        loadingEventities,
        userEventities
    } = profileStore;

    useEffect(() => {
        loadUserEventities(profile!.username);
    }, [loadUserEventities, profile]);

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserEventities(profile!.username, panes[data.activeIndex as number].pane.key);
    }

    return (
        <Tab.Pane loading={loadingEventities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Eventities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{secondary: true, pointing: true}}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userEventities.map((eventity: UserEventity) => (
                            <Card
                                as={Link}
                                to={`/eventities/${eventity.id}`}
                                key={eventity.id}
                            >
                                <Image
                                    src={`/assets/categoryImages/${eventity.category}.jpg`}
                                    style={{minHeight: 100, objectFit: 'cover'}}
                                />
                                <Card.Content>
                                    <Card.Header textAlign='center'>{eventity.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(eventity.date), 'do LLL')}</div>
                                        <div>{format(new Date(eventity.date), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileEventities);
