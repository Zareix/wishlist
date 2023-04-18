import { type GetStaticPropsContext } from 'next';

export default function Page404() {
  return <h1>404 - Page Not Found</h1>;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // eslint-disable-next-line
      messages: (await import(`@/messages/${context.locale}.json`)).default,
    },
  };
}
