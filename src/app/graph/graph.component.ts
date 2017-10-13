import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { BackService } from '../provider/back.service';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  start: any;
  end: any;
  personaje: string;
  hecho: string;
  lugar: string;
  nodes = [];
  links = [];


  name;
  svg;
  color;
  simulation;
  link;
  node;
  zoom;
  radius;
  g;
  arrow;
  path;
  edgelabels;
  edgepath;

  constructor(private backservice: BackService, private fb: FormBuilder) {
  }

  ngOnInit() {

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

    this.link
      .attr('d', function (d) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });

    this.edgepath.attr('d', function (d) {
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    this.edgelabels.attr('transform', function (d) {
      if (d.target.x < d.source.x) {
        const bbox = this.getBBox();

        const rx = bbox.x + bbox.width / 2;
        const ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      } else { return 'rotate(0)'; }
    });
  }



  render(links, nodes) {

    d3.select('svg').remove();
    this.svg = d3.select('body').append('svg').attr('width', '1500').attr('height', '800');
    this.svg = d3.select('svg');

    const width = +this.svg.attr('width');
    const height = +this.svg.attr('height');
    this.color = d3.scaleOrdinal(d3.schemeCategory20);
    this.radius = 8;

    this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(function (d) { return d.name; }).distance(200))
      .force('charge_force', d3.forceManyBody().strength(-90))
      .force('center_force', d3.forceCenter(width / 2, height / 2));


    this.g = this.svg.append('g')
      .attr('class', 'everything');

    this.link = this.g.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .style('stroke', this.linkColour)
      .attr('class', function (d) { return 'link ' + d.type; })
      .attr('marker-end', function (d) { return 'url(#' + d.type + ')'; });


    this.node = this.g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', this.radius)
      // .attr('fill', (d) => { return this.color(d.group); })
      .attr('fill', this.circleColour)
      .call(d3.drag()
        .on('start', (d) => { return this.drag_start(d) })
        .on('drag', (d) => { return this.drag_drag(d) })
        .on('end', (d) => { return this.drag_end(d) }));

    this.name = this.g.append('g')
      .attr('class', 'text')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('font-size', '10px')
      .attr('font', 'sans-serif')
      .attr('pointer-events', 'none')
      .attr('text-shadow', '0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff')
      .text(function (d) { return d.name; });

    this.arrow = this.g.append('g')
      .attr('class', 'marker')
      .selectAll('marker')
      .data(['A', 'B', 'E'])
      .enter().append('marker')
      .attr('id', function (d) { return d; })
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -1.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0, -5 L 10 , 0 L 0 , 5');

    this.edgepath = this.g.append('g')
      .selectAll(".edgepath")
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'edgepath')
      .attr('id', function (d, i) { return 'edgepath' + i; })
      .style("pointer-events", "none");

    this.edgelabels = this.g.append('g')
      .selectAll("edgelabel")
      .data(links)
      .enter()
      .append('text')
      .style("pointer-events", "none")
      .attr('class', 'edgelabel')
      .attr('id', function (d, i) { return 'edgelabel' + i; })
      .attr('font-size', '15')
      .append('textPath')
      .attr('xlink:href', function (d, i) { return '#edgepath' + i })
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .text(function (d) {return 'va hacia> ' + d.target.name; });

    this.simulation.on('tick', () => { this.ticked(); });

  }


  linkColour(d) {
    if (d.type == 'B') {
      return 'red';
    }
    if (d.type == 'A') {
      return 'blue';
    }
    if (d.type == 'E') {
      return 'green';
    }
  }

  circleColour(d) {
    if (d.group == '0') {
      return 'blue';
    }
    if (d.group == '1') {
      return 'red';
    }
    if (d.group == '2') {
      return 'green';
    }
    if (d.group == '3') {
      return 'yellow';
    }
    if (d.group == '4') {
      return 'black';
    }
    if (d.group == '5') {
      return 'cyan';
    }
    if (d.group == '6') {
      return 'pink';
    }

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

  filter() {
    this.backservice.getNodos().then((nod) => {
      this.nodes = nod;
      this.backservice.getEnlaces().then((enl) => {
        this.links = enl; this.render(this.links, this.nodes);
      });

    })

  }

  clean() {
    this.backservice.getNodos2().then((nod) => {
      this.nodes = nod;
      this.backservice.getEnlaces2().then((enl) => {
        this.links = enl; this.render(this.links, this.nodes);
      });

    })

  }

}
