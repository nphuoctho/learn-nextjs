import { LoginSuccessData } from '@/schema-validations/auth.schema';
import { SuccessResponseType } from '@/schema-validations/common.schema';

export async function POST(request: Request) {
  const res: SuccessResponseType<LoginSuccessData> = await request.json();
  const token = res.payload.data?.token;
  const expiresAt = res.payload.data?.expiresAt;

  if (!token) {
    return Response.json({ message: 'No token provided' }, { status: 400 });
  }

  // Calculate Max-Age from expiresAt
  const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
  const maxAge = expiresAtDate
    ? Math.floor((expiresAtDate.getTime() - Date.now()) / 1000)
    : 604800; // Default 7 days

  const cookieOptions = [
    `session_token=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];

  return Response.json(res, {
    status: 200,
    headers: {
      'Set-Cookie': cookieOptions.join('; '),
    },
  });
}
