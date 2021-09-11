import { TristateSelection } from '../tristate-checkbox/tristate.enum';

export interface Tree<T> {
  root: TreeNode<T>;
}

export interface TreeNode<T> {
  name: string;
  tristateSelection: TristateSelection;
  expanded: boolean;
  data: T;
  leaf: boolean;
  parent?: TreeNode<T>;
  children?: TreeNode<T>[];
}

export function getTreeNodeLevel(node: any): number {
  let level = 0;
  let currentParent = node.parent;

  while (currentParent) {
    level++;
    currentParent = currentParent.parent;
  }

  return level;
}

export function flatTreeRecursive(root: any): any {
  let res = [];
  if (root.children) {
    for (const c of root.children) {
      res.push(c);
      res = res.concat(flatTreeRecursive(c));
    }
  }
  return res;
}
