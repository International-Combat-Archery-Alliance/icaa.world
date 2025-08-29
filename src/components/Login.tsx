import type { components } from '@/api/login';
import { useLogin, useLogout } from '@/hooks/useLogin';
import { GoogleLogin } from '@react-oauth/google';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useUserInfo } from '@/context/userInfoContext';

export default function Login() {
  const { mutate } = useLogin();
  const { userInfo, isSuccess, refetchUserInfo } = useUserInfo();

  return isSuccess ? (
    <SignedIn userInfo={userInfo} refetchUserInfo={refetchUserInfo} />
  ) : (
    <GoogleLogin
      type="icon"
      shape="circle"
      onSuccess={(credentialResponse) =>
        mutate(
          {
            credentials: 'include',
            body: {
              googleJWT: credentialResponse.credential ?? '',
            },
          },
          { onSuccess: refetchUserInfo },
        )
      }
    />
  );
}

function SignedIn({
  userInfo,
  refetchUserInfo,
}: {
  userInfo: components['schemas']['UserInfo'] | undefined;
  refetchUserInfo: () => void;
}) {
  const { mutate: logoutMutate, isPending } = useLogout();

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
        side="top"
        align="start"
        className="z-60 flex flex-col gap-4 text-center justify-center w-64"
      >
        <div className="font-bold">{userInfo?.userEmail}</div>
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() => {
            logoutMutate(
              { credentials: 'include' },
              { onSuccess: refetchUserInfo },
            );
          }}
        >
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
