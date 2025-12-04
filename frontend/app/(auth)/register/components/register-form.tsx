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
  LoginSuccessData,
  RegisterBody,
  RegisterBodyType,
} from '@/schema-validations/auth.schema';
import {
  ErrorResponseType,
  SuccessResponseType,
} from '@/schema-validations/common.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const RegisterForm = () => {
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterBodyType) => {
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_URL}/auth/register`,
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

      toast.success(result.payload.message);
    } catch (error) {
      const errRes = error as ErrorResponseType;

      if (errRes.status === 422 && errRes.payload.errors) {
        errRes.payload.errors.forEach((fieldError) => {
          form.setError(fieldError.field as keyof RegisterBodyType, {
            type: 'server',
            message: fieldError.message,
          });
        });
      }

      toast.error(errRes.payload.message);
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>This is your confirm password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
