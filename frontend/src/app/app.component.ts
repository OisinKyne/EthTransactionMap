import { Component, OnInit, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { isNullOrUndefined, isNull } from 'util';
import { Transaction } from './models/transaction.model';
import { RetrieveTransactionsService } from './services/retrieve-transactions.service';
import { ValidateHashes } from './validators/transaction-list.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  control = new FormControl('', ValidateHashes);
  matcher = new MyErrorStateMatcher();
  title = 'app';
  view: [Number, Number] = [300, 900];
  graph = { links: [], nodes: [] };
  userHashes: string;
  inputError: boolean = false;
  hashes = [  "0x792d79af418717578dd4fae4fcc7c84c166558a985f03c841ab7a4a78d0d1237", "0xa837dc41e12ddc00d0987fa88d9f5e8c7513014369426726d5b709b5635a8290",  "0x680831ae1c6f78055519fdfae4dd0af729a7304d38ebdbc6839e348e87628e9c", "0x0f8d020dd106ef8ebf2c211e23de6f283b8fa0068d27e70d6fa5e0533e585289", "0xf052f4ceab6dc1aabfe4b6b24ae70669ad15a21e5bb656d9c60326172931699c", "0xb30bed135d8e39a08bdc5b63c315d160510845d327fc03e70bfe34b8cf0b72ba"  ];


  constructor(private transactionService: RetrieveTransactionsService, private el: ElementRef) {

  }

  ngOnInit() {
    this.transactionService.getTransactionsFromServer(this.hashes).subscribe(data => {
      console.log('Request to the server for ' + this.hashes.length + ' hashes made.')
      this.graph = this.processTransactions(data);
      console.log('Updated the graph object.');
    }, error => {
      console.log('Error:');
      console.log(error);
    });
  }

  ngAfterViewInit() {
    const width = this.el.nativeElement.offsetWidth;
    const height = this.el.nativeElement.offsetHeight
    if (!isNullOrUndefined(width) && !isNullOrUndefined(height)) {
      this.view[0] = width;
      if(height < 300) {
        this.view[1] = height+500;
      }
      else {
        this.view[1] = height+200;
      }
    }
  }

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    const width = this.el.nativeElement.offsetWidth;
    const height = this.el.nativeElement.offsetHeight
    if (!isNullOrUndefined(width) && !isNullOrUndefined(height)) {
      this.view[0] = width;
      if(height < 300) {
        this.view[1] = height+500;
      }
      else {
        this.view[1] = height+200;
      }
    }
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
    if (isNullOrUndefined(newValue)) { return false; }
    //Parse the field to see if a valid set of hashes has been supplied.
    let hashes: string[];
    try {
      hashes = this.parseCSV(newValue);
    }
    catch (e) {
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
        if (this.parseHash(cleanedHash)) {
          console.log('Invalid hash supplied: ' + cleanedHash);
          cleanedHashes.push(cleanedHash);
        }
      }
    } catch {
      console.log('Unknown error parsing CSV hashes.')
    }
    if (cleanedHashes.length === 0) {
      // Throw an error if we didn't parse a single hash.
      throw new ErrorEvent('No valid hashes supplied.');
    }
    return cleanedHashes;
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


//Error state matcher to update error state on a paste rather than just when someone clicks away.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}