import { protectedRoute } from '@/utils/routes';

const ArchivePage = () => {
  return <h1>Todo</h1>;
};

export const getServerSideProps = protectedRoute();

export default ArchivePage;
