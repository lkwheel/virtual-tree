import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tree, TreeNode } from './virtual-checkbox-tree/tree.model';
import { TristateSelection } from './tristate-checkbox/tristate.enum';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {

  tree: Tree<string>;

  expandedNodes: TreeNode<string>[];

  selectedRow: TreeNode<string>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRow']) {
      if (changes['selectedRow'].currentValue) {
        const _selectedRow = changes['selectedRow'].currentValue as TreeNode<string>;
        this.selectedRow = _selectedRow;
        console.log(`Selected node ${this.selectedRow.key} - ${this.selectedRow.label}`);
      }
    }
  }

  ngOnInit(): void {
    this.initTreeData();
  }

  initTreeData() {
    const rootData = 'root';
    const _expandedNodes = [];
    const rootTreeNode = {
        key: uuidv4(),
        label: rootData,
        data: rootData,
        tristateSelection: TristateSelection.UNCHECKED,
        expanded: true,
        children: []
      };
    let _tree: Tree<string> = {
      root: rootTreeNode
    };
    let _root: TreeNode<string> = _tree.root;

    for (let i = 0; i < 10; i++) {
      const data0 = `First Level Node ${i}`;
      let node: TreeNode<string> = {
        key: uuidv4(),
        label: data0,
        data: data0,
        tristateSelection: TristateSelection.UNCHECKED,
        expanded: true,
        parent: _root,
        children: []
      };
      _root.children.push(node);

      for (let j = 0; j < 3; j++) {
        const data1 = `Second Level Node ${i}:${j}`;
        let innerNode: TreeNode<string> = {
          key: uuidv4(),
          label: data1,
          data: data1,
          tristateSelection: TristateSelection.UNCHECKED,
          expanded: true,
          parent: node,
          children: []
        }
        node.children.push(innerNode);

        const data2 = `Third Level Node ${i}:${j}:0`;
        let innerNode2: TreeNode<string> = {
          key: uuidv4(),
          label: data2,
          data: data2,
          tristateSelection: TristateSelection.UNCHECKED,
          expanded: true,
          parent: innerNode
        }
        innerNode.children.push(innerNode2);
      }
    }
    this.tree = _tree;
    this.expandedNodes = _expandedNodes;
  }

  /**
   * Check whether the selected row exists in the tree, otherwise deselect the row.
   *
   * @private
   * @memberof LayerManagerComponent
   */
  private updateSelectedRow() {
    if (this.selectedRow) {
      // this.selectedRow = this.findCheckBoxNodeById(this.layerTree, this.selectedRow.key);
    }
  }
}
