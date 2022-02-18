import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Eventity } from '../../../app/models/eventity';
import {format} from 'date-fns';
import EventityListItemAttendee from './EventityListItemAttendee';

interface Props {
    eventity: Eventity;
}

export const EventityListItem = ({eventity} : Props) => {
    return (
        <Segment.Group>
            <Segment>
                {eventity.isCancelled && 
                    <Label attached='top' color='red' content='Cancelled' style={{textAlign: 'center'}} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='tiny' circular src={eventity.host?.image || '/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/eventities/${eventity.id}`}>
                                {eventity.title}
                            </Item.Header>
                            <Item.Description>Hosted by <Link to={`/profiles/${eventity.hostUsername}`}>{eventity.host?.displayName}</Link></Item.Description>
                            {eventity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'>
                                        You are hosting this event
                                    </Label>
                                </Item.Description>
                            )}
                            {eventity.isGoing && !eventity.isHost && (
                                <Item.Description>
                                    <Label basic color='green'>
                                        You are going to this event
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(eventity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {eventity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <EventityListItemAttendee attendees={eventity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{eventity.description}</span>
                <Button 
                    as={Link}
                    to={`/eventities/${eventity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
}
