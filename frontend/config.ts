import z from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

const configClient = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!configClient.success) {
  console.error('Invalid environment variables:', configClient.error.issues);
  throw new Error('Invalid environment variables');
}

const envConfig = configClient.data;

export default envConfig;
