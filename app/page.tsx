import getCurrentUser from './actions/getCurrentUser';
import getListings, { IListingParams } from './actions/getListings';
import ClientOnly from './components/ClientOnly';
import Container from './components/Container';
import EmptyState from './components/EmptyState';
import ListingCard from './components/listings/ListingCard';

interface HomeProps {
  searchParams: IListingParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();
  if (listings.length === 0)
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  return (
    <ClientOnly>
      <Container>
        <div
          className="
            grid 
            grid-cols-1 
            gap-8 
            pt-24 
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            "
        >
          {listings.map((listing: any) => {
            return (
              <ListingCard
                currentUser={currentUser}
                key={listing.id}
                data={listing}
              />
            );
          })}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default Home;
