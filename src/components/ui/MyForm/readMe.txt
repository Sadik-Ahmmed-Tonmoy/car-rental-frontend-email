npm install react-hook-form antd clsx tailwind-merge zod @hookform/resolvers





____________________________________________________________________________________________________________
example:
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const validationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});

  const handleSubmit = async (formData: any, reset: any) => {
    const response = await handleAsyncWithToast(async () => {
      return login(formData);
    });
    if (response?.data?.success) {
      console.log(response);
      const user = await verifyToken(response?.data?.data?.token) as DecodedUser;;
      console.log(user);
      await dispatch(
        setUser({
          user: user,
          access_token: response?.data?.data?.token,
          refresh_token: response?.data?.data?.refresh_token,
        })
      );
      reset();
      if (user?.role === 'ADMIN') {
        router.push('/admin/subscription-management');
      } else {
        router.push('/');
      }
    }
  };

      <MyFormWrapper
            onSubmit={handleSubmit}
            resolver={zodResolver(validationSchema)}
            className="space-y-6"
          >
            <div className="bg-gray-50 p-6 md:p-8 rounded-lg space-y-6">
              <MyFormInput name="email" type="email" label="Email" />

              <div>
                <div className="relative">
                  <MyFormInput
                    name="password"
                    type="password"
                    label="Password"

                  />
                </div>
                <div className="w-full flex flex-col gap-1 xs:flex-row items-center justify-between">
                  <MyFormCheckbox name="remember" label="Keep me sign in" />
                  <Link
                    href={"/auth/email-for-reset-password"}
                    className="text-blue-500 cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                Sign In
              </button>

              <div className="text-center text-sm">
                Don’t have an account?
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-700 font-medium ps-1"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </MyFormWrapper>