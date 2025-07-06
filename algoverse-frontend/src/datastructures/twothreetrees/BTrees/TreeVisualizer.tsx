
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Search, Plus, Trash2, AlertCircle } from 'lucide-react';
import { BTree } from '@/lib/BTree';
import TreeRenderer from './TreeRenderer';
import { TreeNode } from '@/types/TreeTypes';
import { useToast } from '@/hooks/use-toast';

const TreeVisualizer = () => {
  const [tree] = useState(new BTree(3));
  const [currentRoot, setCurrentRoot] = useState<TreeNode | null>(null);
  const [insertValue, setInsertValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchResult, setSearchResult] = useState<boolean | null>(null);
  const [inorderValues, setInorderValues] = useState<number[]>([]);
  const [maxDegree, setMaxDegree] = useState(3);
  const [keyCount, setKeyCount] = useState(0);
  const { toast } = useToast();

  const updateTreeDisplay = useCallback(() => {
    setCurrentRoot(tree.root ? { ...tree.root } : null);
    setInorderValues(tree.getInorderTraversal());
    setKeyCount(tree.getKeyCount());
  }, [tree]);

  useEffect(() => {
    // Initialize with some sample values
    const sampleValues = [10, 20, 5, 6, 12, 30, 7, 17];
    sampleValues.forEach(value => {
      tree.insert(value);
    });
    updateTreeDisplay();
  }, [tree, updateTreeDisplay]);

  const handleMaxDegreeChange = (value: string) => {
    const degree = parseInt(value);
    setMaxDegree(degree);
    tree.setMaxDegree(degree);
    updateTreeDisplay();
    toast({
      title: "Tree Reset",
      description: `Tree reset due to change in max degree (order ${degree})`,
      variant: "default"
    });
  };

  const handleInsert = async () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }

    if (keyCount >= 12) {
      toast({
        title: "Limit Reached",
        description: "Maximum of 12 keys allowed",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    setSearchResult(null);

    try {
      const insertResult = tree.insert(value);
      if (insertResult) {
        toast({
          title: "Value Inserted",
          description: `Successfully inserted ${value}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Insertion Failed",
          description: `Value ${value} already exists`,
          variant: "destructive"
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      updateTreeDisplay();
    } finally {
      setIsAnimating(false);
      setInsertValue('');
    }
  };

  const handleDelete = async () => {
    const value = parseInt(deleteValue);
    if (isNaN(value)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    setSearchResult(null);

    try {
      const deleteResult = tree.delete(value);
      if (deleteResult) {
        toast({
          title: "Value Deleted",
          description: `Successfully deleted ${value}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Deletion Failed",
          description: `Value ${value} not found`,
          variant: "destructive"
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      updateTreeDisplay();
    } finally {
      setIsAnimating(false);
      setDeleteValue('');
    }
  };

  const handleSearch = async () => {
    const value = parseInt(insertValue || deleteValue);
    if (isNaN(value)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);

    try {
      const found = tree.search(value);
      setSearchResult(found);
      toast({
        title: found ? "Value Found" : "Value Not Found",
        description: `${value} ${found ? 'exists' : 'does not exist'} in the tree`,
        variant: found ? "default" : "destructive"
      });

      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsAnimating(false);
    }
  };

  const handleReset = () => {
    tree.reset();
    updateTreeDisplay();
    setSearchResult(null);
    setInsertValue('');
    setDeleteValue('');
    toast({
      title: "Tree Reset",
      description: "The tree has been cleared",
      variant: "default"
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Control Panel */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-300/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">B-Tree Operations (Max Degree: {maxDegree})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Max Degree Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Max Degree</label>
              <Select value={maxDegree.toString()} onValueChange={handleMaxDegreeChange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {[3, 4, 5, 6].map(degree => (
                    <SelectItem key={degree} value={degree.toString()} className="text-white hover:bg-slate-700">
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Insert */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Insert Value</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  placeholder="Enter value..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                  disabled={keyCount >= 12}
                />
                <Button
                  onClick={handleInsert}
                  disabled={isAnimating || !insertValue || keyCount >= 12}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Delete */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Delete Value</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  placeholder="Enter value..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                />
                <Button
                  onClick={handleDelete}
                  disabled={isAnimating || !deleteValue}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">Actions</label>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={isAnimating || (!insertValue && !deleteValue)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-white border-purple-300/30">
                Keys: {keyCount}/12
              </Badge>
              {keyCount >= 12 && (
                <Badge variant="destructive" className="bg-red-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Limit Reached
                </Badge>
              )}
            </div>

            {searchResult !== null && (
              <Badge 
                variant={searchResult ? "default" : "destructive"}
                className={searchResult ? "bg-green-600" : "bg-red-600"}
              >
                {searchResult ? "Found" : "Not Found"}
              </Badge>
            )}
          </div>

          {inorderValues.length > 0 && (
            <div className="space-y-2">
              <p className="text-purple-200 text-sm font-medium">In-order Traversal:</p>
              <div className="flex flex-wrap gap-1">
                {inorderValues.map((value, index) => (
                  <Badge key={index} variant="outline" className="text-white border-purple-300/30">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tree Visualization */}
      <Card className="bg-white/5 backdrop-blur-sm border-purple-300/20 min-h-96">
        <CardContent className="p-6">
          {currentRoot ? (
            <TreeRenderer root={currentRoot} isAnimating={isAnimating} maxDegree={maxDegree} />
          ) : (
            <div className="flex items-center justify-center h-64 text-white/60">
              <div className="text-center">
                <div className="text-6xl mb-4">🌳</div>
                <p className="text-xl">Empty Tree</p>
                <p className="text-sm">Insert some values to get started</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Panel */}
      <Card className="bg-white/10 backdrop-blur-sm border-purple-300/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">B-Tree Properties (Max Degree: {maxDegree})</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-200 space-y-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Max Keys per Node:</strong> {maxDegree - 1}</li>
            <li><strong>Min Keys per Node:</strong> {Math.ceil(maxDegree / 2) - 1} (except root)</li>
            <li><strong>Max Children per Node:</strong> {maxDegree}</li>
            <li><strong>Balanced:</strong> All leaf nodes are at the same level</li>
            <li><strong>Sorted:</strong> Values are maintained in sorted order within nodes</li>
            <li><strong>Operations:</strong> Search, Insert, and Delete all run in O(log n) time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreeVisualizer;
