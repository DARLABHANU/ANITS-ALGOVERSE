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
  Component, // Added for generic algorithm icon
  TreePalm, // Added for tree specific icon
  SortAsc, // Added for sorting specific icon
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Make sure Link is imported

const DataStructures = () => {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const treeExamples = [
    {
      id: 'TwoThreeTrees',
      title: '2-3 Tree',
      description: 'A self-balancing search tree where every node has either two children and one data element, or three children and two data elements. All leaves are at the same depth, ensuring balance.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        '// Simplified Pseudocode for Insert in 2-3 Tree',
        'function insert(node, value):',
        '  if node is a leaf:',
        '    add value to node and split if overfilled (propagating split upwards)',
        '  else:',
        '    find appropriate child subtree',
        '    insert(child, value)',
        '    if child split:',
        '      handle split (add median to current node, propagate split if overfilled)',
      ],
      steps: [
        'Insertion starts at the appropriate leaf node.',
        'If the leaf has space, insert the element and keep nodes sorted.',
        'If the leaf is full (3 elements), split it into two 2-nodes, and promote the middle element to the parent.',
        'This promotion can cause the parent to overfill, leading to recursive splits up the tree.',
        'Deletion is more complex, involving merging or borrowing from siblings to maintain properties.'
      ]
    },
    {
      id: 'AvlTree',
      title: 'AVL Tree',
      description: 'A self-balancing binary search tree where the difference between the heights of left and right subtrees (balance factor) cannot be more than one for all nodes.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        'function insertAVL(node, value):',
        '  // Standard BST insert',
        '  if node is null:',
        '    return new Node(value)',
        '  if value < node.value:',
        '    node.left = insertAVL(node.left, value)',
        '  else:',
        '    node.right = insertAVL(node.right, value)',
        '  // Update height and balance',
        '  node.height = 1 + max(height(node.left), height(node.right))',
        '  balance = getBalance(node)',
        '  // Perform rotations if unbalanced (LL, RR, LR, RL)',
        '  if balance > 1:',
        '    if value < node.left.value: return rotateRight(node) // LL',
        '    else: node.left = rotateLeft(node.left); return rotateRight(node) // LR',
        '  if balance < -1:',
        '    if value > node.right.value: return rotateLeft(node) // RR',
        '    else: node.right = rotateRight(node.right); return rotateLeft(node) // RL',
        '  return node',
      ],
      steps: [
        'Insert the new node as you would in a standard Binary Search Tree.',
        'Update the height of the current node and its ancestors.',
        'Calculate the balance factor (height of left subtree - height of right subtree) for each node.',
        'If the balance factor becomes greater than 1 or less than -1, the tree is unbalanced.',
        'Perform appropriate rotations (Left-Left, Right-Right, Left-Right, Right-Left) to restore balance.',
        'Repeat this process recursively up the tree until balance is restored for all affected nodes.'
      ]
    }
  ];

  const sortingExamples = [
    {
      id: 'BubbleSort',
      title: 'Bubble Sort',
      description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which means the list is sorted.',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function bubbleSort(array):',
        '  n = length(array)',
        '  for i from 0 to n - 1:',
        '    swapped = false',
        '    for j from 0 to n - i - 1:',
        '      if array[j] > array[j + 1]:',
        '        swap array[j] and array[j + 1]',
        '        swapped = true',
        '    if not swapped:',
        '      break',
        '  return array'
      ],
      steps: [
        'Start at the beginning of the list.',
        'Compare the first two elements. If the first is greater than the second, swap them.',
        'Move to the next pair of elements and repeat the comparison and swap.',
        'Continue until the end of the list is reached. The largest element will be at the end.',
        'Repeat the entire process for the unsorted part of the list, reducing the size of the unsorted part by one element in each pass. Stop when no swaps are made in a pass.'
      ]
    },
    {
      id: 'SelectionSort',
      title: 'Selection Sort',
      description: 'A simple sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted sublist and moves it to the end of the sorted sublist.',
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
        'Start with the first element as the minimum.',
        'Iterate through the rest of the unsorted array to find the true minimum element.',
        'Once the minimum is found, swap it with the element at the current position (the beginning of the unsorted part).',
        'Move the "sorted boundary" one position to the right.',
        'Repeat the process for the remaining unsorted portion until the entire array is sorted.'
      ]
    },
    {
      id: 'InsertionSort',
      title: 'Insertion Sort',
      description: 'A simple sorting algorithm that builds the final sorted array (or list) one item at a time. It iterates through the input elements and builds a sorted output list.',
      timeComplexity: 'O(n²) worst, O(n) best',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function insertionSort(array):',
        '  n = length(array)',
        '  for i from 1 to n - 1:',
        '    key = array[i]',
        '    j = i - 1',
        '    while j >= 0 and array[j] > key:',
        '      array[j + 1] = array[j]',
        '      j = j - 1',
        '    array[j + 1] = key',
        '  return array'
      ],
      steps: [
        'Start from the second element (index 1), considering the first element as already sorted.',
        'Take the current element and compare it with the elements in the sorted portion (to its left).',
        'Shift elements in the sorted portion that are greater than the current element one position to the right.',
        'Insert the current element into its correct sorted position.',
        'Repeat for all elements in the array.'
      ]
    },
    {
      id: 'MergeSort',
      title: 'Merge Sort',
      description: 'A divide and conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves. It is a stable sort and well-suited for parallel processing.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        'function mergeSort(array):',
        '  n = length(array)',
        '  if n <= 1: return array',
        '  mid = floor(n / 2)',
        '  leftHalf = mergeSort(array[0 to mid-1])',
        '  rightHalf = mergeSort(array[mid to n-1])',
        '  return merge(leftHalf, rightHalf)',
        '',
        'function merge(left, right):',
        '  result = empty array',
        '  i = 0, j = 0',
        '  while i < length(left) and j < length(right):',
        '    if left[i] <= right[j]:',
        '      add left[i] to result',
        '      i = i + 1',
        '    else:',
        '      add right[j] to result',
        '      j = j + 1',
        '  add remaining elements from left to result',
        '  add remaining elements from right to result',
        '  return result',
      ],
      steps: [
        'Divide the unsorted list into n sublists, each containing one element (a list of one element is considered sorted).',
        'Repeatedly merge sublists to produce new sorted sublists until there is only one sublist remaining.',
        'The merge operation compares elements from the two sublists and places them into the new merged sublist in sorted order.'
      ]
    },
    {
      id: 'QuickSort',
      title: 'Quick Sort',
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
        '  pivot = array[high] // Last element as pivot',
        '  i = low - 1',
        '  for j from low to high - 1:',
        '    if array[j] <= pivot:',
        '      i = i + 1',
        '      swap array[i] and array[j]',
        '  swap array[i + 1] and array[high]',
        '  return i + 1',
      ],
      steps: [
        'Choose an element from the array as the pivot (e.g., the last element).',
        'Partition the array around the pivot: rearrange the array such that all elements less than the pivot come before it, and all elements greater come after it.',
        'Recursively apply QuickSort to the sub-array of elements smaller than the pivot and the sub-array of elements greater than the pivot.',
        'The base case for the recursion is when a sub-array has zero or one element, as they are already sorted.'
      ]
    },
    {
      id: 'HeapSort',
      title: 'Heap Sort',
      description: 'A comparison-based sorting algorithm that uses a binary heap data structure. It is an in-place algorithm but is not a stable sort. It leverages the heap property to efficiently find the largest (or smallest) element.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function heapSort(array):',
        '  n = length(array)',
        '  // Build max heap (rearrange array)',
        '  for i from n/2 - 1 down to 0:',
        '    heapify(array, n, i)',
        '  // Extract elements one by one from heap',
        '  for i from n - 1 down to 0:',
        '    swap array[0] and array[i] // Move current root to end',
        '    heapify(array, i, 0) // Call max heapify on the reduced heap',
        '',
        'function heapify(array, n, i):',
        '  largest = i // Initialize largest as root',
        '  left = 2 * i + 1',
        '  right = 2 * i + 2',
        '  // If left child is larger than root',
        '  if left < n and array[left] > array[largest]:',
        '    largest = left',
        '  // If right child is larger than largest so far',
        '  if right < n and array[right] > array[largest]:',
        '    largest = right',
        '  // If largest is not root',
        '  if largest != i:',
        '    swap array[i] and array[largest]',
        '    heapify(array, n, largest) // Recursively heapify the affected sub-tree',
      ],
      steps: [
        'Build a max-heap from the input data. This rearranges the array into a heap structure.',
        'The largest item is now at the root of the heap (index 0).',
        'Swap the root element with the last element of the heap. This moves the largest element to its correct sorted position.',
        'Reduce the heap size by 1 (effectively removing the last element from the heap consideration).',
        'Heapify the new root of the tree to restore the heap property (find the new largest element and move it to the root).',
        'Repeat steps 3-5 until the heap size is 1, at which point the entire array is sorted.'
      ]
    }
  ];

  const searchingExamples = [
    {
      id: 'BinarySearch',
      title: 'Binary Search',
      description: 'An efficient algorithm for finding an item from a *sorted* list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you narrow down the possible locations to just one.',
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
        'Ensure the array is sorted.',
        'Set `low` to the first index and `high` to the last index of the array.',
        'While `low` is less than or equal to `high`:',
        '  Calculate the middle index: `mid = (low + high) / 2`.',
        '  If the element at `array[mid]` is the target, return `mid`.',
        '  If the element at `array[mid]` is less than the target, discard the left half by setting `low = mid + 1`.',
        '  If the element at `array[mid]` is greater than the target, discard the right half by setting `high = mid - 1`.',
        'If the loop finishes and the target is not found, return -1.'
      ]
    },
    {
      id: 'LinearSearch',
      title: 'Linear Search',
      description: 'A simple searching algorithm that sequentially checks each element in the list until a match is found or the whole list has been searched.',
      timeComplexity: 'O(n) worst, O(1) best',
      spaceComplexity: 'O(1)',
      pseudoCode: [
        'function linearSearch(array, target):',
        '  n = length(array)',
        '  for i from 0 to n - 1:',
        '    if array[i] equals target:',
        '      return i',
        '  return -1 // Target not found'
      ],
      steps: [
        'Start from the first element of the array (index 0).',
        'Compare the current element with the target value.',
        'If the current element matches the target, return its index.',
        'If not, move to the next element.',
        'Repeat steps 2-4 until the target is found or the end of the array is reached.',
        'If the end of the array is reached and the target is not found, return -1.'
      ]
    }
    ,
    {
      id: 'SkipList',
      title: 'Skip List',
      description: 'A probabilistic data structure that allows O(log n) average time complexity for search, insertion, and deletion operations. It consists of multiple layers of sorted linked lists, where each successive list links fewer elements than the previous one, creating "express lanes".',
      timeComplexity: 'O(log n) average',
      spaceComplexity: 'O(n) average',
      pseudoCode: [
        '// Simplified Pseudocode for Search in Skip List',
        'function search(head, target):',
        '  current = head',
        '  for level from max_level down to 0:',
        '    while current.next[level] is not null and current.next[level].value < target:',
        '      current = current.next[level]',
        '  if current.next[0] is not null and current.next[0].value == target:',
        '    return true',
        '  return false',
      ],
      steps: [
        'Start at the head of the highest level list.',
        'Traverse forward in the current level until you find a node whose value is greater than or equal to the target, or you reach the end of the list.',
        'If the next node is greater than the target, drop down one level.',
        'Repeat steps 2 and 3 until you reach the lowest level (level 0).',
        'At level 0, traverse forward until you find the target or pass it. If found, the search is successful.'
      ]
    }
  ];

  const algorithmExamples = [
    {
      id: 'Prims',
      title: 'Prim\'s Algorithm',
      description: 'A greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph. It starts from an arbitrary vertex and grows the MST by adding the nearest vertex not yet in the MST. It is suitable for dense graphs.',
      timeComplexity: 'O(E log V) with binary heap, O(E + V log V) with Fibonacci heap',
      spaceComplexity: 'O(V + E)',
      pseudoCode: [
        'function prim(graph):',
        '  mst = empty set of edges',
        '  min_heap = new min-priority queue (stores edges by weight)',
        '  visited = new set',
        '  start_vertex = any vertex in graph',
        '  add start_vertex to visited',
        '  add all edges from start_vertex to min_heap',
        '  while min_heap is not empty and count(mst_edges) < V - 1:',
        '    edge = extract_min(min_heap) // (weight, u, v)',
        '    if v is not in visited:',
        '      add edge to mst',
        '      add v to visited',
        '      for each edge (v, w) from v:',
        '        if w is not in visited:',
        '          add (weight, v, w) to min_heap',
        '  return mst',
      ],
      steps: [
        'Initialize an empty Minimum Spanning Tree (MST) and a set of visited vertices.',
        'Choose an arbitrary starting vertex and add it to the visited set.',
        'Add all edges connected to the starting vertex to a min-priority queue, ordered by edge weight.',
        'While the MST does not include all vertices and the priority queue is not empty:',
        '  Extract the edge with the minimum weight from the priority queue.',
        '  If the destination vertex of this edge has not been visited:',
        '    Add the edge to the MST.',
        '    Add the destination vertex to the visited set.',
        '    Add all unvisited edges connected to this new vertex to the priority queue.',
        'The algorithm terminates when all vertices are included in the MST or the priority queue is empty.'
      ]
    },
    {
      id: 'Kruskals',
      title: 'Kruskal\'s Algorithm',
      description: 'A greedy algorithm that finds a minimum spanning tree (MST) for a connected weighted undirected graph. It sorts all edges in non-decreasing order of their weights and adds the smallest edges that do not form a cycle. It is suitable for sparse graphs.',
      timeComplexity: 'O(E log E) or O(E log V) (due to sorting edges)',
      spaceComplexity: 'O(V + E)',
      pseudoCode: [
        'function kruskal(graph):',
        '  mst = empty set of edges',
        '  edges = all edges in graph, sorted by weight ascending',
        '  disjoint_set = new data structure (one set per vertex)',
        '  for each edge (u, v, weight) in sorted edges:',
        '    if find(u) != find(v): // If adding edge doesn\'t form a cycle',
        '      add (u, v) to mst',
        '      union(u, v)',
        '  return mst',
      ],
      steps: [
        'Create a list of all edges in the graph and sort them in non-decreasing order of their weights.',
        'Initialize a disjoint set data structure where each vertex is in its own set (representing its own component).',
        'Iterate through the sorted edges:',
        '  For each edge (u, v) with weight w:',
        '    If vertices u and v are in different sets (i.e., adding this edge does not create a cycle with previously added edges):',
        '      Add the edge (u, v) to the MST.',
        '      Merge the sets containing u and v (union operation).',
        'The algorithm terminates when the MST contains V-1 edges (where V is the number of vertices) or all edges have been processed.'
      ]
    },
    {
      id: 'AStar',
      title: 'A* Search Algorithm',
      description: 'A pathfinding algorithm that finds the shortest path between a starting and a goal node in a graph, using a heuristic function to estimate the cost from the current node to the goal. It combines Dijkstra\'s algorithm with greedy best-first search.',
      timeComplexity: 'Exponential in worst case (O(b^d)), polynomial if heuristic is accurate',
      spaceComplexity: 'Exponential in worst case (O(b^d))',
      pseudoCode: [
        'function aStarSearch(start, goal, h_cost):',
        '  open_set = new priority queue (stores nodes by f_cost)',
        '  came_from = empty map',
        '  g_score = map with default infinity (cost from start to current)',
        '  f_score = map with default infinity (g_score + h_cost)',
        '  g_score[start] = 0',
        '  f_score[start] = h_cost(start, goal)',
        '  add start to open_set',
        '  while open_set is not empty:',
        '    current = node in open_set with lowest f_score',
        '    if current == goal: return reconstructPath(came_from, current)',
        '    remove current from open_set',
        '    for each neighbor of current:',
        '      tentative_g_score = g_score[current] + dist(current, neighbor)',
        '      if tentative_g_score < g_score[neighbor]:',
        '        came_from[neighbor] = current',
        '        g_score[neighbor] = tentative_g_score',
        '        f_score[neighbor] = tentative_g_score + h_cost(neighbor, goal)',
        '        if neighbor not in open_set: add neighbor to open_set',
        '  return failure',
      ],
      steps: [
        'Initialize an open list (priority queue) and a closed list.',
        'Add the start node to the open list with its f-cost (g-cost + h-cost), where g-cost is 0 and h-cost is the heuristic estimate to the goal.',
        'While the open list is not empty:',
        '  Take the node with the lowest f-cost from the open list and make it the current node.',
        '  Move the current node to the closed list.',
        '  If the current node is the goal node, reconstruct the path and terminate.',
        '  For each neighbor of the current node:',
        '    If the neighbor is in the closed list, skip it.',
        '    Calculate the tentative g-cost from the start to this neighbor.',
        '    If the tentative g-cost is better than the neighbor\'s current g-cost (or if not yet evaluated):',
        '      Update the neighbor\'s g-cost, set its parent to the current node, and calculate its f-cost.',
        '      If the neighbor is not in the open list, add it to the open list.'
      ]
    },
    {
      id: 'Jhonson',
      title: 'Johnson Trotter Algorithm',
      description: 'An algorithm for generating all permutations of a set of elements by only swapping two adjacent elements at each step. It is often visualized using Steinhaus-Johnson-Trotter algorithm with adjacent transpositions, providing a simple way to generate permutations lexicographically.',
      timeComplexity: 'O(n! * n)',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        'function johnsonTrotter(n):',
        '  p = [1, 2, ..., n] // Initial permutation',
        '  direction = [-1, -1, ..., -1] // -1 for left, 1 for right',
        '  print p',
        '  for k from 1 to n! - 1:',
        '    mobile_element = find_largest_mobile_element(p, direction)',
        '    if no mobile element: break // Algorithm terminates',
        '    index_mobile = find_index_of(mobile_element)',
        '    neighbor_index = index_mobile + direction[index_mobile]',
        '    swap p[index_mobile] and p[neighbor_index]',
        '    swap direction[index_mobile] and direction[neighbor_index]',
        '    reverse_directions_of_larger_elements(p, direction, mobile_element)',
        '    print p',
        '',
        'function find_largest_mobile_element(p, direction):',
        '  // A mobile element is greater than its neighbor in the direction of its arrow',
        '  // Find the largest such element',
        '  // ... implementation details ...',
      ],
      steps: [
        'Initialize the first permutation as [1, 2, ..., n] and set the initial direction of all elements to left (e.g., -1).',
        'Repeatedly find the largest "mobile element". A mobile element is larger than its adjacent neighbor in the direction it is pointing.',
        'Swap the largest mobile element with its adjacent neighbor in the direction it is pointing.',
        'Reverse the direction of all elements larger than the element that was just moved.',
        'Repeat steps 2-4 until there are no more mobile elements (meaning all permutations have been generated).'
      ]
    },
    {
      id: 'Huffman',
      title: 'Huffman Coding',
      description: 'A lossless data compression algorithm. It assigns variable-length codes to input characters, with shorter codes assigned to more frequent characters and longer codes to less frequent ones, to minimize the total length of the encoded message. It builds a binary tree based on character frequencies.',
      timeComplexity: 'O(n log n) where n is the number of unique characters',
      spaceComplexity: 'O(n)',
      pseudoCode: [
        'function huffmanCoding(characters, frequencies):',
        '  priority_queue = new min-priority queue',
        '  for each char in characters:',
        '    create a leaf node (char, frequency) and add to priority_queue',
        '  while size(priority_queue) > 1:',
        '    left = extract_min(priority_queue)',
        '    right = extract_min(priority_queue)',
        '    new_node = create internal node (left_freq + right_freq)',
        '    new_node.left = left',
        '    new_node.right = right',
        '    add new_node to priority_queue',
        '  return root of huffman tree (last node in priority_queue)',
        '',
        'function generateCodes(node, code_string, codes_map):',
        '  if node is leaf:',
        '    codes_map[node.character] = code_string',
        '  else:',
        '    generateCodes(node.left, code_string + "0", codes_map)',
        '    generateCodes(node.right, code_string + "1", codes_map)',
      ],
      steps: [
        'Count the frequency of each character in the input data.',
        'Create a leaf node for each character and add it to a min-priority queue, ordered by frequency.',
        'While there is more than one node in the priority queue:',
        '  Extract the two nodes with the minimum frequencies from the queue.',
        '  Create a new internal node whose frequency is the sum of the frequencies of the two extracted nodes. Make the extracted nodes its left and right children.',
        '  Add this new internal node back to the priority queue.',
        'The final node remaining in the priority queue is the root of the Huffman tree.',
        'Traverse the Huffman tree to generate codes: assign "0" for a left branch and "1" for a right branch. The path from the root to each leaf forms the Huffman code for that character.'
      ]
    }
  ];

  // Helper function to render example cards
  const renderExampleCards = (examplesArray: typeof treeExamples) => (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <span>Comprehensive Coverage</span>
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
                    **Algorithms** are a set of well-defined instructions to solve a particular problem. They are the step-by-step procedures to transform input into desired output. Understanding both is crucial for efficient problem-solving in computer science.
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
                        <span className="text-sm text-muted-foreground">e.g., Array element access</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[10%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(log n) - Logarithmic</span>
                        <span className="text-sm text-muted-foreground">e.g., Binary Search, AVL Tree operations</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full w-[30%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(n) - Linear</span>
                        <span className="text-sm text-muted-foreground">e.g., Linear Search, traversing a list</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full w-[50%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(n log n) - Log-linear</span>
                        <span className="text-sm text-muted-foreground">e.g., Merge Sort, Heap Sort</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full w-[70%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O(n²) - Quadratic</span>
                        <span className="text-sm text-muted-foreground">e.g., Bubble Sort, Selection Sort</span>
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
          <h2 className="section-title gradient-text mb-8 flex items-center gap-2">
            <TreePalm className="w-8 h-8" />
            Trees
          </h2>
          {renderExampleCards(treeExamples)}
          {selectedExample && treeExamples.some(ex => ex.id === selectedExample) && renderExpandedView(treeExamples)}
        </section>

        {/* Sortings Section */}
        <section className="mb-16">
          <h2 className="section-title gradient-text mb-8 flex items-center gap-2">
            <SortAsc className="w-8 h-8" />
            Sortings
          </h2>
          {renderExampleCards(sortingExamples)}
          {selectedExample && sortingExamples.some(ex => ex.id === selectedExample) && renderExpandedView(sortingExamples)}
        </section>

        {/* Searchings Section */}
        <section className="mb-16">
          <h2 className="section-title gradient-text mb-8 flex items-center gap-2">
            <Search className="w-8 h-8" />
            Searchings
          </h2>
          {renderExampleCards(searchingExamples)}
          {selectedExample && searchingExamples.some(ex => ex.id === selectedExample) && renderExpandedView(searchingExamples)}
        </section>

        {/* Algorithms Section */}
        <section className="mb-16">
          <h2 className="section-title gradient-text mb-8 flex items-center gap-2">
            <Component className="w-8 h-8" />
            Algorithms
          </h2>
          {renderExampleCards(algorithmExamples)}
          {selectedExample && algorithmExamples.some(ex => ex.id === selectedExample) && renderExpandedView(algorithmExamples)}
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