'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

const SignOut = ({
  messages,
}: {
  messages: IntlMessages['settings']['logout'];
}) => {
  return (
    <div className="flex justify-center">
      <Button onClick={() => signOut().catch(console.error)}>
        <LogOutIcon className="mr-2" />
        {messages}
      </Button>
    </div>
  );
};

export default SignOut;
