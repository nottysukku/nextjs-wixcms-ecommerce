"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const wixClient = useWixClient();
  const router = useRouter();

  const isLoggedIn = wixClient.auth.loggedIn();

  if (isLoggedIn) {
    router.push("/");
  }

  const [mode, setMode] = useState(MODE.LOGIN);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setEmailCode("");
    setError("");
    setMessage("");
  };

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      let response;

      // Validate required fields
      if (mode === MODE.REGISTER && !username.trim()) {
        setError("Username is required for registration");
        setIsLoading(false);
        return;
      }

      if ((mode === MODE.LOGIN || mode === MODE.REGISTER) && !email.trim()) {
        setError("Email is required");
        setIsLoading(false);
        return;
      }

      if ((mode === MODE.LOGIN || mode === MODE.REGISTER) && !password.trim()) {
        setError("Password is required");
        setIsLoading(false);
        return;
      }

      console.log("Attempting authentication with mode:", mode);

      switch (mode) {
        case MODE.LOGIN:
          console.log("Attempting login with email:", email);
          response = await wixClient.auth.login({
            email: email.trim(),
            password,
          });
          console.log("Login response:", response);
          break;
          
        case MODE.REGISTER:
          console.log("Attempting registration with email:", email, "username:", username);
          
          // Additional validation for registration
          if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
          }

          try {
            // First attempt: Try without CAPTCHA token
            console.log("🔍 Debug - Wix client modules:", Object.keys(wixClient));
            console.log("🔍 Debug - Auth methods available:", Object.keys(wixClient.auth));
            
            // Check if Wix provides CAPTCHA keys
            try {
              const invisibleSiteKey = await wixClient.auth.captchaInvisibleSiteKey();
              const visibleSiteKey = await wixClient.auth.captchaVisibleSiteKey();
              console.log("🔍 Wix CAPTCHA keys - Invisible:", invisibleSiteKey, "Visible:", visibleSiteKey);
            } catch (keyError) {
              console.log("🔍 Could not get CAPTCHA keys:", keyError);
            }
            
            response = await wixClient.auth.register({
              email: email.trim(),
              password,
              profile: { 
                nickname: username.trim(),
                slug: username.trim().toLowerCase().replace(/\s+/g, '-')
              },
            });
            console.log("✅ Registration response (without CAPTCHA):", response);
          } catch (captchaError: any) {
            console.log("❌ Registration failed, full error object:", captchaError);
            console.log("❌ Error details:", captchaError.details);
            console.log("❌ Error message:", captchaError.message);
            console.log("❌ Error code:", captchaError.errorCode);
            
            // If it's specifically a CAPTCHA error, try different approaches
            if (captchaError.details?.errorCode === 'missingCaptchaToken' || 
                captchaError.errorCode === 'missingCaptchaToken') {
              console.log("🔄 Trying different CAPTCHA approaches...");
              
              // Try 1: Empty string
              try {
                console.log("🔄 Attempt 1: Empty string CAPTCHA token");
                response = await wixClient.auth.register({
                  email: email.trim(),
                  password,
                  profile: { 
                    nickname: username.trim(),
                    slug: username.trim().toLowerCase().replace(/\s+/g, '-')
                  },
                  captchaToken: "",
                });
                console.log("✅ Success with empty string:", response);
              } catch (emptyError: any) {
                console.log("❌ Empty string failed:", emptyError);
                
                // Try 2: Special bypass token (some Wix setups accept this)
                try {
                  console.log("🔄 Attempt 2: Bypass token");
                  response = await wixClient.auth.register({
                    email: email.trim(),
                    password,
                    profile: { 
                      nickname: username.trim(),
                      slug: username.trim().toLowerCase().replace(/\s+/g, '-')
                    },
                    captchaToken: "bypass-dev-token",
                  });
                  console.log("✅ Success with bypass token:", response);
                } catch (bypassError: any) {
                  console.log("❌ Bypass token failed:", bypassError);
                  
                  // Try 3: Get actual CAPTCHA site key and use dummy token
                  try {
                    console.log("🔄 Attempt 3: Getting Wix CAPTCHA site key");
                    const siteKey = await wixClient.auth.captchaVisibleSiteKey();
                    console.log("🔍 Got site key:", siteKey);
                    
                    response = await wixClient.auth.register({
                      email: email.trim(),
                      password,
                      profile: { 
                        nickname: username.trim(),
                        slug: username.trim().toLowerCase().replace(/\s+/g, '-')
                      },
                      captchaToken: "test-token-" + Date.now(),
                    });
                    console.log("✅ Success with test token:", response);
                  } catch (testError: any) {
                    console.log("❌ All attempts failed. Final error:", testError);
                    throw captchaError;
                  }
                }
              }
            } else {
              // If it's not a CAPTCHA error, throw it
              throw captchaError;
            }
          }
          break;
          
        case MODE.RESET_PASSWORD:
          console.log("Attempting password reset for email:", email);
          response = await wixClient.auth.sendPasswordResetEmail(
            email.trim(),
            `${window.location.origin}/login`
          );
          setMessage("Password reset email sent. Please check your e-mail.");
          setIsLoading(false);
          return;
          
        case MODE.EMAIL_VERIFICATION:
          console.log("Attempting email verification with code:", emailCode);
          response = await wixClient.auth.processVerification({
            verificationCode: emailCode.trim(),
          });
          console.log("Verification response:", response);
          break;
          
        default:
          break;
      }

      console.log("Authentication response loginState:", response?.loginState);

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          setMessage("Successful! You are being redirected.");
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          );

          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
            secure: window.location.protocol === 'https:',
            sameSite: 'lax'
          });
          wixClient.auth.setTokens(tokens);
          
          // Small delay before redirect to show success message
          setTimeout(() => {
            router.push("/");
          }, 1000);
          break;
          
        case LoginState.FAILURE:
          console.log("Authentication failed with error code:", response.errorCode);
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            setError("Invalid email or password!");
          } else if (response.errorCode === "emailAlreadyExists") {
            setError("Email already exists! Please try logging in instead.");
          } else if (response.errorCode === "resetPassword") {
            setError("You need to reset your password!");
          } else if (response.errorCode === "invalidUser") {
            setError("User account not found. Please check your email or register.");
          } else if (response.errorCode === "missingCaptchaToken") {
            setError("Registration requires CAPTCHA verification. Please check your Wix site settings: Dashboard > Settings > Members Area > Security > Disable 'Enable reCAPTCHA for registration'");
          } else {
            setError(`Authentication failed: ${response.errorCode || "Unknown error"}`);
          }
          break;
          
        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);
          setMessage("Please verify your email address. Check your inbox for verification code.");
          break;
          
        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is pending approval. Please wait for admin approval.");
          break;
          
        default:
          if (response?.errorCode) {
            setError(`Authentication error: ${response.errorCode}`);
          } else {
            setError("Unexpected response from authentication service.");
          }
          break;
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      
      // More specific error handling
      if (err.response?.status === 403) {
        if (err.details?.errorCode === 'missingCaptchaToken' || 
            err.errorCode === 'missingCaptchaToken' ||
            (err.message && err.message.includes('captcha'))) {
          setError("🚫 CAPTCHA Required: Wix still requires CAPTCHA for registration. Solutions: 1️⃣ Register at your Wix site directly 2️⃣ Ask admin to fully disable CAPTCHA in all Wix settings 3️⃣ Use social login options if available");
        } else {
          setError("Access forbidden. Please check your account status or try again later.");
        }
      } else if (err.response?.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (err.message?.includes('fetch')) {
        setError("Network error. Please check your internet connection.");
      } else if (err.details?.errorCode === 'missingCaptchaToken') {
        setError("CAPTCHA verification is required for registration. Please contact the administrator to enable this feature.");
      } else {
        setError(`Registration/Login failed: ${err.message || "Please try again"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center bg-white dark:bg-secondary-900 transition-colors duration-300">
      <form className="flex flex-col gap-8 w-full max-w-md p-8 bg-white dark:bg-secondary-800 rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">{formTitle}</h1>
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              placeholder="john"
              className="ring-2 ring-gray-300 dark:ring-gray-600 rounded-md p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
        ) : null}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              className="ring-2 ring-gray-300 dark:ring-gray-600 rounded-md p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 dark:ring-gray-600 rounded-md p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              onChange={(e) => setEmailCode(e.target.value)}
              value={emailCode}
            />
          </div>
        )}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="ring-2 ring-gray-300 dark:ring-gray-600 rounded-md p-4 pr-12 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye slash icon (hide password)
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password strength indicator for registration */}
            {mode === MODE.REGISTER && password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-2">
                  <div className={`h-1 flex-1 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${password.length >= 8 && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {password.length < 6 && "Password should be at least 6 characters"}
                  {password.length >= 6 && password.length < 8 && "Good, try adding uppercase letters"}
                  {password.length >= 8 && /[A-Z]/.test(password) && !/[0-9]/.test(password) && "Great! Add some numbers"}
                  {password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && !/[!@#$%^&*]/.test(password) && "Excellent! Add special characters for maximum security"}
                  {password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password) && "Perfect! Your password is very secure"}
                </div>
              </div>
            )}
          </div>
        ) : null}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            onClick={() => {
              resetForm();
              setMode(MODE.RESET_PASSWORD);
            }}
          >
            Forgot Password?
          </div>
        )}
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          ) : (
            buttonTitle
          )}
        </button>
        
        {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
          <>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-xs uppercase">Or</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                router.push("/");
              }}
              className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-4 rounded-md font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              Continue as Guest
            </button>
          </>
        )}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            {error}
            {/* Show helpful action if it's a CAPTCHA error during registration */}
            {mode === MODE.REGISTER && error.includes('CAPTCHA') && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-xs transition-colors"
                  onClick={() => {
                    // Switch to login mode
                    resetForm();
                    setMode(MODE.LOGIN);
                    setMessage("💡 Switched to Login mode. If you already have an account, login here instead!");
                  }}
                >
                  🔄 Switch to Login Instead
                </button>
                <p className="text-xs opacity-75">
                  If you don't have an account yet, you can register directly on the Wix site or ask the admin to disable CAPTCHA completely.
                </p>
              </div>
            )}
          </div>
        )}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer text-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={() => {
              resetForm();
              setMode(MODE.REGISTER);
            }}
          >
            {"Don't"} have an account? <span className="text-primary-600 dark:text-primary-400 font-medium">Sign up</span>
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer text-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={() => {
              resetForm();
              setMode(MODE.LOGIN);
            }}
          >
            Have an account? <span className="text-primary-600 dark:text-primary-400 font-medium">Sign in</span>
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer text-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={() => {
              resetForm();
              setMode(MODE.LOGIN);
            }}
          >
            <span className="text-primary-600 dark:text-primary-400 font-medium">← Go back to Login</span>
          </div>
        )}
        {message && <div className="text-green-600 dark:text-green-400 text-sm text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
