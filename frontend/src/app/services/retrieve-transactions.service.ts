import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RetrieveTransactionsService {
    backendUrl: string = '/api/graph'

    constructor(private httpClient: HttpClient) {

    }
    getTransactionsFromServer(hashesList: String[]): Observable<Transaction[]>{
        const hashDict = {hashes: hashesList}
        return this.httpClient.post<Transaction[]>(this.backendUrl, hashDict);
    }
}