import { Component, OnInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { Data } from '../models/data';
import { Edge } from '../models/edge';
import { Node } from '../models/node';
import { NodeStructure } from '../models/node-structure';
import {
  D3Service,
  D3,
  Force,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition,
  ZoomBehavior,
  ZoomTransform
} from 'd3-ng2-service';
import { IbrarianService } from '../ibrarian.service';

@Component({
  selector: 'app-force-drag-view',
  templateUrl: './force-drag-view.component.html',
  styleUrls: ['./force-drag-view.component.scss']
})
export class ForceDragViewComponent implements OnInit, OnDestroy {

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private edges: Edge[];
  private nodes: Node[];
  private w: number;
  private h: number;
  private globalG: any;
  // Node Dictonary
  public nodeStructures: Map<number, NodeStructure>;
  public currentNodeStructure: NodeStructure;
  constructor(element: ElementRef,
    private ngZone: NgZone,
    private d3Service: D3Service,
    private _forceService: IbrarianService) { // <-- pass the D3 Service into the constructor
    this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
    this.parentNativeElement = element.nativeElement;
    this.nodeStructures = new Map<number, NodeStructure>();
  }
  ngOnDestroy() {
    if (this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }

  ngOnInit() {
    // <-- Use the Selection interface (very basic here for illustration only)
    this._forceService.getForceData().subscribe(data => {
      this.edges = data.edges;
      this.nodes = data.nodes;

      // Node Dictionary Initialize
      this.nodes.forEach((value: Node, index: number, arr) => {
        this.nodeStructures.set(value.i, new NodeStructure(value));
      });
      this.edges.forEach((value: Edge, index: number, arr) => {
        if (this.nodeStructures.get(value.source)) {
          this.nodeStructures.get(value.source).targetNode.add(
            this.nodeStructures.get(value.target).sourceNode
          );
        }
      });
      this.createNetWork();
    });
  }
  createNetWork(): void {
    const self = this;
    const d3 = this.d3; // <-- for convenience use a block scope variable
    // tslint:disable-next-line:prefer-const
    let d3Svg: Selection<SVGSVGElement, any, null, undefined>;
    let d3ParentElement: Selection<HTMLElement, any, any, any>;
    const colors = ['#996666',
      '#66CCCC', '#FFFF99', '#CC9999',
      '#666633', '#993300', '#999966',
      '#660000', '#996699', '#cc6633',
      '#ff9966', '#339999', '#6699cc',
      '#ffcc66', '#ff6600', '#00ccccc'];
    // This isn't 'gravity' it's the visual centering of the network based on its mass
    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement); // <-- use the D3 select method
      d3.select('svg.main').attr('width', this.parentNativeElement.offsetWidth);
      d3.select('svg.main').attr('height', this.parentNativeElement.offsetHeight);
      this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');
    }
    const svg = d3.select('svg.main'),
      width = +svg.attr('width'),
      height = +svg.attr('height');
    this.w = width;
    this.h = height;
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function (d) { d3.select(this).style('cursor', 'move'); })
      .on('mouseout', function (d) { d3.select(this).style('cursor', 'default'); })
      .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on('zoom', function () {
          g.attr('transform', d3.event.transform);
        }));
    const g = svg.append('g');
    this.globalG = g;
    const networkCenter = d3.forceCenter().x(width / 2).y(height / 2);
    // CHARGE
    const manyBody = d3.forceManyBody().strength(-200).distanceMax(200);
    // Specify module position for the three largest modules. This is the x-y center of the modules
    // singletons and small modules will be handled as a whole
    const modulePosition = {
      '2': { x: 0, y: 0 },
      '3': { x: 200, y: 25 },
      '1': { x: 0, y: 200 }
    };

    // Make the x-position equal to the x-position specified in the module positioning object or, if not in
    // the hash, then set it to 250
    const forceX = d3.forceX(
      (d: Node, i: number, data: Node[]) => modulePosition[d.module] ? modulePosition[d.module].x : 250)
      .strength(0.0001);

    const forceY = d3.forceY(
      (d: Node, i: number, data: Node[]) => modulePosition[d.module] ? modulePosition[d.module].y : 250)
      .strength(0.0001);

    const force = d3.forceSimulation(this.nodes);
    const updateNetwork = function (...e: any[]) {
      g.selectAll('line')
        .attr('x1', function (d: any) { return d.source.x; })
        .attr('y1', function (d: any) { return d.source.y; })
        .attr('x2', function (d: any) { return d.target.x; })
        .attr('y2', function (d: any) { return d.target.y; });
      g.selectAll('g.node')
        .attr('transform', function (d: any) { return 'translate(' + d.x + ',' + d.y + ')'; })
        .call(d3.drag()
          .on('start', function (d: any) {
            if (!d3.event.active) { force.alphaTarget(0.3).restart(); }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', function (d: any) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on('end', function (d: any) {
            if (!d3.event.active) { force.alphaTarget(0); }
            d.fx = null;
            d.fy = null;
          })
        );
    };
    force.force('charge', manyBody)
      .force('link', d3.forceLink(this.edges).distance(
        function (e) {
          // tslint:disable-next-line:prefer-const
          let random = d3.randomUniform(30, 50);
          return 0 + random();
        }
      ).iterations(1))

      .force('center', networkCenter)
      .force('x', forceX)
      .force('y', forceY).on('tick', updateNetwork);

    // Create arrow defination for edge
    // tslint:disable-next-line:prefer-const
    let defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', '32')
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ccc')
      .attr('stroke', '#ccc');

    // create edge
    // tslint:disable-next-line:prefer-const
    let edgeEnter = g.selectAll('g.edge')
      .data(this.edges)
      .enter()
      .append('g')
      .attr('class', 'edge');
    edgeEnter
      .append('line')
      .attr('id', function (d) { return 'line_' + d.source + '_' + d.target; })
      .style('stroke-width', function (d: any) { return d.border ? '3px' : '1px'; })
      .style('stroke', '#aaa')
      .style('pointer-events', 'none')
      .attr('marker-end', 'url(#arrow)');

    // create node
    // tslint:disable-next-line:prefer-const
    let nodeEnter = g.selectAll('g.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    nodeEnter.append('circle')
      .attr('r', 8)
      .attr('id', function (d) { return 'circle_' + d.id; })
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', function (d: any) { return d.border ? '3px' : '1px'; });

    // add node text
    nodeEnter.append('text')
      .style('text-anchor', 'middle')
      .attr('y', 3)
      .style('stroke-width', '1px')
      .style('stroke-opacity', 0.75)
      .style('font-size', '8px')
      .text(function (d) { return d.id; })
      .style('pointer-events', 'none');

    // tslint:disable-next-line:prefer-const
    let div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    const com = this;
    const nodeStructures = com.nodeStructures;

    nodeEnter
      .on('mouseover', function (d) {
        d3.select(this).style('cursor', 'pointer');
        d3.select(this).select('circle').classed('parentHover', true);
        nodeStructures.get(d.i).targetNode.forEach(element => {
          d3.select('#circle_' + element.id).classed('childrenHover', true);
        });

        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html(d.title)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function (d) {
        d3.select(this).style('cursor', 'default');
        d3.select(this).select('circle').classed('parentHover', false);
        nodeStructures.get(d.i).targetNode.forEach(element => {
          d3.select('#circle_' + element.id).classed('childrenHover', false);
        });
        div.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .on('click', function (d) {
        if (com.currentNodeStructure) {
          d3.select('#circle_' + com.currentNodeStructure.sourceNode.id).classed('highlight', false);
        }
        com.currentNodeStructure = nodeStructures.get(d.i);
        d3.select('#circle_' + d.id).classed('highlight', true);
      });
  }
  onDetailClose(close: boolean) {
    this.d3.select('#circle_' + this.currentNodeStructure.sourceNode.id).classed('highlight', false);
    this.currentNodeStructure = null;
  }
  onSelectNodeChange(nodeStructure: NodeStructure) {
    this.d3.select('#circle_' + this.currentNodeStructure.sourceNode.id).classed('highlight', false);
    this.currentNodeStructure = nodeStructure;
    this.d3.select('#circle_' + nodeStructure.sourceNode.id).classed('highlight', true);
    let newX: number;
    let newY: number;
    this.d3.select('#circle_' + nodeStructure.sourceNode.id).each(function (d: any) {
      newX = d.x;
      newY = d.y;
    });
    const base = this;
    this.globalG = this.globalG;
    this.globalG
      .transition()
      .duration(500)
      .attr('transform', function (d: any) { return 'translate(' + (base.w / 2 - newX) + ',' + (base.h / 2 - newY) + ')'; })
      .transition()
      .delay(1500);
  }

}
