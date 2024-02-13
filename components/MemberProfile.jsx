import { fetchOrGenerateTokens, fetchUserTokensById } from '@/utils/actions';
import { UserButton, auth, currentUser } from '@clerk/nextjs';

const MemberProfile = async () => {
  const user = await currentUser();
  const { userId } = auth();
  await fetchOrGenerateTokens(userId);

  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      {user.emailAddresses[0].emailAddress}
    </div>
  );
};

export default MemberProfile;
