import LoginForm from '@/app/(auth)/login/components/login-form';

const LoginPage = () => {
  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold'>Login Page</h1>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
