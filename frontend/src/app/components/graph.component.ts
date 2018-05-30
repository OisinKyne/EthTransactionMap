import { Component, Input, OnInit } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import * as shape from 'd3-shape';

@Component({
  selector: 'graph-component',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {


  @Input() graph = { links: [], nodes: [] };
  selectedColorScheme = this.setColorScheme('cool');
  colorScheme: any;
  animations: true;
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


  ngOnInit() {

  }

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

// calendarTooltipText(c): string {
//   return `
//     <span class="tooltip-label">${c.label} • ${c.cell.date.toLocaleDateString()}</span>
//     <span class="tooltip-val">${c.data.toLocaleString()}</span>
//   `;
// }

// pieTooltipText({data}) {
//   const label = formatLabel(data.name);
//   const val = formatLabel(data.value);

//   return `
//     <span class="tooltip-label">${label}</span>
//     <span class="tooltip-val">$${val}</span>
//   `;
// }