import { Component, OnInit, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { BackService } from '../provider/back.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  start: any = '';
  end: any = '';
  personaje = '';
  hecho = '';
  lugar = '';
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

  constructor(private backservice: BackService, private fb: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) {
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
      .attr('x', function (d) { return d.x + 20; })
      .attr('y', function (d) { return d.y + 1; });

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
    //this.color = d3.scaleOrdinal(d3.schemeCategory20);
    this.radius = 20;

    this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(function (d) { return d.title; }).distance(350))
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
      .attr('class', function (d) { return 'link ' + d.category; })
      .attr('marker-end', function (d) { return 'url(#' + d.category + ')'; });


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
      .attr('font-size', '15px')
      .attr('font', 'sans-serif')
      .attr('cursor', 'pointer')
      //.attr('pointer-events', 'none')
      .attr('text-shadow', '0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff')
      .text(function (d) { return d.title; })
      .on('click', function (d) { window.open('https://en.wikipedia.org/wiki/' + d.title); });

    this.arrow = this.g.append('g')
      .attr('class', 'marker')
      .selectAll('marker')
      .data(['People', 'Place', 'Fact'])
      .enter().append('marker')
      .attr('id', function (d) { return d; })
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', -1.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .attr('fill', this.arrowColour)
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
      .text(this.labelLink);
    // .text(function (d) { return 'va hacia> ' + d.target.name; });

    this.simulation.on('tick', () => { this.ticked(); });
    this.spinnerService.hide();
  }


  labelLink(d) {
    if (d.category === 'People') {
      return 'tiene relacion con esta persona';
    }
    if (d.category === 'Place') {
      return 'tiene relacion con este lugar';
    }
    if (d.category === 'Fact') {
      return 'tiene relacion con este hecho';
    }

  }


  linkColour(d) {
    if (d.category === 'People') {
      return '#3498db';
    }
    if (d.category === 'Place') {
      return '#e74c3c';
    }
    if (d.category === 'Fact') {
      return '#e67e22';
    }
  }

  arrowColour(d) {
    if (d === 'People') {
      return '#3498db';
    }
    if (d === 'Place') {
      return '#e74c3c';
    }
    if (d === 'Fact') {
      return '#e67e22';
    }
  }

  circleColour(d) {
    if (d.category === 'People') {
      return '#2980b9';
    }
    if (d.category === 'Place') {
      return '#C0392b';
    }
    if (d.category === 'Fact') {
      return '#D35400';
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

    this.spinnerService.show();
    if ((this.start === '' || this.start === null) && (this.end === '' || this.end === null)) {
      console.log('no hay fechas, consulta sin fechas');

      let miLugar = '';
      let miPersona = '';
      let miHecho = '';

      if (this.lugar === '') {
        miLugar = 'ABCDEFGHAAAA';
      } else {
        miLugar = this.lugar;
      }

      if (this.personaje === '') {
        miPersona = 'ABCDEFGHAAAA';
      } else {
        miPersona = this.personaje;
      }

      if (this.hecho === '') {
        miHecho = 'ABCDEFGHAAAA';
      } else {
        miHecho = this.hecho;
      }

      this.backservice.getNodos(miPersona, miLugar, miHecho).then((nod) => {
        this.nodes = nod;
        this.backservice.getEnlaces(miPersona, miLugar, miHecho).then((enl) => {
          this.links = enl; this.render(this.links, this.nodes);
        });

      });
    } else {
      console.log('consulta con fechas');
      if (this.start === '' || this.start === null || this.end === '' || this.end === null) {
        console.log('es con fechas pero falta alguna');
        alert('El rango de fecha debe tener una fecha inicial y final');
      } else {
        console.log('es con fechas, perfecto, están las dos');
        if (this.start._i.year > this.end._i.year) {
          alert('1. Fecha inicial no puede ser mayor a fecha final');
        } else {
          if (this.personaje === '' || this.personaje === null && this.hecho === '' || this.hecho === null && this.lugar === '' || this.lugar === null) {
            alert('El rango de fechas es correcto, por favor ingrese un parámetro de busqueda');
          } else {

            let miLugar = '';
            let miPersona = '';
            let miHecho = '';

            if (this.lugar === '') {
              miLugar = 'ABCDEFGHAAAA';
            } else {
              miLugar = this.lugar;
            }

            if (this.personaje === '') {
              miPersona = 'ABCDEFGHAAAA';
            } else {
              miPersona = this.personaje;
            }

            if (this.hecho === '') {
              miHecho = 'ABCDEFGHAAAA';
            } else {
              miHecho = this.hecho;
            }

            this.backservice.getNodosConFechas(this.personaje, this.lugar, this.hecho, this.start._i.year, this.end._i.year).then((nod) => {
              this.nodes = nod;
              this.backservice.getEnlacesConFechas(this.personaje, this.lugar, this.hecho, this.start._i.year, this.end._i.year).then((enl) => {
                this.links = enl; this.render(this.links, this.nodes);
              });
            });
          }
        }
      }
    }



  }

  clean() {
    this.personaje = '';
    this.hecho = '';
    this.lugar = '';
    this.start = '';
    this.end = '';
    this.links = [];
    this.nodes = [];
    this.render(this.links, this.nodes);
  }


}
