import { Component, OnInit, Output } from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { RetrieveTransactionsService } from './services/retrieve-transactions.service';
import { Transaction } from './models/transaction.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  // Store nodes in a set and maybe make a getter that
  // returns the array of nodes in a list like it wants
  // after the fact.
  nodes = [

  ];

  links = [

  ]

  colorSet = colorSets[0];
  curve: any = shape.curveStep; // or some other function from d3-shape

  constructor(private transactionService: RetrieveTransactionsService) {

  }

  ngOnInit() {
    console.log('OnInit started.')

    const hashes = ["0x08fc50be3221ca854c04e4aa7bc5e3dfe2d41c8839f31319cc61402d4f802878", "0x872fdc875177c6c160a3fb401b1965808b38e82ac02d1fd8ccfc1993f2c1d98f", "0xe08a29ecd285cc6f4b30dae6372aab2286247ca681be89c4db2bba0773a93724"];
    this.transactionService.getTransactionsFromServer(hashes).subscribe(data => {
      this.processTransactions(data);
    }, error => {
      console.log('Error:');
      console.log(error);
    });
  }

  processTransactions(transactions: Transaction[]): any {
    for (const transaction of transactions) {
      console.log('Transaction: ');
      console.log(transaction);
      const node = { id: transaction.toAddress, label: transaction.toAddress }
      const endNode = { id: transaction.fromAddress, label: transaction.fromAddress }
      const link = { source: transaction.toAddress, target: transaction.fromAddress }
      this.nodes.push(node)
      this.nodes.push(endNode);
      this.links.push(link);
      console.log(this.nodes);
      console.log(this.links);
    }


  }

}
