import { Component, OnInit, OnChanges, Input, Inject, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { StatsBarChart } from '../../assets/data';
import { miserables } from '../../assets/miserables';


@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css']
})
export class GraphComponentComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  el: any;
  @Input()
  data: any;

  name;
  svg;
  color;
  simulation;
  link;
  node;
  zoom;
  radius;
  g;


  constructor( @Inject(ElementRef) elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.svg = d3.select('svg');

    const width = +this.svg.attr('width');
    const height = +this.svg.attr('height');
    this.color = d3.scaleOrdinal(d3.schemeCategory20);
    this.radius = 8;

    this.simulation = d3.forceSimulation(miserables.nodes)
      .force('links', d3.forceLink(miserables.links).id(function (d) { return d.id; }))
      .force('charge_force', d3.forceManyBody().strength(-100))
      .force('center_force', d3.forceCenter(width / 2, height / 2));

    this.render(miserables);
  }

  ticked() {
    this.link
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });

    this.node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });

    this.name
      .attr('x', function (d) { return d.x; })
      .attr('y', function (d) { return d.y; });
  }

  render(graph) {
    this.g = this.svg.append('g')
      .attr('class', 'everything');

    this.link = this.g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .style('stroke', 'gray');

    this.node = this.g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', this.radius)
      .attr('fill', (d) => { return this.color(d.group); })
      .call(d3.drag()
        .on('start', (d) => { return this.drag_start(d) })
        .on('drag', (d) => { return this.drag_drag(d) })
        .on('end', (d) => { return this.drag_end(d) }));

    this.name = this.g.append('g')
      .attr('class', 'text')
      .selectAll('text')
      .data(graph.nodes)
      .enter().append('text')
      .attr('font-size', '8px')
      .attr('font', 'sans-serif')
      .attr('pointer-events', 'none')
      .text(function (d) { return d.id; });


    this.simulation.on('tick', () => { this.ticked(); });


  }



  drag_drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  drag_end(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  drag_start(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }



  ngOnDestroy() {

  }


  ngOnChanges(changes) {


  }



}
