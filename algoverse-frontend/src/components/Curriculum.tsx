import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  TreePalm,
  SortAsc,
  Search,
  Component,
  Clock,
} from 'lucide-react'; // Re-using icons from DataStructures.tsx

// Define the structure for each curriculum item
interface CurriculumItem {
  id: string;
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: 'Trees' | 'Sortings' | 'Searchings' | 'Algorithms';
}

const curriculumConcepts: CurriculumItem[] = [
  // Trees
  {
    id: '2-3Tree',
    title: '2-3 Trees',
    description: 'A self-balancing search tree where every node has either two or three children, ensuring balance.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    category: 'Trees',
  },
  {
    id: 'AVLTree',
    title: 'AVL Trees',
    description: 'A self-balancing binary search tree where the difference between heights of left and right subtrees is at most one.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    category: 'Trees',
  },
  // Sortings
  {
    id: 'BubbleSort',
    title: 'Bubble Sort',
    description: 'Compares adjacent elements and swaps them if they are in the wrong order, repeatedly.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'Sortings',
  },
  {
    id: 'SelectionSort',
    title: 'Selection Sort',
    description: 'Finds the minimum element from the unsorted part and puts it at the beginning.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'Sortings',
  },
  {
    id: 'InsertionSort',
    title: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time by inserting elements into their correct position.',
    timeComplexity: 'O(n²) worst, O(n) best',
    spaceComplexity: 'O(1)',
    category: 'Sortings',
  },
  {
    id: 'MergeSort',
    title: 'Merge Sort',
    description: 'A divide and conquer algorithm that divides, recursively sorts, and then merges halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    category: 'Sortings',
  },
  {
    id: 'QuickSort',
    title: 'Quick Sort',
    description: 'Picks a pivot and partitions the array around it, then recursively sorts the partitions.',
    timeComplexity: 'O(n log n) avg, O(n²) worst',
    spaceComplexity: 'O(log n) avg, O(n) worst',
    category: 'Sortings',
  },
  {
    id: 'HeapSort',
    title: 'Heap Sort',
    description: 'Uses a binary heap data structure to efficiently sort elements in-place.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    category: 'Sortings',
  },
  // Searchings
  {
    id: 'LinearSearch',
    title: 'Linear Search',
    description: 'Sequentially checks each element in the list until a match is found or the list ends.',
    timeComplexity: 'O(n) worst, O(1) best',
    spaceComplexity: 'O(1)',
    category: 'Searchings',
  },
  {
    id: 'BinarySearch',
    title: 'Binary Search',
    description: 'Efficiently finds an item in a *sorted* list by repeatedly halving the search interval.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    category: 'Searchings',
  },
  {
    id: 'SkipList',
    title: 'Skip List',
    description: 'A probabilistic data structure allowing O(log n) average time for search, insertion, and deletion.',
    timeComplexity: 'O(log n) average',
    spaceComplexity: 'O(n) average',
    category: 'Searchings',
  },
  // Algorithms
  {
    id: 'PrimsAlgorithm',
    title: 'Prim\'s Algorithm',
    description: 'A greedy algorithm to find a Minimum Spanning Tree (MST) for a weighted undirected graph.',
    timeComplexity: 'O(E log V) or O(E + V log V)',
    spaceComplexity: 'O(V + E)',
    category: 'Algorithms',
  },
  {
    id: 'KruskalsAlgorithm',
    title: 'Kruskal\'s Algorithm',
    description: 'A greedy algorithm to find an MST by sorting edges and adding the smallest ones that do not form a cycle.',
    timeComplexity: 'O(E log E) or O(E log V)',
    spaceComplexity: 'O(V + E)',
    category: 'Algorithms',
  },
  {
    id: 'AStarSearch',
    title: 'A* Search Algorithm',
    description: 'A pathfinding algorithm that uses a heuristic to find the shortest path between two nodes.',
    timeComplexity: 'Exponential in worst case (O(b^d))',
    spaceComplexity: 'Exponential in worst case (O(b^d))',
    category: 'Algorithms',
  },
  {
    id: 'JohnsonTrotter',
    title: 'Johnson Trotter Algorithm',
    description: 'Generates all permutations of a set by only swapping adjacent elements.',
    timeComplexity: 'O(n! * n)',
    spaceComplexity: 'O(n)',
    category: 'Algorithms',
  },
  {
    id: 'HuffmanCoding',
    title: 'Huffman Coding',
    description: 'A lossless data compression algorithm assigning variable-length codes based on character frequency.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    category: 'Algorithms',
  },
];

const Curriculum: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Trees':
        return <TreePalm className="w-6 h-6 text-primary" />;
      case 'Sortings':
        return <SortAsc className="w-6 h-6 text-primary" />;
      case 'Searchings':
        return <Search className="w-6 h-6 text-primary" />;
      case 'Algorithms':
        return <Component className="w-6 h-6 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/30 to-yellow-50/30 dark:from-background dark:via-orange-950/30 dark:to-yellow-950/30">
      {/* Watermark */}
      <div className="watermark">DSA</div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <section className="relative pt-8 pb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Comprehensive Curriculum</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore a structured path to mastering essential Data Structures and Algorithms. Each concept is designed to build foundational knowledge for complex problem-solving.
          </p>
        </section>

        {/* Curriculum Categories */}
        {['Trees', 'Sortings', 'Searchings', 'Algorithms'].map((category) => (
          <section key={category} className="mb-16">
            <h2 className="section-title gradient-text mb-8 flex items-center justify-center gap-3 text-4xl font-bold">
              {getCategoryIcon(category)}
              {category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {curriculumConcepts
                .filter((concept) => concept.category === category)
                .map((concept) => (
                  <Card key={concept.id} className="hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {concept.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{concept.timeComplexity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">Space:</span>
                          <span>{concept.spaceComplexity}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        {/* Assuming a route like /dsa-detail/:id exists for full concept info */}
                        <Link to={`/dsa-detail/${concept.id}`}>
                            <Button size="sm" variant="outline" className="w-full">
                                Learn More
                            </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        ))}

        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to put your knowledge to the test?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start solving problems and apply what you've learned in practice!
          </p>
          <Link to="/algocode"> {/* Assuming this is your challenges page route */}
            <Button className="cta-button text-lg px-8 py-3">
              Start Challenges
              
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Curriculum;