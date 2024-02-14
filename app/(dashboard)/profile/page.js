import { UserProfile, auth } from '@clerk/nextjs';
import { fetchUserTokensById } from '@/utils/actions';

const ProfilePage = async () => {
  const { userId } = auth();
  const currentTokens = await fetchUserTokensById(userId);
  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">
        Token amount: {currentTokens} tokens
      </h2>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
