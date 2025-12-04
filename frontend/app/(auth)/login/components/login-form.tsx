'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import envConfig from '@/config';
import {
  LoginBodyType,
  LoginBody,
  LoginSuccessData,
} from '@/schema-validations/auth.schema';
import {
  ErrorResponseType,
  SuccessResponseType,
} from '@/schema-validations/common.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };

        if (!res.ok) {
          throw data;
        }

        return data as SuccessResponseType<LoginSuccessData>;
      });

      // Save session token to cookie via API route
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(result),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.ok) {
        toast.error('Không thể lưu session');
        return;
      }

      toast.success(result.payload.message);
      router.push('/me');
      router.refresh();
    } catch (error) {
      // Type-safe error handling
      const errorResponse = error as ErrorResponseType;

      if (errorResponse.status === 422 && errorResponse.payload.errors) {
        errorResponse.payload.errors.forEach((err) => {
          // Ensure the field exists in the form schema
          if (err.field in form.formState.defaultValues!) {
            form.setError(err.field as keyof LoginBodyType, {
              type: 'server',
              message: err.message,
            });
          }
        });
      } else {
        toast.error(errorResponse.payload.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
        noValidate
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>This is your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>This is your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
