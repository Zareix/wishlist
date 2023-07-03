'use client';

import { type User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input, InputError, InputGroup } from '@/components/ui/input';
import {
  authorizeAccess,
  revokeAccess as revokeAccessAction,
} from '@/utils/actions';

const UserAccess = ({
  messages,
  authorizedAccessTo,
}: {
  messages: IntlMessages['Settings']['access'];
  authorizedAccessTo: Pick<User, 'id' | 'email'>[];
}) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{
    email: string;
  }>();

  const submit: SubmitHandler<{
    email: string;
  }> = (data) => {
    startTransition(() => {
      authorizeAccess(data)
        .then(() => {
          router.refresh();
        })
        .catch(console.error);
    });
  };

  const revokeAccess = (userId: string) => {
    startTransition(() => {
      revokeAccessAction({ userId })
        .then(() => {
          router.refresh();
        })
        .catch(console.error);
    });
  };

  return (
    <>
      <h2>{messages.title}</h2>
      <form onSubmit={handleSubmit(submit)} className="flex gap-2">
        <InputGroup>
          <Input
            type="email"
            {...register('email', {
              required: true,
            })}
            placeholder="Email"
          />
          <InputError>
            {errors.email ? <>{messages.emailRequired}</> : <></>}
          </InputError>
        </InputGroup>
        <Button type="submit">{messages.share}</Button>
      </form>
      {authorizedAccessTo.length === 0 ? (
        <p className="mt-2">{messages.noOneAccess}</p>
      ) : (
        <>
          <h3 className="mt-2">{messages.sharedWith} : </h3>
          <ul>
            {authorizedAccessTo.map((user) => (
              <li key={user.id} className="flex items-center gap-2">
                {user.email}
                <Button
                  variant="destructive"
                  onClick={() => {
                    revokeAccess(user.id);
                  }}
                  className="ml-auto"
                >
                  {messages.revoke}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default UserAccess;
