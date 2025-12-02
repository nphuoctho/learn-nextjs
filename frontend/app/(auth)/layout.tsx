export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='mx-auto max-w-3/4 py-6 px-4'>
      <h1>Auth Layout</h1>
      {children}
    </div>
  );
}
