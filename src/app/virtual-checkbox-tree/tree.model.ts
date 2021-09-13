import * as _ from 'lodash';
import { TristateSelection } from '../tristate-checkbox/tristate.enum';

export enum ExpandStateChange {
  EXPAND = 'EXPAND',
  COLLAPSE = 'COLLAPSE',
  NODE = 'NODE'
}

export interface Tree<T> {
  root: TreeNode<T>;
}

export interface TreeNode<T> {
  /**
   * The unique key of the node in the tree.
   */
  key: string;
  /**
   * The data contained by the node.
   */
  data: T;
  /**
   * The label to display describing the node in the tree.
   */
  label: string;
  /**
   * The selection state of the node CHECKED if fully selected,
   * UNCHECKED if neither it nor its descendants are not selected,
   * PARTIAL if any of its descendants are selected
   */
  tristateSelection: TristateSelection;
  /**
   * The display state of the node. If true the node should display its
   * descendants, otherwise do not display descendants.
   */
  expanded: boolean;
  parent?: TreeNode<T>;
  children?: TreeNode<T>[];
}

export function isPresent(node: any): boolean {
  if (node != null && node !== undefined) {
    return true;
  } else {
    return false;
  }
}

export function isTreeNodeLeaf(node: any): boolean {
  if (isPresent(node.children) && node.children.length > 0) {
    return false;
  }
  return true;
}

export function getTreeNodeLevel(node: any): number {
  let level = 0;
  let currentParent = node.parent;

  while (isPresent(currentParent)) {
    level++;
    currentParent = currentParent.parent;
  }

  return level;
}

export function collapseNodes(root: TreeNode<any>, nodesToCollapse: TreeNode<any>[]): TreeNode<any> {
  const rootClone = _.cloneDeep(root);
  nodesToCollapse.forEach((node: TreeNode<any>) => {
    const found = findNodeInTreeByKey(rootClone, node.key);
    console.log(`Node to collapse ${node.label} -> foundNode ${found.label}`);
    if (isPresent(found)) {
      collapseChildren(found);
    }
  });
  return rootClone;
}

function findNodeInTreeByKey(node: TreeNode<any>, key: string): TreeNode<any> {
  let arr: TreeNode<any>[] = flatten(node);
  if (isPresent(arr)) {
    const foundIndex = arr.findIndex(n => key === n.key);
    if (foundIndex !== -1) {
      return arr[foundIndex];
    }
  }
  return null;
}

function flatten(node: TreeNode<any>): TreeNode<any>[] {
  let res: TreeNode<any>[] = [];
  if (isPresent(node.children)) {
    for (const c of node.children) {
      res.push(c);
      res = res.concat(flatten(c));
    }
  }
  return res;
}

export function collapseChildren(node: TreeNode<any>, isRoot: boolean = false): any {
  let expand = false;
  if (isRoot) {
    expand = true;
  }
  console.log(`Setting node ${node.label} to expand = ${expand}`)
  node.expanded = expand;
  if (isPresent(node.children)) {
    const childNodes = _.cloneDeep(node.children);
    node.children = [];
    childNodes.forEach((child) => {
      const c = collapseChildren(child);
      node.children.push(c);
      c.parent = node;
    });
  }
  return node;
}

/**
 * Flattens the tree structure. By default all nodes are expanded.
 *
 * @param root
 * @param isRoot
 * @param change
 * @returns
 */
export function flatTreeRecursive(root: TreeNode<any>, isRoot: boolean, change: ExpandStateChange): TreeNode<any>[] {
  const rootClone = _.cloneDeep(root);
  let res = [];
  if (isRoot) {
    rootClone.expanded = true;
  }
  if (isPresent(rootClone.children)) {
    for (const c of rootClone.children) {
      switch (change) {
        case ExpandStateChange.EXPAND:
          c.expanded = true;
          break;
        case ExpandStateChange.COLLAPSE:
          c.expanded = false;
          break
        case ExpandStateChange.NODE:
        default:
      }
      res.push(c);
      res = res.concat(flatTreeRecursive(c, false, change));
    }
  }
  return res;
}

export function addToRemoveOrUpdateNodeInList(node: TreeNode<any>, nodeList: TreeNode<any>[], remove: boolean = false): any {
  const index = nodeList.findIndex(n => node.key === n.key);
  const newNode: TreeNode<any> = _.cloneDeep(node);
  if (-1 === index) {
    if (remove) {
      return nodeList;
    } else {
      // Add
      // Update parent's children reference
      if (isPresent(node.parent) && isPresent(node.parent.children)) {
        const childIndex = node.parent.children.findIndex(c => node.key === c.key);
        if (childIndex > 0) {
          newNode.parent.children =
            [...newNode.parent.children.slice(0, childIndex), newNode, ...newNode.parent.children.slice(childIndex + 1)];
        }
      }
      return [...nodeList, newNode];
    }
  }

  if (remove) {
    return [...nodeList.slice(0, index), ...nodeList.slice(index + 1)];
  } else {
    // Update
    if (isPresent(newNode.children) && !newNode.expanded) {
      const updatedChildren: TreeNode<any>[] = [];
      newNode.children.forEach((nodeChild: TreeNode<any>) => {
        nodeChild.expanded = false;
        updatedChildren.push(nodeChild);
      });
    }
    // Update parent's children reference
    if (isPresent(node.parent) && isPresent(node.parent.children)) {
      const childIndex = node.parent.children.findIndex(c => node.key === c.key);
      if (childIndex > 0) {
        newNode.parent.children =
          [...newNode.parent.children.slice(0, childIndex), newNode, ...newNode.parent.children.slice(childIndex + 1)];
      }
    }
    return [...nodeList.slice(0, index), newNode, ...nodeList.slice(index + 1)];
  }
}
