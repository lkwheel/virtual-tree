import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { addToRemoveOrUpdateNodeInList, collapseNodes, ExpandStateChange, flatTreeRecursive, getTreeNodeLevel, isPresent, Tree, TreeNode } from './tree.model';

@Component({
  selector: 'virtual-checkbox-tree',
  templateUrl: './virtual-checkbox-tree.component.html',
  styleUrls: ['./virtual-checkbox-tree.component.scss']
})
export class VirtualCheckboxTreeComponent<T> implements OnInit, OnChanges {

  @Input()
  tree: Tree<T>

  @Input()
  selectedRow: TreeNode<T>;
  @Output()
  selectedRowChange = new EventEmitter<TreeNode<T>>();

  @Input()
  collapsedNodes: TreeNode<T>[];
  @Output()
  expandedNodesChange = new EventEmitter<TreeNode<T>[]>();

  flatTree: TreeNode<T>[];

  expandAll: boolean = true;

  visibleFlatTree: TreeNode<T>[] = [];

  rowSelectionEnabled = true;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Invoked when data bound changes are detected.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Changes that can happen:
    //   tree has been expanded
    //   tree has been unexpanded (folders closed)
    //   a node has had its expansion state changed
    //   tree has been filtered
    if (this.tree) {
      this.filterTreeNodes(this.tree.root, this.expandAll, this.collapsedNodes);
    }
  }

  filterTreeNodes(rootNode: TreeNode<T>, allExpanded: boolean, nodesCollapsed: TreeNode<T>[]) {
    if (allExpanded) {
      // Make all tree nodes expanded
      this.collapsedNodes = [];
      this.flatTree = flatTreeRecursive(rootNode, true, ExpandStateChange.EXPAND);
      this.visibleFlatTree = this.flatTree.slice(0);

      // Do filter
    } else if (!allExpanded && (!isPresent(nodesCollapsed) || nodesCollapsed.length === 0)) {
      // Display only level 1 nodes
      this.flatTree = flatTreeRecursive(rootNode, true, ExpandStateChange.COLLAPSE);
      let matchingNodes = this.flatTree.filter(node => {
        return getTreeNodeLevel(node) === 1;
      });
      this.visibleFlatTree = matchingNodes;
    } else if (isPresent(nodesCollapsed) && nodesCollapsed.length > 0) {
      rootNode = collapseNodes(rootNode, nodesCollapsed);
      this.flatTree = flatTreeRecursive(rootNode, true, ExpandStateChange.NODE);
      this.visibleFlatTree = this.flatTree.filter((node: TreeNode<T>) => {
        return node.expanded || node.parent.expanded;
      });
    }
  }

  onExpandAllNodesChange(expand: boolean) {
    this.expandAll = expand;
    this.filterTreeNodes(this.tree.root, expand, this.collapsedNodes);
  }

  onExpandedNodeChange(node: TreeNode<T>) {
    if (!isPresent(this.collapsedNodes)) {
      this.collapsedNodes = [];
    }
    if (!node.expanded) {
      this.collapsedNodes = <TreeNode<T>[]>addToRemoveOrUpdateNodeInList(node, this.collapsedNodes);
    } else {
      // Check to see if we need to remove
      this.collapsedNodes = <TreeNode<T>[]>addToRemoveOrUpdateNodeInList(node, this.collapsedNodes, true);
    }
    this.filterTreeNodes(this.tree.root, false, this.collapsedNodes);
  }

  onSelectedRowChange(node: TreeNode<T>): void {
    this.selectedRowChange.next(node);
  }

}
