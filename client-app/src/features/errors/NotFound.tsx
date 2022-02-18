import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

export const NotFound = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Not found here!
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/eventities'>
                    Return to events
                </Button>
            </Segment.Inline>
        </Segment>
    )
}
