
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUpPage from "./components/SignUpPage";
import DataStructures from "./components/DataStructures";
import Algorithms from "./components/Algorithms";
import LinearSearch from "./datastructures/LinearSearch";
import AlgoCode from "./components/AlgoCode";
import Contact from "./components/Contact";
import About from "./components/About";
import HeapSort from "./datastructures/HeapSort/HeapSort";
import TwoThreeTrees from "./datastructures/twothreetrees/TwoThree";
import AStar from "./datastructures/Astar/AStar";
import AvlTree from "./datastructures/Avltrees/Avl";
import BinarySearch from "./datastructures/Binarysearch/BinarySearch";
import BubbleSort from "./datastructures/bubblesort/BubbleSort";
import Huffman from "./datastructures/Huffmancoding/Huffman";
import InsertionSort from "./datastructures/insertionsort/Insertion";
import Jhonson from "./datastructures/johnsontrotter/Jhonson";
import Kruskals from "./datastructures/Kruskals/Kruskals";
import Prims from "./datastructures/Prims/Prims";
import QuickSort from "./datastructures/quicksort/QuickSort";
import SelectionSort from "./datastructures/selectionsort/SelectionSort";
import SkipList from "./datastructures/SkipList/SkipList";
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/datastructures" element={<DataStructures />} />
            <Route path="/Algorithms" element={<Algorithms />} />
            <Route path="/LinearSearch" element={<LinearSearch />} />
            <Route path="/AlgoCode" element={<AlgoCode />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/About" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/HeapSort" element={<HeapSort/>} />
            <Route path="/TwoThreeTrees" element={<TwoThreeTrees/>} />
            <Route path="/AStar" element={<AStar/>} />
            <Route path="/AvlTree" element={<AvlTree/>} />
            <Route path="/BinarySearch" element={<BinarySearch/>} />
            <Route path="/BubbleSort" element={<BubbleSort/>} />
            <Route path="/Huffman" element={<Huffman/>} />
            <Route path="/InsertionSort" element={<InsertionSort/>} />
            <Route path="/Jhonson" element={<Jhonson/>} />
            <Route path="/Kruskals" element={<Kruskals/>} />
            <Route path="/Prims" element={<Prims/>} />
            <Route path="/QuickSort" element={<QuickSort/>} />
            <Route path="/SelectionSort" element={<SelectionSort/>} />
            <Route path="/SkipList" element={<SkipList/>} />
            
            
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
