import { Component, OnInit } from '@angular/core';
import { Tree, TreeNode } from './virtual-checkbox-tree/tree.model';
import { TristateSelection } from './tristate-checkbox/tristate.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.initTreeData();
  }

  title = 'virtual-tree';

  tree: Tree<string>;

  initTreeData() {
    const rootData = 'root';
    let _tree: Tree<string> = {
      root: {
          name: rootData,
          data: rootData,
          tristateSelection: TristateSelection.UNCHECKED,
          expanded: true,
          leaf: false,
          children: []
        }
    };
    let _root: TreeNode<string> = _tree.root;

    for (let i = 0; i < 10; i++) {
      const data0 = 'First Level Node ' + i;
      let node: TreeNode<string> = {
        name: data0,
        data: data0,
        tristateSelection: TristateSelection.UNCHECKED,
        expanded: true,
        leaf: false,
        parent: _root,
        children: []
      };
      _root.children.push(node);

      for (let j = 0; j < 3; j++) {
        const data1 = 'Second Level Node ' + i + ':' + j;
        let innerNode: TreeNode<string> = {
          name: data1,
          data: data1,
          tristateSelection: TristateSelection.UNCHECKED,
          expanded: true,
          leaf: false,
          parent: node,
          children: []
        }
        node.children.push(innerNode);

        const data2 = 'Third Level Node ' + i + ':' + j + ':0';
        let innerNode2: TreeNode<string> = {
          name: data2,
          data: data2,
          tristateSelection: TristateSelection.UNCHECKED,
          expanded: true,
          leaf: true,
          parent: innerNode
        }
        innerNode.children.push(innerNode2);
      }
    }
    this.tree = _tree;
  }
}
