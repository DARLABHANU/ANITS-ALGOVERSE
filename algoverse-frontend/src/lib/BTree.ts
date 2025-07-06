
import { TreeNode } from '@/types/TreeTypes';

export class BTree {
  root: TreeNode | null = null;
  private nodeIdCounter = 0;
  private maxDegree: number;
  private minKeys: number;
  private maxKeys: number;
  private keyCount: number = 0;

  constructor(maxDegree: number = 3) {
    this.maxDegree = maxDegree;
    this.maxKeys = maxDegree - 1;
    this.minKeys = Math.ceil(maxDegree / 2) - 1;
  }

  private createNode(values: number[] = [], parent: TreeNode | null = null): TreeNode {
    return {
      id: `node-${this.nodeIdCounter++}`,
      values: [...values],
      children: [],
      parent,
      isHighlighted: false,
      isAnimating: false
    };
  }

  setMaxDegree(degree: number): void {
    this.maxDegree = degree;
    this.maxKeys = degree - 1;
    this.minKeys = Math.ceil(degree / 2) - 1;
    // Reset tree when max degree changes to avoid inconsistencies
    this.reset();
  }

  getKeyCount(): number {
    return this.keyCount;
  }

  insert(value: number): boolean {
    if (this.keyCount >= 12) return false;

    if (this.root === null) {
      this.root = this.createNode([value]);
      this.keyCount++;
      return true;
    }

    // Check for duplicates
    if (this.search(value)) return false;

    const result = this.insertIntoNode(this.root, value);
    if (result) {
      this.root = result;
    }
    
    this.keyCount++;
    return true;
  }

  private insertIntoNode(node: TreeNode, value: number): TreeNode | null {
    // If it's a leaf node
    if (node.children.length === 0) {
      return this.insertIntoLeaf(node, value);
    }

    // Find the correct child to insert into
    let childIndex = 0;
    for (let i = 0; i < node.values.length; i++) {
      if (value < node.values[i]) break;
      childIndex++;
    }

    const child = node.children[childIndex];
    const promotedNode = this.insertIntoNode(child, value);

    if (promotedNode) {
      return this.insertPromotedNode(node, promotedNode);
    }

    return null;
  }

  private insertIntoLeaf(node: TreeNode, value: number): TreeNode | null {
    // Insert in sorted order
    let insertIndex = 0;
    while (insertIndex < node.values.length && node.values[insertIndex] < value) {
      insertIndex++;
    }
    node.values.splice(insertIndex, 0, value);

    // If node exceeds max keys, split it
    if (node.values.length > this.maxKeys) {
      return this.splitNode(node);
    }

    return null;
  }

  private splitNode(node: TreeNode): TreeNode {
    const midIndex = Math.floor(node.values.length / 2);
    const middleValue = node.values[midIndex];
    
    const leftValues = node.values.slice(0, midIndex);
    const rightValues = node.values.slice(midIndex + 1);
    
    const leftNode = this.createNode(leftValues, node.parent);
    const rightNode = this.createNode(rightValues, node.parent);

    // Handle children if not a leaf
    if (node.children.length > 0) {
      const midChildIndex = midIndex + 1;
      leftNode.children = node.children.slice(0, midChildIndex);
      rightNode.children = node.children.slice(midChildIndex);
      
      // Update parent references
      leftNode.children.forEach(child => child.parent = leftNode);
      rightNode.children.forEach(child => child.parent = rightNode);
    }

    // Create new parent with middle value
    const newParent = this.createNode([middleValue], node.parent);
    newParent.children = [leftNode, rightNode];
    leftNode.parent = newParent;
    rightNode.parent = newParent;

    return newParent;
  }

  private insertPromotedNode(node: TreeNode, promotedNode: TreeNode): TreeNode | null {
    const promotedValue = promotedNode.values[0];
    
    // Insert the promoted value
    let insertIndex = 0;
    while (insertIndex < node.values.length && node.values[insertIndex] < promotedValue) {
      insertIndex++;
    }
    node.values.splice(insertIndex, 0, promotedValue);

    // Insert the promoted children
    const [leftChild, rightChild] = promotedNode.children;
    node.children.splice(insertIndex, 1, leftChild, rightChild);
    leftChild.parent = node;
    rightChild.parent = node;

    // If node exceeds max keys, split it
    if (node.values.length > this.maxKeys) {
      return this.splitNode(node);
    }

    return null;
  }

