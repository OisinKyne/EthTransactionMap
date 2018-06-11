import { Component, Input, OnInit, ElementRef, AfterViewInit, HostListener, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import * as shape from 'd3-shape';
import { Observable } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'graph-component',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GraphComponent {


  @Input() inputView: any = undefined;
  @Input() graph = { links: [], nodes: [] };
  selectedColorScheme = this.setColorScheme('cool');
  colorScheme: any;
  animations: any = true;
  view: any;
  tooltipDisabled: any;
  showLegend: any;
  legendTitle: any;
  onLegendLabelClick: any;


  curve: any = shape.curveStep; // or some other function from d3-shape
  force: any = forceSimulation<any>()
    .force('charge', forceManyBody())
    .force('collide', forceCollide(50))
    .force('x', forceX())
    .force('y', forceY());


  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = colorSets.find(s => s.name === name);
  }

  select(event: any) {
    console.log('Select called.');
    console.log(event);
    window.open("https://etherscan.io/address/" + event.name, "_blank");
  }

}
