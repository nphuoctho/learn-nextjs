import envConfig from '@/config';
import { cookies } from 'next/headers';

const MeProfile = async () => {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('session_token')?.value;

  if (!sessionToken) {
    return <div>Please log in to view your profile.</div>;
  }

  try {
    const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/account/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    }).then((res) => res.json());
  } catch (error) {
    console.error('🚀 ~ MeProfile ~ error:', error);
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>This is your profile page.</p>
    </div>
  );
};

export default MeProfile;