  search(value: number): boolean {
    return this.searchInNode(this.root, value);
  }

  private searchInNode(node: TreeNode | null, value: number): boolean {
    if (!node) return false;

    // Check if value is in current node
    if (node.values.includes(value)) {
      return true;
    }

    // If it's a leaf and value not found
    if (node.children.length === 0) {
      return false;
    }

    // Find the correct child to search
    let childIndex = 0;
    for (let i = 0; i < node.values.length; i++) {
      if (value < node.values[i]) break;
      childIndex++;
    }

    return this.searchInNode(node.children[childIndex], value);
  }

  delete(value: number): boolean {
    if (!this.root || !this.search(value)) return false;

    this.deleteFromTree(this.root, value);
    
    // If root became empty but has children, promote the child
    if (this.root && this.root.values.length === 0 && this.root.children.length === 1) {
      this.root = this.root.children[0];
      this.root.parent = null;
    }
    
    // If root became completely empty, set to null
    if (this.root && this.root.values.length === 0 && this.root.children.length === 0) {
      this.root = null;
    }
    
    this.keyCount--;
    return true;
  }

  private deleteFromTree(node: TreeNode, key: number): void {
    const keyIndex = node.values.indexOf(key);
    
    if (keyIndex !== -1) {
      // Key found in current node
      if (node.children.length === 0) {
        // Case 1: Key is in leaf node - simple deletion
        node.values.splice(keyIndex, 1);
      } else {
        // Case 2: Key is in internal node
        this.deleteFromInternalNode(node, keyIndex);
      }
    } else {
      // Case 3: Key is not in current node, find child to descend
      if (node.children.length === 0) return; // Key not found
      
      let childIndex = 0;
      while (childIndex < node.values.length && key > node.values[childIndex]) {
        childIndex++;
      }
      
      const child = node.children[childIndex];
      
      // Ensure child has at least minKeys + 1 keys before deletion
      if (child.values.length === this.minKeys) {
        this.fixChildWithMinKeys(node, childIndex);
        // After fixing, the key might have moved, so we need to search again
        this.deleteFromTree(node, key);
        return;
      }
      
      this.deleteFromTree(child, key);
    }
    
    // Check for underflow in non-root nodes
    if (node.parent && node.values.length < this.minKeys) {
      this.fixUnderflow(node);
    }
  }

  private deleteFromInternalNode(node: TreeNode, keyIndex: number): void {
    const key = node.values[keyIndex];
    const leftChild = node.children[keyIndex];
    const rightChild = node.children[keyIndex + 1];
    
    if (leftChild.values.length > this.minKeys) {
      // Get predecessor from left subtree
      const predecessor = this.getPredecessor(leftChild);
      node.values[keyIndex] = predecessor;
      this.deleteFromTree(leftChild, predecessor);
    } else if (rightChild.values.length > this.minKeys) {
      // Get successor from right subtree
      const successor = this.getSuccessor(rightChild);
      node.values[keyIndex] = successor;
      this.deleteFromTree(rightChild, successor);
    } else {
      // Both children have minimum keys, merge them
      this.mergeChildren(node, keyIndex);
      this.deleteFromTree(leftChild, key);
    }
  }

  private getPredecessor(node: TreeNode): number {
    // Find the rightmost key in the subtree
    while (node.children.length > 0) {
      node = node.children[node.children.length - 1];
    }
    return node.values[node.values.length - 1];
  }

  private getSuccessor(node: TreeNode): number {
    // Find the leftmost key in the subtree
    while (node.children.length > 0) {
      node = node.children[0];
    }
    return node.values[0];
  }

