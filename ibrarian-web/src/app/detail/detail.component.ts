import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NodeStructure } from '../models/node-structure';
import { Node } from '../models/node';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnChanges {
  close: boolean;
  @Input('nodeStructures') nodeStructures: Map<number, NodeStructure>;
  @Input('nodeToShow') nodeToShow: NodeStructure;
  @Output() outputOnClose: EventEmitter<any> = new EventEmitter();
  @Output() outputOnSelectReference: EventEmitter<NodeStructure> = new EventEmitter();
  constructor() {
    this.close = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodeStructure) {
      this.nodeToShow = changes.nodeStructure.currentValue;
    }
    this.close = false;
  }
  closeWidnow() {
    this.close = true;
    this.outputOnClose.emit(this.close);
  }
  onSelect(targetNode: Node) {
    // this.nodeStructure = this.nodeStructures.get(targetNode.i);
    this.outputOnSelectReference.emit(this.nodeStructures.get(targetNode.i));
    console.log(`${targetNode.title} has been selected`);
  }

}
