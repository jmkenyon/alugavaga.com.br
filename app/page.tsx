import EmptyState from "./components/EmptyState";
import Container from "./components/Container";
import getListings, { IListingsParams } from "./actions/getListings";
import ListingCard from "./components/listings/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";

// Match Next.js type for `searchParams`
interface HomeProps {
  searchParams?: Promise<Partial<IListingsParams>>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const resolvedParams = (await searchParams) ?? {};
  const listings = await getListings(resolvedParams);
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div
        className="
          pt-8
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default Home;