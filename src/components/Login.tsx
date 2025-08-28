import type { components } from '@/api/login';
import { useLogin, useLoginUserInfo } from '@/hooks/useLogin';
import { GoogleLogin } from '@react-oauth/google';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { mutate } = useLogin();
  const { data: userInfo, isSuccess } = useLoginUserInfo();

  return isSuccess ? (
    <SignedIn userInfo={userInfo} />
  ) : (
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

function SignedIn({
  userInfo,
}: {
  userInfo: components['schemas']['UserInfo'] | undefined;
}) {
  console.log(userInfo?.profilePicURL);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="ring-2 ring-primary">
          <AvatarImage
            src={userInfo?.profilePicURL}
            alt="Google user profile image"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="end"
        alignOffset={32}
        className="z-60 flex justify-center w-48"
      >
        <Button>Log out</Button>
      </PopoverContent>
    </Popover>
  );
}
