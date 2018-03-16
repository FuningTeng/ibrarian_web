import { Node } from './node';
export class NodeStructure {
  constructor(theSourceNode: Node) {
    this.sourceNode = theSourceNode;
    this.targetNode = new Set<Node>();
  }
  public sourceNode: Node;
  public targetNode: Set<Node>;
}
