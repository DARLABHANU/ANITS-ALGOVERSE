import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Code2, BookOpen, Trophy, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar'; // Assuming this is the correct path to your Navbar component

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: type === 'login' ? 'Welcome back!' : 'Account created!',
        description: type === 'login'
          ? 'You have successfully logged in to AlgoVerse.'
          : 'Your AlgoVerse account has been created successfully.',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navbar at the top, explicitly hiding the SignUp button */}
      <Navbar hideSignUpButton={true} />

      {/* Watermark */}
      <div className="watermark">AlgoVerse</div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content Container */}
      {/* Added pt-20 (5rem) and min-h-[calc(100vh-80px)] to push content down below the fixed navbar */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center p-4 pt-20">
        <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

          {/* LEFT COLUMN: Branding, Feature Icons, Stats (Hidden on LG screens and up) */}
          <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center items-center p-6 lg:p-12 relative order-2 md:order-1">
            <div className="max-w-lg text-center space-y-6">
              <div className="flex items-center justify-center mb-8">
                <Code2 className="w-12 h-12 text-primary mr-3" />
                <h1 className="text-4xl font-bold gradient-text">AlgoVerse</h1>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                Master the art of <span className="gradient-text">algorithms</span> with interactive learning
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300">
                Explore complex concepts through visualizations, hands-on challenges, and expert-crafted learning paths designed for all experience levels.
              </p>

              {/* Feature Icons */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="feature-icon">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Interactive Visualizations</h3>
                </div>
                <div className="text-center">
                  <div className="feature-icon">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Hands-on Challenges</h3>
                </div>
                <div className="text-center">
                  <div className="feature-icon">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Learning Paths</h3>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Developers mastering algorithms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Interactive challenges</div>
                </div>
              </div>
            </div>

            {/* Code Snippet Decoration */}
          
          </div>

          {/* RIGHT COLUMN: Auth Form + Quick Sort Card (Visible on all screens) */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 order-1 md:order-2">
            <div className="w-full max-w-md">
              <Card className="glass-card border-0 shadow-2xl p-8">
                <div className="text-center mb-8">
                  {/* The AlgoVerse logo/title visible on smaller screens within the card */}
                  <div className="flex items-center justify-center lg:hidden mb-4">
                    <Code2 className="w-8 h-8 text-primary mr-2" />
                    <h1 className="text-2xl font-bold gradient-text">AlgoVerse</h1>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Welcome to your learning journey
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join thousands of developers mastering algorithms
                  </p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <a href="#" className="text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 cta-button"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={(e) => handleAuth(e, 'signup')} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            required
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="your@email.com"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="flex items-start space-x-2 text-sm">
                        <input type="checkbox" required className="rounded border-gray-300 mt-1" />
                        <span className="text-gray-600 dark:text-gray-400">
                          I agree to the{' '}
                          <a href="#" className="text-primary hover:underline">Terms of Service</a>
                          {' '}and{' '}
                          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </span>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 cta-button"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button variant="outline" className="h-12">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-12">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.754-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;