import { Component, OnInit } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import * as shape from 'd3-shape';
import { Transaction } from './models/transaction.model';
import { RetrieveTransactionsService } from './services/retrieve-transactions.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  graph = { links: [], nodes: [] };
  userHashes: string;
  inputError: boolean = false;
  hashes = ["0x08fc50be3221ca854c04e4aa7bc5e3dfe2d41c8839f31319cc61402d4f802878", "0x872fdc875177c6c160a3fb401b1965808b38e82ac02d1fd8ccfc1993f2c1d98f", "0xe08a29ecd285cc6f4b30dae6372aab2286247ca681be89c4db2bba0773a93724", "0xa668e5476a5f06da7c36fa60ec70b6112cd67163bbb8d2fbe1aaeb5576b989d5", "0xf86327c88683baf6c539b4d64ab6f7d98af3ae9da0e4acc430252eba1fbb05ee"];

  
  constructor(private transactionService: RetrieveTransactionsService) {

  }

  ngOnInit() {

  }

  processTransactions(transactions: Transaction[]): any {
    const nodesMap = new Map<string, any>();
    const links = [];
    for (const transaction of transactions) {
      const node = { value: transaction.toAddress }
      nodesMap[transaction.toAddress] = node;
      const endnode = { value: transaction.fromAddress }
      nodesMap[transaction.fromAddress] = endnode;
      const link = { source: transaction.fromAddress, target: transaction.toAddress }
      links.push(link);
    }

    const nodes = Object.values(nodesMap);
    return { links, nodes }
  }

  userInputUpdated(newValue: any): any {
    this.inputError = false;
    //Parse the field to see if a valid set of hashes has been supplied.
    let hashes: string[];
    try {
      const csv = this.parseCSV(newValue);
      // const json = this.parseJSON(newValue);
      if (csv !== null) {
        hashes = csv;
      } // else if (json !== null) {
      //   hashes = csv;
      // }
      else {
        //Not valid input. Alert and return
        return false;
      }
    }
    catch (e) {
      console.log('Exception thrown parsing: ' + newValue)
      console.log(e);
      this.inputError = true;
      console.log('this.input error: ' + this.inputError)
      return false;
    }
    // Remove duplicate hashes
    hashes = Array.from(new Set(hashes));

    // Check if the inputted values evaluate to something other than the current hashes.
    // If they are different, run the transaction service on the new hashes.
    if (this.checkIfUpdated(hashes)) {

      // Now pass them to the transaction service.
      this.transactionService.getTransactionsFromServer(this.hashes).subscribe(data => {
        console.log('Request to the server for ' + this.hashes.length + ' hashes made.')
        this.graph = this.processTransactions(data);
        console.log('Updated the graph object.');
      }, error => {
        console.log('Error:');
        console.log(error);
      });
    }

  }

  parseCSV(input: string): string[] {
    const cleanedHashes: string[] = [];
    try {
      // Need CSV splitter here and another helper to verify that hashes are the correct format.
      const hashes = input.split(',');
      for (const hash of hashes) {
        const cleanedHash = hash.replace(/[\W_]+/g, "");
        if (!this.parseHash(cleanedHash)) {
          console.log('Invalid hash supplied: ' + cleanedHash);
        }
        else {
          cleanedHashes.push(cleanedHash);
        }
      }
    } catch {
      console.log('Unknown error parsing CSV hashes.')
    }
    if(cleanedHashes.length === 0) {
      // Throw an error if we didn't parse a single hash.
      throw new ErrorEvent('No valid hashes supplied.');
    }
    return cleanedHashes;
  }

  parseJSON(input: string): string[] {
    try {
      const inputjson = JSON.parse(input);
      return inputjson.hashes;
    }
    catch{
      console.log('Failed to parse the given input as valid JSON');
      return null;
    }
  }

  //Function to verify that a given item is a valid transaction hash. 
  parseHash(input: string): boolean {
    const hexRegEx = new RegExp(/0[xX][0-9A-Fa-f]{64}/);
    return hexRegEx.test(input);
  }

  // Checks if a list of hashes are different to the saved ones in this component. 
  checkIfUpdated(input: string[]): boolean {
    if (this.hashes === null && input !== null) {
      this.hashes = input;
      return true;
    } else if (this.hashes.length !== input.length) {
      this.hashes = input;
      return true;
    }
    else {
      //Loop through both arrays comparing each to the other and make sure there's at least one copy of each hash.
      for (const currhash of this.hashes) {
        let found: boolean = false;
        for (const newhash of input) {
          if (newhash === currhash) {
            found = true;
          }
        }
        if (found !== true) {
          //We have an item in our current list that isn't in the new one, these lists must be different.
          this.hashes = input;
          return true;
        }
      }
    }
    return false;
  }
}
