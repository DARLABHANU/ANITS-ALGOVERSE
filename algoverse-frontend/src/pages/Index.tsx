import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExploreSection from "@/components/ExploreSection"; // This now has the ID
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  const location = useLocation(); // Get the current location object

  // Effect to scroll to section when hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1)); // Get element by ID (without the '#')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the element
      }
    }
  }, [location.hash]); // Dependency array: re-run when location.hash changes

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />

        {/* ExploreSection now contains the id="learning-paths" */}
        <ExploreSection />

        {/* Why Learn Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Learn With AlgoVerse?</h2>
                <p className="text-muted-foreground">
                  Master computer science fundamentals with our carefully designed learning paths
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-4">Why Data Structures Matter</h3>
                  <p className="text-muted-foreground mb-4">
                    Data structures form the building blocks of software development, enabling you to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Efficiently organize and store information in memory</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Process large amounts of data with optimal performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Create scalable applications that handle growing datasets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Pass technical interviews at top tech companies</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-4">Why Algorithms Are Essential</h3>
                  <p className="text-muted-foreground mb-4">
                    Algorithms are the heart of computational problem-solving, allowing you to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Solve complex problems systematically and efficiently</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Optimize code for better performance and resource usage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Develop critical thinking and analytical reasoning skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Understand the foundations of machine learning and AI</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;