import { Button } from '@/components/ui/Button';
import { protectedRoute } from '@/utils/routes';

const Login = () => {
  return (
    <main>
      <h1>Login</h1>
      <Button>Login with Google</Button>
    </main>
  );
};

export const getServerSideProps = protectedRoute('guest');

export default Login;
