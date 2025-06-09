import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Search,
  Clock,
  Code,
  ArrowRight,
  Check,
  ChevronLeft,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Make sure Link is imported

const DataStructures = () => {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const treeExamples = [
    {
      id: 'BinarySearchTree',
      title: 'Binary Search Tree',
      description: 'A tree data structure where each node has at most two children, and for each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater.',
      timeComplexity: 'O(log n) avg, O(n) worst',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        'function insert(node, value):',
        '  if node is null:',
        '    return new Node(value)',
        '  if value < node.value:',
        '    node.left = insert(node.left, value)',
        '  else if value > node.value:',
        '    node.right = insert(node.right, value)',
        '  return node',
      ],
      steps: [
        'To insert, start at the root.',
        'If the new value is less than the current node, go left.',
        'If the new value is greater, go right.',
        'If the current node is null, insert the new value here.',
        'Repeat until inserted.',
      ]
    },
    {
      id: 'AVLTree',
      title: 'AVL Tree',
      description: 'A self-balancing binary search tree where the difference between the heights of left and right subtrees cannot be more than one for all nodes.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        'function insertAVL(node, value):',
        '  // Standard BST insert',
        '  // Update height of current node',
        '  // Get balance factor',
        '  // Perform rotations if unbalanced',
        '  return balancedNode',
      ],
      steps: [
        'Insert as a normal BST node.',
        'Update the height of the current node and its ancestors.',
        'Calculate the balance factor for each node (height of left subtree - height of right subtree).',
        'If balance factor is > 1 or < -1, perform rotations (LL, RR, LR, RL) to rebalance the tree.',
        'Repeat up the tree until balanced.',
      ]
    }
  ];

  const sortingExamples = [
    {
      id: 'HeapSort',
      title: 'HeapSort',
      description: 'A comparison-based sorting algorithm that uses a binary heap data structure. It is an in-place algorithm but is not a stable sort.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function heapSort(array):',
        '  n = length(array)',
        '  // Build max heap',
        '  for i from n/2 - 1 down to 0:',
        '    heapify(array, n, i)',
        '  // Extract elements one by one',
        '  for i from n - 1 down to 0:',
        '    swap array[0] and array[i]',
        '    heapify(array, i, 0)',
        '',
        'function heapify(array, n, i):',
        '  largest = i',
        '  left = 2 * i + 1',
        '  right = 2 * i + 2',
        '  if left < n and array[left] > array[largest]:',
        '    largest = left',
        '  if right < n and array[right] > array[largest]:',
        '    largest = right',
        '  if largest != i:',
        '    swap array[i] and array[largest]',
        '    heapify(array, n, largest)',
      ],
      steps: [
        'Build a max-heap from the input data.',
        'The largest item is at the root of the heap.',
        'Swap the root with the last element of the heap and reduce the heap size by 1.',
        'Heapify the root of the tree to restore the heap property.',
        'Repeat steps 2-4 until the heap size is 1.',
      ]
    },
    {
      id: 'SelectionSort',
      title: 'Selection Sort',
      description: 'A sorting algorithm that finds the minimum element from the unsorted part and puts it at the beginning.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function selectionSort(array):',
        '  n = length(array)',
        '  for i from 0 to n - 1:',
        '    minIndex = i',
        '    for j from i + 1 to n:',
        '      if array[j] < array[minIndex]:',
        '        minIndex = j',
        '    swap array[i] and array[minIndex]',
        '  return array'
      ],
      steps: [
        'Find the minimum element in the unsorted array.',
        'Swap it with the element at the beginning of the unsorted segment.',
        'Move the boundary of the unsorted segment one element to the right.',
        'Repeat until the array is sorted.',
        'After each iteration, the left portion of the array becomes sorted.'
      ]
    },
    {
      id: 'QuickSort',
      title: 'QuickSort',
      description: 'An efficient, in-place, comparison-based sorting algorithm. It is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the picked pivot.',
      timeComplexity: 'O(n log n) avg, O(n²) worst',
      spaceComplexity: 'O(log n) avg, O(n) worst',
      pseudoCode: [
        'function quickSort(array, low, high):',
        '  if low < high:',
        '    pivotIndex = partition(array, low, high)',
        '    quickSort(array, low, pivotIndex - 1)',
        '    quickSort(array, pivotIndex + 1, high)',
        '',
        'function partition(array, low, high):',
        '  pivot = array[high]',
        '  i = low - 1',
        '  for j from low to high - 1:',
        '    if array[j] <= pivot:',
        '      i = i + 1',
        '      swap array[i] and array[j]',
        '  swap array[i + 1] and array[high]',
        '  return i + 1',
      ],
      steps: [
        'Choose a pivot element from the array.',
        'Partition the array into two sub-arrays: elements smaller than the pivot and elements greater than the pivot.',
        'Recursively apply QuickSort to the two sub-arrays.',
        'Combine the sorted sub-arrays and the pivot to get the fully sorted array.'
      ]
    }
  ];

  const searchingExamples = [
    {
      id: 'LinearSearch',
      title: 'Linear Search',
      description: 'A straightforward search algorithm that checks each element in a collection until finding the target.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function linearSearch(array, target):',
        '  for i from 0 to length(array) - 1:',
        '    if array[i] equals target:',
        '      return i',
        '  return -1'
      ],
      steps: [
        'Start from the first element and compare it with the target value.',
        'If the element matches the target, return the index.',
        'If not, move to the next element.',
        'Repeat until the element is found or the end of array is reached.',
        'If the target is not found, return -1.'
      ]
    },
    {
      id: 'BinarySearch',
      title: 'Binary Search',
      description: 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you narrow down the possible locations to just one.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function binarySearch(array, target):',
        '  low = 0',
        '  high = length(array) - 1',
        '  while low <= high:',
        '    mid = floor((low + high) / 2)',
        '    if array[mid] equals target:',
        '      return mid',
        '    else if array[mid] < target:',
        '      low = mid + 1',
        '    else:',
        '      high = mid - 1',
        '  return -1',
      ],
      steps: [
        'Start with the middle element of the sorted array.',
        'If the target value is equal to the middle element, return its index.',
        'If the target value is less than the middle element, search in the left half of the array.',
        'If the target value is greater than the middle element, search in the right half of the array.',
        'Repeat steps 1-4 until the target is found or the search range is empty.'
      ]
    }
  ];

  // Helper function to render example cards
  const renderExampleCards = (examplesArray: typeof treeExamples) => (
    <div className="grid md:grid-cols-3 gap-6">
      {examplesArray.map((example) => (
        <Card
          key={example.id}
          className={`cursor-pointer transition-all ${
            selectedExample === example.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
          }`}
          onClick={() => setSelectedExample(example.id === selectedExample ? null : example.id)}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{example.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{example.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {example.timeComplexity} time
                </span>
              </div>

              <Link to={`/${example.id}`}>
                <Button size="sm" variant="outline">
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Explore
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Helper function to render the expanded view
  const renderExpandedView = (examplesArray: typeof treeExamples) => {
    const example = examplesArray.find(ex => ex.id === selectedExample);
    if (!example) return null;

    return (
      <Card className="mt-8 animate-fade-in">
        <CardContent className="p-8">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{example.title}</h3>
                <p className="text-muted-foreground">{example.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm mb-1">
                  Time Complexity: <span className="font-mono">{example.timeComplexity}</span>
                </div>
                <div className="text-sm">
                  Space Complexity: <span className="font-mono">{example.spaceComplexity}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="code">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="code">Pseudocode</TabsTrigger>
                <TabsTrigger value="steps">How It Works</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-0">
                <Card>
                  <CardContent className="p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg">
                    <pre>
                      {example.pseudoCode.map((line, i) => (
                        <div key={i} className="py-0.5">
                          {line}
                        </div>
                      ))}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="mt-0">
                <Card>
                  <CardContent className="p-4">
                    <ol className="space-y-2">
                      {example.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                            {i + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button className="cta-button">
                Try Interactive Demo
                <Code className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/30 to-yellow-50/30 dark:from-background dark:via-orange-950/30 dark:to-yellow-950/30">
      {/* Watermark */}
      <div className="watermark">DSA</div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home Page</span>
        </Link>

        {/* Hero Section */}
        <section className="relative pt-8 pb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Data Structures & Algorithms</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Master <span className="gradient-text">Data Structures & Algorithms</span> Approaches
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
            Solve problems using different data structures and their approaches. Explore real-time problems with interactive visualizations and simulations.
          </p>

          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm">
              <Check className="w-4 h-4" />
              <span>Beginner Friendly</span>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What are Data Structures & Algorithms?</h2>
                  <p className="text-muted-foreground mb-4">
                    **Data structures** are simply ways to organize and store data in a computer so it can be used efficiently. Think of them as specialized containers designed for different types of information. By choosing the right structure, we can perform operations like searching or adding data much faster.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    **Algorithms** are a set of well-defined instructions to solve a particular problem. They are the step-by-step procedures to transform input into desired output.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Organized Storage: They arrange data systematically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Efficient Operations: They speed up tasks like searching or adding data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Memory Use: They dictate how data occupies space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Abstract View: They simplify how we interact with data</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Understanding Time & Space Complexity</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(1) - Constant</span>
                        <span className="text-sm text-muted-foreground">Example: Accessing an array element by index</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[10%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(log n) - Logarithmic</span>
                        <span className="text-sm text-muted-foreground">Example: Binary Search</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full w-[30%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(n) - Linear</span>
                        <span className="text-sm text-muted-foreground">Example: Linear Search</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full w-[50%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(n log n) - Log-linear</span>
                        <span className="text-sm text-muted-foreground">Example: Merge Sort, Heap Sort</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full w-[70%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(n²) - Quadratic</span>
                        <span className="text-sm text-muted-foreground">Example: Bubble Sort, Selection Sort</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full w-[90%]"></div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Key Concepts:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• **Time Complexity**: How the runtime of an algorithm grows with the input size.</li>
                        <li>• **Space Complexity**: How much additional memory an algorithm needs with the input size.</li>
                        <li>• **Big O Notation**: A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. It characterizes functions according to their growth rates.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Trees Section */}
        <section className="mb-16">
          <h2 className="section-title gradient-text mb-8">Trees</h2>
          {renderExampleCards(treeExamples)}
          {selectedExample && treeExamples.some(ex => ex.id === selectedExample) && renderExpandedView(treeExamples)}
        </section>

        {/* Sortings Section */}
        <section className="mb-16">
          <h2 className="section-title gradient-text mb-8">Sortings</h2>
          {renderExampleCards(sortingExamples)}
          {selectedExample && sortingExamples.some(ex => ex.id === selectedExample) && renderExpandedView(sortingExamples)}
        </section>

        {/* Searchings Section */}
        <section className="mb-16">
          <h2 className="section-title gradient-text mb-8">Searchings</h2>
          {renderExampleCards(searchingExamples)}
          {selectedExample && searchingExamples.some(ex => ex.id === selectedExample) && renderExpandedView(searchingExamples)}
        </section>

        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to test your knowledge?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Dive into coding challenges and apply what you've learned!
          </p>
          <Link to="/algocode">
            <Button className="cta-button text-lg px-8 py-3">
              Try Out Challenges
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>






        
      </div>
    </div>
  );
};

export default DataStructures;