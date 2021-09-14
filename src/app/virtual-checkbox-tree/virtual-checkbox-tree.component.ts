import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TristateSelection } from '../tristate-checkbox/tristate.enum';
import {
  addToRemoveOrUpdateNodeInList,
  collapseNodes,
  ExpandStateChange,
  changeExpansionStateRecursive,
  getTreeNodeLevel,
  isPresent,
  selectNodes,
  Tree,
  TreeNode,
  unselectAllInNode,
  flatten,
  findNodeInTreeByKey
} from './tree.model';

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
  selectedNodesChange = new EventEmitter<TreeNode<T>[]>();

  @Input()
  selectedNodes: TreeNode<T>[];

  @Input()
  collapsedNodes: TreeNode<T>[];
  @Output()
  collapsedNodeChange = new EventEmitter<TreeNode<T>[]>();


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
      this.filterTreeNodes(this.tree.root, this.collapsedNodes, this.selectedNodes);
    }
  }

  filterTreeNodes(rootNode: TreeNode<T>,
    nodesCollapsed: TreeNode<T>[],
    nodesSelected: TreeNode<T>[], expansionState: ExpandStateChange = ExpandStateChange.NODE) {
    rootNode = unselectAllInNode(rootNode);
    rootNode = selectNodes(rootNode, nodesSelected);
    if (expansionState === ExpandStateChange.EXPAND) {
      // Make all tree nodes expanded
      this.collapsedNodes = [];
      this.flatTree = changeExpansionStateRecursive(rootNode, true, ExpandStateChange.EXPAND);
      this.visibleFlatTree = this.flatTree.slice(0);
    } else if (expansionState === ExpandStateChange.COLLAPSE) {
      // Display only level 1 nodes
      this.flatTree = changeExpansionStateRecursive(rootNode, true, ExpandStateChange.COLLAPSE);
      let matchingNodes = this.flatTree.filter(node => {
        return getTreeNodeLevel(node) === 1;
      });
      this.visibleFlatTree = matchingNodes;
    } else if (isPresent(nodesCollapsed) && nodesCollapsed.length > 0) {
      rootNode = collapseNodes(rootNode, nodesCollapsed);
      this.flatTree = changeExpansionStateRecursive(rootNode, true, ExpandStateChange.NODE);
      this.visibleFlatTree = this.flatTree.filter((node: TreeNode<T>) => {
        return node.expanded || node.parent.expanded;
      });
    } else {
      this.flatTree = changeExpansionStateRecursive(rootNode, true, ExpandStateChange.NODE);
      this.visibleFlatTree = this.flatTree.filter((node: TreeNode<T>) => {
        return node.expanded || node.parent.expanded;
      });
    }
  }

  onUncheckAll() {
    this.selectedNodes = [];
    this.filterTreeNodes(this.tree.root, this.collapsedNodes, this.selectedNodes);
    this.selectedNodesChange.emit(this.selectedNodes);
  }

  onExpandAllNodesChange(expand: boolean) {
    let expansionState = ExpandStateChange.COLLAPSE;
    if (expand) {
      expansionState = ExpandStateChange.EXPAND
    }
    this.filterTreeNodes(this.tree.root, this.collapsedNodes, this.selectedNodes, expansionState);
    this.collapsedNodeChange.emit(this.collapsedNodes);
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
    this.filterTreeNodes(this.tree.root, this.collapsedNodes, this.selectedNodes);
    this.collapsedNodeChange.emit(this.collapsedNodes);
  }

  onSelectedRowChange(node: TreeNode<T>): void {
    if (!isPresent(this.selectedNodes)) {
      this.selectedNodes = [];
    }
    const toggledNode = findNodeInTreeByKey(this.tree.root, node.key);
    toggledNode.tristateSelection = node.tristateSelection;
    if (node.tristateSelection === TristateSelection.CHECKED) {
      this.selectedNodes.push(toggledNode);
      // Add all children of this node from selected tree
      if (isPresent(node.children)) {
        const flattenedSelectedNodes = flatten(toggledNode);
        flattenedSelectedNodes.forEach(n => {
          this.selectedNodes = <TreeNode<T>[]>addToRemoveOrUpdateNodeInList(n, this.selectedNodes);
        });
      }
    } else {
      // Remove this node and all children from selected tree
      this.selectedNodes = <TreeNode<T>[]>addToRemoveOrUpdateNodeInList(toggledNode, this.selectedNodes, true);
      if (isPresent(node.children)) {
        const flattenedUnselectedNodes = flatten(toggledNode);
        flattenedUnselectedNodes.forEach(n => {
          this.selectedNodes = <TreeNode<T>[]>addToRemoveOrUpdateNodeInList(n, this.selectedNodes, true);
        });
      } else {
        this.selectedNodes = <TreeNode<T>[]>addToRemoveOrUpdateNodeInList(node, this.selectedNodes, true);
      }
    }
    if (this.selectedNodes.length === 1 &&
      (isPresent(this.selectedNodes[0].children) && this.selectedNodes[0].children.length > 0)) {
      this.selectedNodes = [];
    }
    this.filterTreeNodes(this.tree.root, this.collapsedNodes, this.selectedNodes);
    this.selectedNodesChange.emit(this.selectedNodes);
  }

}
