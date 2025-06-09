import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, DatabaseIcon } from "lucide-react"; // Removed Brain icon as it's no longer needed
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // cn is likely used for class utility, keeping it in case it's used elsewhere

const ExploreSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent"></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-4">
            Learning Paths
          </span>
          <h2 className="section-title mx-auto text-center after:mx-auto">Explore Your Learning Journey</h2>
          <p className="text-foreground/70">
            Choose the path that aligns with your goals and experience level
          </p>
        </motion.div>
        
        {/* Adjusted grid to display only one card, centered */}
        <div className="grid md:grid-cols-1 place-items-center gap-8 lg:gap-16 max-w-5xl mx-auto">
          {/* Data Structures Card */}
          <motion.div 
            className="glass-card rounded-2xl p-8 shadow-xl relative overflow-hidden border border-primary/20 w-full md:max-w-md" /* Added max-w-md for better centering on larger screens */
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl inline-flex items-center justify-center mb-6">
              <DatabaseIcon className="h-6 w-6 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">DSA & DAA</h3>
            <p className="text-foreground/70 mb-6">
              Master the fundamental building blocks that power efficient software. Learn how to organize and manipulate data for optimal performance.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <div>
                  <h4 className="font-medium">Sortings</h4>
                  <p className="text-sm text-foreground/60"> sort the elements different sortings</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <div>
                  <h4 className="font-medium">Searchings</h4>
                  <p className="text-sm text-foreground/60">Searching different elemets in a given data elements</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <div>
                  <h4 className="font-medium">Time & Space Complexity</h4>
                  <p className="text-sm text-foreground/60">Analyzing time and space complexity of the algorithms</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <div>
                  <h4 className="font-medium">Advanced Data Structures</h4>
                  <p className="text-sm text-foreground/60"> optimal data structures</p>
                </div>
              </div>
            </div>
            
            <Link to="/DataStructures">
            <Button className="w-full rounded-xl group bg-secondary hover:bg-secondary/90" >
              <span>Explore Data Structures</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
