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

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function (d) { return d.id; }))
      // .force('link', d3.forceLink().distance(function(d) {return d.distance; }).strength(0.1))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

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
    this.link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke', 'gray')
      // .attr('stroke-width', function (d) { return Math.sqrt(d.value); });
      .attr('stroke-width', 1);

    this.node = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('r', 7)
      .attr('fill', (d) => { return this.color(d.group); })
      .call(d3.drag()
        .on('start', (d) => { return this.dragstarted(d) })
        .on('drag', (d) => { return this.dragged(d) })
        .on('end', (d) => { return this.dragended(d) }));

    this.name = this.svg.append('g')
      .attr('class', 'text')
      .selectAll('text')
      .data(graph.nodes)
      .enter().append('text')
      .attr('font-size', '8px')
      .attr('font', 'sans-serif')
      .attr('pointer-events', 'none')
      .text(function (d) { return d.id; });

    this.simulation
      .nodes(graph.nodes)
      .on('tick', () => { this.ticked(); });

    this.simulation.force('link')
      .links(graph.links);

    this.zoom = d3.zoom()
      .scaleExtent([1, 40])
      .translateExtent([[-100, -100], [1300 + 90, 510 + 100]])
      .on('zoom', () => {  });

  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }



  ngOnDestroy() {

  }


  ngOnChanges(changes) {


  }



}
