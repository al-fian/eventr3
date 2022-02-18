import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import EventityFilters from './EventityFilters';
import EventityList from './EventityList';
import EventityListItemPlaceholder from './EventityListItemPlaceholder';

const EventityDashboard = () => {
    const {eventityStore} = useStore();
    const {loadEventities, eventityRegistry, setPagingParams, pagination} = eventityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadEventities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
      if (eventityRegistry.size <= 1) loadEventities();
    }, [loadEventities, eventityRegistry]);

    return (
        <Grid>
            <Grid.Column width='10'>
                {eventityStore.loadingInitial && !loadingNext ? (
                    <>
                        <EventityListItemPlaceholder />
                        <EventityListItemPlaceholder />
                    </>
                ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <EventityList />
                        </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width="6">
                <EventityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(EventityDashboard);