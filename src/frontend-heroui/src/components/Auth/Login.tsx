import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { useEffect, useState } from 'react';
import { EyeClosed } from '@lib/images/EyeClosed';
import { EyeOpened } from '@lib/images/EyeOpened';
import { Google } from '@lib/images/Google';
import { Github } from '@lib/images/Github';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useServerApiState } from '@lib/states';
import {
  checkLoginState,
  doBasicLogin,
  followRedirect,
} from '@lib/functions/auth';

export const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // const [sso_registration, registration_enabled] = useServerApiState(
  //   (state) => [state.sso_registration_enabled, state.registration_enabled],
  // );
  // const both_reg_enabled =
  //   registration_enabled() || sso_registration() || false;

  const [isVisible, setIsVisible] = useState(false);

  console.log('hey');
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('handleSubmit', event);
  };

  console.log(isLoggingIn);

  // useEffect(() => {
  //   // checkLoginState(navigate, location?.state, true);

  //   // check if we got login params (login and password)
  //   if (searchParams.has('login') && searchParams.has('password')) {
  //     setIsLoggingIn(true);
  //     doBasicLogin(
  //       searchParams.get('login') ?? '',
  //       searchParams.get('password') ?? '',
  //       navigate,
  //     ).then(() => {
  //       followRedirect(navigate, location?.state);
  //     });
  //   }
  // }, []);

  return (
    <>
      <Form
        className="flex flex-col gap-3"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          label="Email Address"
          name="email"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? <EyeClosed /> : <EyeOpened />}
            </button>
          }
          label="Password"
          name="password"
          placeholder="Enter your password"
          type={isVisible ? 'text' : 'password'}
          variant="bordered"
        />
        <div className="flex w-full items-center justify-between px-1 py-2">
          <Checkbox name="remember" size="sm">
            Remember me
          </Checkbox>
          <Link className="text-default-500" href="#" size="sm">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full" color="primary" type="submit">
          Log In
        </Button>
      </Form>
      <div className="flex items-center gap-4">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Button startContent={<Google size="2rem" />} variant="bordered">
          Continue with Google
        </Button>
        <Button startContent={<Github size="2rem" />} variant="bordered">
          Continue with Github
        </Button>
      </div>
      <p className="text-center text-small">
        Need to create an account?&nbsp;
        <Link href="#" size="sm">
          Sign Up
        </Link>
      </p>
    </>
  );
};
