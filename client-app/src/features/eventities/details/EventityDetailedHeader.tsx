import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import {Eventity} from "../../../app/models/eventity";
import {format} from 'date-fns';
import { useStore } from '../../../app/stores/store';

const eventityImageStyle = {
    filter: 'brightness(30%)'
};

const eventityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    eventity: Eventity
}

const EventityDetailedHeader = ({eventity}: Props) => {
    const {eventityStore: {updateAttendance, loading, cancelEventityToggle}} = useStore();

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {eventity.isCancelled && 
                    <Label style={{position: 'absolute', zIndex: 1000, left: -14, top: 20}}
                        ribbon color='red' content='Cancelled' />
                }
                <Image src={`/assets/categoryImages/${eventity.category}.jpg`} fluid style={eventityImageStyle}/>
                <Segment style={eventityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={eventity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(eventity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${eventity.host?.username}`}>
                                                        {eventity.host?.displayName}
                                                        </Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {eventity.isHost ? (
                    <>
                        <Button 
                            color={eventity.isCancelled ? 'green' : 'red'}
                            floated='left'
                            basic
                            content={eventity.isCancelled ? 'Re-activate Event' : 'Cancel Event'}
                            onClick={cancelEventityToggle}
                            loading={loading}
                        />
                        <Button 
                            disabled={eventity.isCancelled}
                            as={Link} to={`/manage/${eventity.id}`} 
                            color='orange' floated='right'>
                            Manage Event
                        </Button>
                    </>

                ) : eventity.isGoing ? (
                    <Button loading={loading} onClick={updateAttendance}>Cancel attendance</Button>
                    ) : (
                            <Button 
                                disabled={eventity.isCancelled}
                                loading={loading} 
                                onClick={updateAttendance} 
                                color='teal'
                            >
                                Join Event
                            </Button>
                        )
                }
            </Segment>
        </Segment.Group>
    )
}

export default observer(EventityDetailedHeader)