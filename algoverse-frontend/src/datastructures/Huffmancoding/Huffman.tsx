import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  User,
  Check,
  Play,
  Code,
  GitBranch,
  Clock,
  Database,
  Target,
  Trophy,
  BookOpen,
  Menu,
  X,
  Maximize,
  Minimize
} from 'lucide-react';

const Huffman = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true for default visibility
  const [isFullscreen, setIsFullscreen] = useState(false);

  const steps = [
    { id: 0, title: 'Description', icon: BookOpen, component: 'DescriptionSection' },
    { id: 1, title: 'Pseudocode', icon: Code, component: 'PseudocodeSection' },
    { id: 2, title: 'Flowchart', icon: GitBranch, component: 'FlowchartSection' },
    { id: 3, title: 'Advantages', icon: Check, component: 'AdvantagesSection' },
    { id: 4, title: 'Examples', icon: BookOpen, component: 'ExamplesSection' },
    { id: 5, title: 'Time Complexity', icon: Clock, component: 'TimeComplexitySection' },
    { id: 6, title: 'Space Complexity', icon: Database, component: 'SpaceComplexitySection' },
    { id: 7, title: 'Simulation', icon: Play, component: 'SimulationSection' },
    { id: 8, title: 'Try Out Challenges', icon: Trophy, component: 'ChallengesSection' }
  ];

  const progressPercentage = Math.round((completedSteps.length / steps.length) * 100);

  const markAsComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    // Auto-advance to next step if not at the end
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    switch (step.component) {
      case 'DescriptionSection':
        return <DescriptionSection />;
      case 'PseudocodeSection':
        return <PseudocodeSection />;
      case 'FlowchartSection':
        return <FlowchartSection />;
      case 'AdvantagesSection':
        return <AdvantagesSection />;
      case 'ExamplesSection':
        return <ExamplesSection />;
      case 'TimeComplexitySection':
        return <TimeComplexitySection />;
      case 'SpaceComplexitySection':
        return <SpaceComplexitySection />;
      case 'SimulationSection':
        return <SimulationSection onComplete={() => markAsComplete()} />;
      case 'ChallengesSection':
        return <ChallengesSection onComplete={() => markAsComplete()} />;
      default:
        return <DescriptionSection />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/15 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Watermark */}
      <div className="watermark">AlgoVerse</div>
      
      {/* Mobile-Optimized Navbar */}
      {!isFullscreen && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-primary/20">
          <div className="px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10"
                >
                  {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
                <Link to="/datastructures" className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back </span>
                </Link>
                <div className="text-sm sm:text-lg font-semibold gradient-text truncate">Huffman Coding</div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="text-xs sm:text-sm bg-primary/10 text-primary border-primary/20">{progressPercentage}%</Badge>
                <div className="hidden sm:flex items-center gap-2 glass-card rounded-full px-2 sm:px-3 py-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">John Doe</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className={`flex ${!isFullscreen ? 'pt-12 sm:pt-16' : ''} h-screen`}>
        {/* Mobile-Optimized Sidebar */}
        {sidebarOpen && !isFullscreen && (
          <>
            {/* Mobile overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={toggleSidebar}
            />
            
            <div className={`fixed left-0 top-12 sm:top-16 h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] w-72 sm:w-80 glass-card border-r border-primary/20 z-40 md:z-30 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold gradient-text">Learning Path</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:hidden hover:bg-primary/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm font-medium">
                      <span>Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = currentStep === step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          setCurrentStep(step.id);
                          // Close sidebar on mobile after selection
                          if (window.innerWidth < 768) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl text-left transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                            : isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'hover:bg-primary/10 hover:shadow-md'
                        }`}
                      >
                        <div className={`relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all ${
                          isCurrent 
                            ? 'bg-white text-primary shadow-sm' 
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">{step.title}</div>
                          <div className="text-xs opacity-70">Step {index + 1} of {steps.length}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${sidebarOpen && !isFullscreen ? 'md:ml-80' : ''} ${isFullscreen ? 'p-4 sm:p-8' : 'p-3 sm:p-6'} relative h-full`}>
          <div className={`${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto h-full'}`}>
            <div className="h-full pb-20">
              {renderStepContent()}
            </div>
          </div>
          
          {/* Mobile-Optimized Fixed Action Buttons */}
          <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 sm:gap-3">
            {/* Fullscreen Toggle Button */}
            <Button 
              onClick={toggleFullscreen}
              variant="secondary"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-primary/20 hover:bg-primary/10"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
            
            {/* Mark as Complete Button */}
            {currentStep < 7 && (
              <Button 
                onClick={markAsComplete}
                disabled={completedSteps.includes(currentStep)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl shadow-green-500/20 hover:shadow-green-500/30 h-10 sm:h-12 px-3 sm:px-4 text-xs sm:text-sm transition-all duration-300"
              >
                {completedSteps.includes(currentStep) ? (
                  <>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Completed</span>
                    <span className="sm:hidden">Done</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Mark as Complete</span>
                    <span className="sm:hidden">Complete</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Components
const DescriptionSection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full">
      <h1 className="section-title gradient-text">Huffman Coding Description</h1>
      <div className="prose max-w-none h-full overflow-y-auto">
        <p className="text-base sm:text-lg mb-4 leading-relaxed">
          Huffman coding is a lossless data compression algorithm that assigns variable-length codes to characters
          based on their frequencies of occurrence. It helps reduce file sizes by using shorter codes for frequently
          occurring characters and longer codes for less common ones.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">How It Works:</h3>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span>Analyze the frequency of characters in the input data</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span>Create a priority queue where lower-frequency characters have higher priority</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span>Construct a binary tree by repeatedly merging the two lowest-frequency nodes</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span>Assign binary codes to characters based on their position in the tree</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span>Use the generated codes to compress and decompress data efficiently</span>
          </li>
        </ul>

        <p className="leading-relaxed">
          Huffman coding is widely used in applications such as text compression, image encoding, and network transmission.
          It ensures efficient storage and transmission of data while maintaining its original quality.
        </p>
      </div>
    </CardContent>
  </Card>
);

const PseudocodeSection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Huffman Coding Pseudocode</h1>
      <Card className="bg-gray-900 text-green-400 flex-1 border border-primary/20">
        <CardContent className="p-4 sm:p-6 font-mono h-full overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm sm:text-base">
{`function Huffman(array, target):
    for i from 0 to length(array) - 1:
        if array[i] equals target:
            return i
    return -1

// Alternative implementation with while loop
function HuffmanWhile(array, target):
    i = 0
    while i < length(array):
        if array[i] equals target:
            return i
        i = i + 1
    return -1`}
          </pre>
        </CardContent>
      </Card>
    </CardContent>
  </Card>
);

const FlowchartSection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Huffman Coding Flowchart</h1>
      <div className="flex justify-center items-center flex-1">
        <div className="glass-card p-8 rounded-2xl w-full h-full flex items-center justify-center min-h-[400px] border border-primary/20">
          <div className="text-center">
            <div className="feature-icon mx-auto mb-4">
              <GitBranch className="w-8 h-8" />
            </div>
            <p className="text-center text-muted-foreground text-base sm:text-lg">
              Flowchart visualization would be implemented here using a drawing library like D3.js or a flowchart component.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdvantagesSection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Advantages of Huffman Coding</h1>
      <div className="grid md:grid-cols-2 gap-6 flex-1">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-600 flex items-center gap-2">
            <div className="feature-icon p-2">
              <Check className="w-4 h-4" />
            </div>
            Advantages
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Provides efficient lossless data compression</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Uses variable-length encoding to optimize storage</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Ensures prefix-free codes for faster decoding</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Widely used in file compression and network transmissions</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-red-600 flex items-center gap-2">
            <div className="feature-icon p-2 bg-red-100 dark:bg-red-900/20 text-red-600">
              <X className="w-4 h-4" />
            </div>
            Disadvantages
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Requires frequency analysis of data before encoding</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Can be inefficient for small, uniform datasets</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Requires additional storage for the Huffman tree</span>
            </li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);
const ExamplesSection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Huffman Coding Examples</h1>
      <div className="space-y-6 flex-1 overflow-y-auto">
        <div className="glass-card p-4 sm:p-6 rounded-xl border border-primary/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
            <div className="feature-icon p-2">
              <Target className="w-4 h-4" />
            </div>
            Example 1: Encoding a Text String
          </h3>
          <p className="mb-3 text-sm sm:text-base font-medium">Input: "hello"</p>
          <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs sm:text-sm border border-primary/10">
            <div className="text-blue-600 dark:text-blue-400">Step 1: Calculate character frequencies</div>
            <div className="text-blue-600 dark:text-blue-400">Step 2: Build a priority queue based on frequency</div>
            <div className="text-blue-600 dark:text-blue-400">Step 3: Construct Huffman tree</div>
            <div className="text-blue-600 dark:text-blue-400">Step 4: Assign binary codes to characters</div>
            <div className="text-green-600 dark:text-green-400 font-semibold">Step 5: Compress the text using generated codes</div>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-6 rounded-xl border border-primary/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
            <div className="feature-icon p-2">
              <Target className="w-4 h-4" />
            </div>
            Example 2: Decoding a Huffman Encoded Message
          </h3>
          <p className="mb-3 text-sm sm:text-base font-medium">Encoded Binary: "110101"</p>
          <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs sm:text-sm border border-primary/10">
            <div className="text-blue-600 dark:text-blue-400">Step 1: Use the Huffman tree to traverse the binary sequence</div>
            <div className="text-blue-600 dark:text-blue-400">Step 2: Match sequences to corresponding characters</div>
            <div className="text-blue-600 dark:text-blue-400">Step 3: Concatenate decoded characters into original message</div>
            <div className="text-green-600 dark:text-green-400 font-semibold">Step 4: Return the decoded string</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TimeComplexitySection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Time Complexity Analysis</h1>
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <Card className="glass-card border border-green-200 dark:border-green-800">
          <CardContent className="p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-600">Best Case</h3>
            <div className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">O(n log n)</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Building the Huffman tree using a priority queue</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-600">Average Case</h3>
            <div className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">O(n log n)</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Generating Huffman codes for unique characters</p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-200 dark:border-red-800">
          <CardContent className="p-4 sm:p-6 text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-600">Worst Case</h3>
            <div className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">O(n log n)</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Encoding and decoding large datasets</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Explanation</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Huffman coding has a time complexity of O(n log n) due to the priority queue operations needed to construct the Huffman tree.
          Once built, encoding and decoding operations are performed efficiently in O(n) time.
          The algorithm is well-suited for compressing data while ensuring minimal redundancy.
        </p>
      </div>
    </CardContent>
  </Card>
);

const SpaceComplexitySection = () => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Space Complexity Analysis</h1>
      <div className="text-center mb-6">
        <div className="text-4xl sm:text-6xl font-bold gradient-text mb-4">O(n)</div>
        <p className="text-lg sm:text-xl text-primary font-semibold">Memory usage scales with input size</p>
      </div>

      <div className="prose max-w-none flex-1 overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Why O(n)?</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 p-3 rounded-lg glass-card border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Each character in the input requires storage in the frequency table</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg glass-card border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">The Huffman tree structure takes additional memory</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg glass-card border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Encoded binary representations require storage space</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg glass-card border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span className="text-sm sm:text-base">Space complexity scales linearly with the number of unique symbols</span>
          </li>
        </ul>

        <p className="mt-4 text-sm sm:text-base leading-relaxed">
          Huffman coding requires O(n) space, as each character's frequency must be stored, a Huffman tree is built,
          and the final encoded representation is maintained for efficient compression. While this overhead increases
          with larger inputs, it ensures optimal data storage and transmission.
        </p>
      </div>
    </CardContent>
  </Card>
);

const SimulationSection = ({ onComplete }: { onComplete: () => void }) => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Interactive Simulation</h1>
      <div className="glass-card p-8 sm:p-12 rounded-2xl text-center flex-1 flex flex-col items-center justify-center min-h-[400px] border border-primary/20">
        <div className="feature-icon mx-auto mb-6">
          <Target className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-md leading-relaxed">
          Interactive simulation component would be implemented here with step-by-step visualization
        </p>
        <Button onClick={onComplete} className="cta-button">
          Complete Simulation
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ChallengesSection = ({ onComplete }: { onComplete: () => void }) => (
  <Card className="h-full algo-card">
    <CardContent className="p-4 sm:p-8 h-full flex flex-col">
      <h1 className="section-title gradient-text">Practice Challenges</h1>
      <div className="glass-card p-8 sm:p-12 rounded-2xl text-center flex-1 flex flex-col items-center justify-center min-h-[400px] border border-primary/20">
        <div className="feature-icon mx-auto mb-6">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-md leading-relaxed">
          Interactive coding challenges would be implemented here for hands-on practice
        </p>
        <Button onClick={onComplete} className="cta-button">
          Complete All Challenges
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Huffman;
