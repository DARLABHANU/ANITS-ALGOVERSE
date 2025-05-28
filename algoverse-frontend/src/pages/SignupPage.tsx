import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, EyeOff, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignUpPage: React.FC = () => {
  // --- State Variables ---
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // --- Hooks ---
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Debugging: Log component mount and initial state ---
  useEffect(() => {
    console.log("Frontend DEBUG: SignUpPage component mounted.");
    console.log("Frontend DEBUG: Initial state - isLogin:", isLogin);
  }, []);

  // --- Frontend Form Validation Logic ---
  const validateForm = () => {
    console.log("Frontend DEBUG: Running frontend form validation...");
    const newErrors: Record<string, string> = {};
    setGeneralError(null); // Clear any previous general errors

    if (!email.trim()) {
      newErrors.email = "Email is required";
      console.log("Frontend DEBUG: Validation Error - Email is empty.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      console.log("Frontend DEBUG: Validation Error - Email format invalid.");
    }

    if (!password) {
      newErrors.password = "Password is required";
      console.log("Frontend DEBUG: Validation Error - Password is empty.");
    } else if (password.length < 8 && !isLogin) {
      newErrors.password = "Password must be at least 8 characters";
      console.log("Frontend DEBUG: Validation Error - Password too short for signup.");
    }

    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = "Name is required";
        console.log("Frontend DEBUG: Validation Error - Name is empty for signup.");
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        console.log("Frontend DEBUG: Validation Error - Passwords do not match.");
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("Frontend DEBUG: Frontend validation complete. Is form valid?", isValid, "Errors:", newErrors);
    return isValid;
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Frontend DEBUG: Form submission initiated.");

    setErrors({}); // Clear previous field-specific errors
    setGeneralError(null); // Clear previous general errors

    // Step 1: Run frontend validation
    if (!validateForm()) {
      console.log("Frontend DEBUG: Frontend validation failed. Aborting API call.");
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "destructive",
        duration: 3000,
      });
      return; // IMPORTANT: Stop execution if frontend validation fails
    }

    // Step 2: Prepare API call parameters
    const endpoint = isLogin ? "api/auth/login" : "api/auth/signup";
    const body = isLogin
      ? JSON.stringify({ email, password })
      : JSON.stringify({ name, email, password });

    // Ensure this URL matches your backend's port (which is 5000 from your backend code)
    const backendUrl = `http://localhost:5000/${endpoint}`;
    console.log(`Frontend DEBUG: Preparing API call to: ${backendUrl}`);
    console.log("Frontend DEBUG: Request Method: POST");
    console.log("Frontend DEBUG: Request Headers: Content-Type: application/json");
    console.log("Frontend DEBUG: Request Body (stringified):", body);

    // Step 3: Make the API call
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      console.log("Frontend DEBUG: Raw Response Status:", response.status);
      console.log("Frontend DEBUG: Is response.ok (status 2xx):", response.ok);

      // Step 4: Attempt to parse JSON response
      let data;
      try {
        data = await response.json();
        console.log("Frontend DEBUG: Successfully parsed JSON response data:", data);
      } catch (jsonError) {
        console.error("Frontend ERROR: Failed to parse JSON response. Server might have sent non-JSON data.", jsonError);
        // If JSON parsing fails, it's likely a non-JSON response from the server (e.g., HTML error page, or empty response).
        setGeneralError("An unexpected server response occurred. Please try again.");
        toast({
          title: "Server Error",
          description: "Received an unreadable response from the server. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
        return; // IMPORTANT: Stop execution if JSON parsing fails
      }

      // Step 5: Handle API response based on 'response.ok'
      if (response.ok) {
        // --- SUCCESS PATH ---
        console.log("Frontend DEBUG: API call successful (response.ok is true).");
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Frontend DEBUG: Token successfully stored in localStorage.");
        } else {
          console.warn("Frontend WARNING: API call was successful but no token was received in the response.");
        }

        toast({
          title: isLogin ? "Login Successful!" : "Account created!",
          description: data.msg || `You have successfully ${isLogin ? "logged in." : "signed up."}`,
          duration: 5000,
        });

        console.log("Frontend DEBUG: Redirecting to home page in 2 seconds...");
        setTimeout(() => {
          navigate("/"); // Redirect to a dashboard or home page after auth
        }, 2000);
      } else {
        // --- ERROR PATH (response.ok is FALSE, i.e., status is 4xx or 5xx) ---
        console.log("Frontend DEBUG: API call failed (response.ok is false). Handling backend errors.");
        let primaryErrorMessage = `An unexpected error occurred during ${isLogin ? "login" : "signup"}.`;
        const backendFieldErrors: Record<string, string> = {};

        // Check if backend returned an 'errors' array (e.g., from express-validator)
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          console.log("Frontend DEBUG: Backend returned field-specific validation errors in 'errors' array.");
          data.errors.forEach((err: { msg: string; param?: string }) => {
            if (err.param) {
              backendFieldErrors[err.param] = err.msg;
            } else {
              // This handles general errors that might be in the 'errors' array but without a 'param'
              primaryErrorMessage = err.msg;
            }
          });
          setErrors(backendFieldErrors); // Update field-specific errors state

          if (Object.keys(backendFieldErrors).length > 0) {
            console.log("Frontend DEBUG: Displaying field-specific errors and toast.");
            toast({
              title: "Validation Failed",
              description: "Please check the highlighted fields.",
              variant: "destructive",
              duration: 5000,
            });
          } else {
            // If there are general errors (without param) in the errors array
            console.log("Frontend DEBUG: Backend returned general error message from 'errors' array.");
            setGeneralError(primaryErrorMessage);
            toast({
              title: `${isLogin ? "Login" : "Signup"} Failed`,
              description: primaryErrorMessage,
              variant: "destructive",
              duration: 5000,
            });
          }
        } else if (data.msg) {
          // Handle general error messages from backend (e.g., "User already exists", "Invalid Credentials")
          console.log("Frontend DEBUG: Backend returned a general message (data.msg).");
          primaryErrorMessage = data.msg;
          setGeneralError(primaryErrorMessage); // Set as general error
          toast({
            title: `${isLogin ? "Login" : "Signup"} Failed`,
            description: primaryErrorMessage,
            variant: "destructive",
            duration: 5000,
          });

          // Optional: Map common backend messages to specific field errors for better UX
          if (primaryErrorMessage.toLowerCase().includes("user already exists")) {
            setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
            console.log("Frontend DEBUG: Mapped 'User already exists' to email field error.");
          } else if (primaryErrorMessage.toLowerCase().includes("invalid credentials")) {
            setErrors((prev) => ({ ...prev, email: "Invalid email or password." }));
            console.log("Frontend DEBUG: Mapped 'Invalid Credentials' to email field error.");
          }
        } else {
          // Fallback for an unexpected backend error response format (non-ok status, but no 'errors' or 'msg')
          console.warn("Frontend WARNING: Backend returned non-ok status but no 'errors' array or 'msg' field.");
          setGeneralError(`Server responded with status ${response.status} but no specific error message.`);
          toast({
            title: `${isLogin ? "Login" : "Signup"} Failed`,
            description: `Server responded with status ${response.status} but no specific error message.`,
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      // This catch block primarily fires for network errors (e.g., backend not running,
      // CORS blocked before any response is received from the server, DNS issues, etc.).
      console.error(`Frontend CRITICAL ERROR: Network or unhandled error during ${isLogin ? "login" : "signup"} fetch:`, error);
      setGeneralError("Could not connect to the server. Please check your network or try again later.");
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // --- Function to clear states when switching forms ---
  const handleToggleForm = (isLoginForm: boolean) => {
    console.log(`Frontend DEBUG: Toggling form from ${isLogin ? "Login" : "Signup"} to ${isLoginForm ? "Login" : "Signup"}.`);
    setIsLogin(isLoginForm);
    // Reset all form fields and errors
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setErrors({});
    setGeneralError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    console.log("Frontend DEBUG: Form fields and errors reset.");
  };

  // --- Render Method ---
  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/40 shadow-lg dark:bg-gray-800 dark:text-gray-50">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  {isLogin ? "Welcome Back!" : "Create an Account"}
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  {isLogin
                    ? "Enter your email and password to access your AlgoVerse account"
                    : "Enter your details to create your AlgoVerse account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name" // ADDED: name attribute
                          placeholder="John Doe"
                          className={`pl-10 rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-50`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email" // ADDED: name attribute
                        type="email"
                        placeholder="john@example.com"
                        className={`pl-10 rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-50`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password" // ADDED: name attribute
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-50`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.password}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword" // ADDED: name attribute
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-gray-50`}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms" // ADDED: name attribute
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  )}

                  {generalError && (
                    <p className="text-red-500 text-sm text-center flex items-center justify-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-2" /> {generalError}
                    </p>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
                    {isLogin ? "Login to Account" : "Create Account"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleForm(!isLogin);
                    }}
                    className="text-primary hover:underline"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;