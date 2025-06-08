
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
