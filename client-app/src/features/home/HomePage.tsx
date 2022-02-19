import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

const HomePage = () => {
    const {userStore, modalStore} = useStore();

    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <p>
                    A DEMO social media website.<br/>
                    Technologies used: <br/>
                    (Backend) ASPNET Core 6, C#, SignalR, PostGreSQL, Restful Web API <br/>
                    (Frontend) ReactJS, Typescript, MobX
                </p>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}} />
                    Eventr
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Eventr' />
                        <Button as={Link} to='/eventities' size='huge' inverted>
                            Go to events
                        </Button>
                    </>
                    
                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                            Login
                        </Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                            Register
                        </Button>
                    </>    
                )}
            </Container>
        </Segment>
    )
}

export default observer(HomePage);
