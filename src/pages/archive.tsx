import { protectedRoute } from '@/utils/routes';

const ArchivePage = () => {
  return (
    <main>
      <h1>Archive</h1>
    </main>
  );
};

export const getServerSideProps = protectedRoute();

export default ArchivePage;
