'use client';

import toast from 'react-hot-toast';
import TourInfo from '@/components/TourInfo';
import {
  generateTourResponse,
  getExistingTour,
  createNewTour,
  fetchUserTokensById,
  substractTokens,
} from '@/utils/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      // On check si le tour existe déjà en base
      const existingTour = await getExistingTour(destination);

      // SI oui on retourne l'existant
      if (existingTour) {
        return existingTour;
      }

      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 300) {
        toast.error('Token balance to low');
        return;
      }
      // Sinon on le génére avec openai API
      const newTour = await generateTourResponse(destination);
      // Si erreur pendant la génération avec openai API
      if (!newTour) {
        toast.error('No matching city found...');
        return null;
      }
      // On le sauvegarde en base
      await createNewTour(newTour.tour);
      const newTokens = await substractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      // On invalide la query
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      return newTour.tour;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());

    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className=" mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="city"
            name="city"
            required
          />
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="country"
            name="country"
            required
          />
          <button
            className="btn btn-primary join-item"
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'processing tour...' : 'generate tour'}
          </button>
        </div>
      </form>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};
export default NewTour;
