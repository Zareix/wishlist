import { type GetStaticPropsContext } from 'next';

const OfflinePage = () => {
  return (
    <div>
      <h1>Offline</h1>
    </div>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // eslint-disable-next-line
      messages: (await import(`@/messages/${context.locale}.json`)).default,
    },
  };
}

export default OfflinePage;
