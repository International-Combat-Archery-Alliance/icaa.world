import { useLogin } from '@/hooks/useLogin';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { mutate } = useLogin();

  return (
    <GoogleLogin
      type="icon"
      shape="circle"
      onSuccess={(credentialResponse) =>
        mutate({
          credentials: 'include',
          body: {
            googleJWT: credentialResponse.credential ?? '',
          },
        })
      }
    />
  );
}