  private fixChildWithMinKeys(parent: TreeNode, childIndex: number): void {
    const child = parent.children[childIndex];
    
    // Try to borrow from left sibling
    if (childIndex > 0) {
      const leftSibling = parent.children[childIndex - 1];
      if (leftSibling.values.length > this.minKeys) {
        this.borrowFromLeftSibling(parent, childIndex);
        return;
      }
    }
    
    // Try to borrow from right sibling
    if (childIndex < parent.children.length - 1) {
      const rightSibling = parent.children[childIndex + 1];
      if (rightSibling.values.length > this.minKeys) {
        this.borrowFromRightSibling(parent, childIndex);
        return;
      }
    }
    
    // Merge with a sibling
    if (childIndex > 0) {
      this.mergeChildren(parent, childIndex - 1);
    } else {
      this.mergeChildren(parent, childIndex);
    }
  }

  private borrowFromLeftSibling(parent: TreeNode, childIndex: number): void {
    const child = parent.children[childIndex];
    const leftSibling = parent.children[childIndex - 1];
    
    // Move parent key down to child
    child.values.unshift(parent.values[childIndex - 1]);
    
    // Move left sibling's largest key to parent
    parent.values[childIndex - 1] = leftSibling.values.pop()!;
    
    // Move child if not leaf
    if (leftSibling.children.length > 0) {
      const movedChild = leftSibling.children.pop()!;
      movedChild.parent = child;
      child.children.unshift(movedChild);
    }
  }

  private borrowFromRightSibling(parent: TreeNode, childIndex: number): void {
    const child = parent.children[childIndex];
    const rightSibling = parent.children[childIndex + 1];
    
    // Move parent key down to child
    child.values.push(parent.values[childIndex]);
    
    // Move right sibling's smallest key to parent
    parent.values[childIndex] = rightSibling.values.shift()!;
    
    // Move child if not leaf
    if (rightSibling.children.length > 0) {
      const movedChild = rightSibling.children.shift()!;
      movedChild.parent = child;
      child.children.push(movedChild);
    }
  }

  private mergeChildren(parent: TreeNode, leftIndex: number): void {
    const leftChild = parent.children[leftIndex];
    const rightChild = parent.children[leftIndex + 1];
    const separatorKey = parent.values[leftIndex];
    
    // Merge: leftChild + separatorKey + rightChild
    leftChild.values.push(separatorKey);
    leftChild.values.push(...rightChild.values);
    leftChild.children.push(...rightChild.children);
    
    // Update parent references for moved children
    rightChild.children.forEach(child => child.parent = leftChild);
    
    // Remove separator key and right child from parent
    parent.values.splice(leftIndex, 1);
    parent.children.splice(leftIndex + 1, 1);
  }

  private fixUnderflow(node: TreeNode): void {
    if (!node.parent) return; // Root can have fewer keys
    
    const parent = node.parent;
    const nodeIndex = parent.children.indexOf(node);
    
    // Try to borrow from left sibling
    if (nodeIndex > 0) {
      const leftSibling = parent.children[nodeIndex - 1];
      if (leftSibling.values.length > this.minKeys) {
        this.borrowFromLeftSibling(parent, nodeIndex);
        return;
      }
    }
    
    // Try to borrow from right sibling
    if (nodeIndex < parent.children.length - 1) {
      const rightSibling = parent.children[nodeIndex + 1];
      if (rightSibling.values.length > this.minKeys) {
        this.borrowFromRightSibling(parent, nodeIndex);
        return;
      }
    }
    
    // Merge with a sibling
    if (nodeIndex > 0) {
      this.mergeChildren(parent, nodeIndex - 1);
    } else {
      this.mergeChildren(parent, nodeIndex);
    }
    
    // Check if parent now has underflow
    if (parent.values.length < this.minKeys && parent.parent) {
      this.fixUnderflow(parent);
    }
  }

  reset(): void {
    this.root = null;
    this.nodeIdCounter = 0;
    this.keyCount = 0;
  }

  getInorderTraversal(): number[] {
    const result: number[] = [];
    this.inorderHelper(this.root, result);
    return result;
  }

  private inorderHelper(node: TreeNode | null, result: number[]): void {
    if (!node) return;

    if (node.children.length === 0) {
      result.push(...node.values);
    } else {
      for (let i = 0; i < node.values.length; i++) {
        this.inorderHelper(node.children[i], result);
        result.push(node.values[i]);
      }
      this.inorderHelper(node.children[node.children.length - 1], result);
    }
  }
}
