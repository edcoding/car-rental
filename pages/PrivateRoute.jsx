import { useAuth } from "../contexts/AuthContext";
import LoginPage  from './auth/LoginPage'
import AdminLogin from './admin/AdminLogin';
import { useRouter } from 'next/router'

const PrivateRoute = (Component) => {


  const Auth = (props) => {
    // Login data added to props via redux-store (or use react context for example)
    const { currentUser } = useAuth();
    const router = useRouter();

    // If user is not logged in, return login component or admin login
     return currentUser ? <Component {...props} /> : router.pathname.includes('admin') ? <AdminLogin />: <LoginPage />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default PrivateRoute;
