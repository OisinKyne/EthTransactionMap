import { Component, OnInit, Input } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import * as shape from 'd3-shape';
import { Transaction } from '../models/transaction.model';
import { RetrieveTransactionsService } from '../services/retrieve-transactions.service';

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
  select: any;
  curve: any = shape.curveStep; // or some other function from d3-shape
  force: any = forceSimulation<any>()
    .force('charge', forceManyBody())
    .force('collide', forceCollide(30))
    .force('x', forceX())
    .force('y', forceY());


  ngOnInit() {
   
  }

  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = colorSets.find(s => s.name === name);
  }


}
