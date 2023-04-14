import { type GetServerSideProps } from 'next';

import { getServerAuthSession } from '@/server/auth';

type Role = 'connected' | 'guest';

const protectedRoute = (
  role: Role = 'connected',
  // eslint-disable-next-line @typescript-eslint/require-await
  callback: GetServerSideProps = async () => ({
    props: {},
  }),
): GetServerSideProps => {
  if (role === 'guest') {
    return async (ctx) => {
      const session = await getServerAuthSession(ctx);
      if (session?.user) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
      return callback(ctx);
    };
  }
  return async (ctx) => {
    const session = await getServerAuthSession(ctx);
    if (!session?.user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return callback(ctx);
  };
};

export { protectedRoute };
