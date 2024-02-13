import { redirect, useParams } from 'next/navigation';
import TourInfo from '@/components/TourInfo';
import { generateTourImage, getSingleTour } from '@/utils/actions';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;


const SingleTourPage = async ({ params }) => {
  const tour = await getSingleTour(params.id);

  if (!tour) {
    return redirect('/tours');
  }
  const { city, country, title } = tour;
  // const tourImage = await generateTourImage({ city, country });

  const {data} = await axios.get(`${url}${city}`)
  const tourImage =  data?.results[0].urls?.raw
  
  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        back to tours
      </Link>
      {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={500}
            height={500}
            className="rounded-xl shadow-xl mb-16 h-96 w-96 object-cover"
            alt={title}
          />
        </div>
      ) : null}

      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
