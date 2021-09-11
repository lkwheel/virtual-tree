import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { flatTreeRecursive, Tree, TreeNode } from './tree.model';

@Component({
  selector: 'virtual-checkbox-tree',
  templateUrl: './virtual-checkbox-tree.component.html',
  styleUrls: ['./virtual-checkbox-tree.component.scss']
})
export class VirtualCheckboxTreeComponent<T> implements OnInit, OnChanges {

  @Input()
  tree: Tree<T>

  flatTree: TreeNode<T>[];

  treeNode: TreeNode<T>

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tree'] && this.tree != null) {
      this.treeNode = this.tree.root;
      this.flatTree = flatTreeRecursive(this.tree.root);
    }
  }

  ngOnInit(): void {
  }

}
