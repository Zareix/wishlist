import { type GetStaticPropsContext } from 'next';

export default function Custom500() {
  return <h1>500 - Server-side error occurred</h1>;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // eslint-disable-next-line
      messages: (await import(`@/messages/${context.locale}.json`)).default,
    },
  };
}
