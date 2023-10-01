'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ListUserSelection = () => {
  const { data } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  if (data?.user.hasAccessTo && data?.user.hasAccessTo.length > 0) {
    return (
      <span className="ml-auto">
        <Select
          defaultValue={params?.get('selectedUserId') ?? data.user.id}
          onValueChange={(value) => {
            if (value === data?.user.id) {
              router.push('/');
              return;
            }
            router.push(
              `?${new URLSearchParams({
                selectedUserId: value,
              }).toString()}`,
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={data.user.id}>My wishlist</SelectItem>
            {data.user.hasAccessTo.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name ?? user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </span>
    );
  }

  return <></>;
};

export default ListUserSelection;
