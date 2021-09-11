import { Component, Input, OnInit } from '@angular/core';
import { TristateSelection } from '../tristate-checkbox/tristate.enum';
import { getTreeNodeLevel, TreeNode } from './tree.model';

@Component({
  selector: 'virtual-checkbox-tree-child',
  templateUrl: './virtual-checkbox-tree-child.component.html',
  styleUrls: ['./virtual-checkbox-tree-child.component.scss']
})
export class VirtualCheckboxTreeChildComponent<T> implements OnInit {

  @Input()
  node: TreeNode<T>;

  constructor() { }

  ngOnInit(): void {
  }

  levelDistance(): number {
    return getTreeNodeLevel(this.node);
  }

  isFolder(node: TreeNode<T>): boolean {
    return !node.leaf
  }

  onCheckboxClicked(node: TreeNode<T>) {
    const state = node.tristateSelection;
    if (state === TristateSelection.CHECKED || state === TristateSelection.PARTIAL) {
      node.tristateSelection = TristateSelection.UNCHECKED;
    } else {
      node.tristateSelection = TristateSelection.CHECKED;
    }
    // this.selectedRowChange.next(node);
  }

  onToggleExpandedState(node: TreeNode<T>) {
    node.expanded = !node.expanded;
    // this.selectRow(node);
    // this.publishExpansionState();
  }

}
