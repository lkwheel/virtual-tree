import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TristateSelection } from '../tristate-checkbox/tristate.enum';
import { getTreeNodeLevel, isTreeNodeLeaf, TreeNode } from './tree.model';

@Component({
  selector: 'virtual-checkbox-tree-child',
  templateUrl: './virtual-checkbox-tree-child.component.html',
  styleUrls: ['./virtual-checkbox-tree-child.component.scss']
})
export class VirtualCheckboxTreeChildComponent<T> implements OnInit {

  @Input()
  rowSelectionEnabled: boolean;

  @Input()
  node: TreeNode<T>;

  @Input()
  selectedRow: TreeNode<T>;
  @Output()
  selectedRowChange = new EventEmitter<TreeNode<T>>();

  @Output()
  expandedNodeChange = new EventEmitter<TreeNode<T>>();

  @Input()
  selected = false;

  @Output()
  expandAllToggle = new EventEmitter<boolean>();

  @Output()
  uncheckAll = new EventEmitter();

  menuItems: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.menuItems = this.initMenu();
  }

  levelDistance(): number {
    return getTreeNodeLevel(this.node);
  }

  isFolder(node: TreeNode<T>): boolean {
    return !isTreeNodeLeaf(node);
  }

  /**
   * Determines whether the specified node is the selected row of the tree.
   * @param node The node to check
   * @returns True if the specified node is the selected node of the tree.
   */
  public isSelectedRow(node: TreeNode<T>) {
    return this.rowSelectionEnabled && this.selectedRow === node;
  }

  /**
   * Mark the identified node as the selected row of the tree.
   * @param node The node to mark as selected.
   */
  public selectRow(node: TreeNode<T>) {
    if (this.selectedRow !== node) {
      this.selectedRowChange.next(node);
    }
  }

  onCheckboxClicked(node: TreeNode<T>) {
    const state = node.tristateSelection;
    console.log(`node ${node.label} check state ${state}`)
    if (state === TristateSelection.CHECKED || state === TristateSelection.PARTIAL) {
      node.tristateSelection = TristateSelection.UNCHECKED;
    } else {
      node.tristateSelection = TristateSelection.CHECKED;
    }
    this.selectedRowChange.next(node);
  }

  onToggleExpandedState(node: TreeNode<T>) {
    node.expanded = !node.expanded;
    this.expandedNodeChange.emit(node);
  }

  /** Dropdown list items */
  private initMenu(): MenuItem[] {
    return [
      {
        id: 'view',
        label: 'View',
        items: [
          {
            id: 'zoom-to-region',
            label: `Zoom-To`,
            icon: 'pi pi-fw pi-search',
            disabled: false,
            command: event => console.log(`clicked`)//this.flyToRegion.emit(this.node.data)
          },
        ]
      },
      {
        id: 'general',
        label: 'General',
        items: [
          {
            id: 'expand-all',
            label: 'Expand All',
            icon: 'fas fa-trash-alt',
            disabled: false,
            command: event => this.expandAllToggle.emit(true)//this.uncheckAll.emit()
          },
          {
            id: 'unexpand-all',
            label: 'Unexpand All',
            icon: 'fas fa-trash-alt',
            disabled: false,
            command: event => this.expandAllToggle.emit(false)//this.uncheckAll.emit()
          },
          {
            id: 'uncheck',
            label: 'Uncheck All',
            icon: 'fas fa-trash-alt',
            disabled: false,
            command: event => this.uncheckAll.emit()
          }
        ]
      }
    ];
  }

}
