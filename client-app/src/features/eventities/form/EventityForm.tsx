import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react'
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyTextInput } from '../../../app/common/form/MyTextInput';
import { MyTextArea } from '../../../app/common/form/MyTextArea';
import { MySelectInput } from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import { MyDateInput } from '../../../app/common/form/MyDateInput';
import { EventityFormValues } from '../../../app/models/eventity';

const EventityForm = () => {
    const history = useHistory();
    const {eventityStore} = useStore();
    const {createEventity, updateEventity, 
        loadEventity, loadingInitial} = eventityStore;
    const {id} = useParams<{id: string}>();

    const [eventity, setEventity] = useState<EventityFormValues>(new EventityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The event title is required'),
        description: Yup.string().required('The event description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    });

    useEffect(() => {
        if (id) loadEventity(id).then(eventity => setEventity(new EventityFormValues(eventity)));
    }, [id, loadEventity]);

    const handleFormSubmit = (eventity: EventityFormValues) => {
        if (!eventity.id) {
            let newEventity = {
                ...eventity,
                id: uuid()
            };
            createEventity(newEventity).then(() => history.push(`/eventities/${newEventity.id}`))
        } else {
            updateEventity(eventity).then(() => history.push(`/eventities/${eventity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading event..." />

    return (
        <Segment clearing>
            <Header content='Event Details' sub color='teal' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={eventity} 
                onSubmit={values => handleFormSubmit(values)}
            >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder="Description" name="description" />
                        <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
                        <MyDateInput 
                            placeholderText="Date" 
                            name="date" 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated="right" 
                            position="true" 
                            type="submit" 
                            content="Submit" 
                        />
                        <Button as={Link} to='/eventities' floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
}

export default observer(EventityForm);