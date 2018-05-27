import { TestBed, inject } from '@angular/core/testing';

import { RetrieveTransactionsService } from './retrieve-transactions.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RetrieveTransactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrieveTransactionsService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([RetrieveTransactionsService], (service: RetrieveTransactionsService) => {
    expect(service).toBeTruthy();
  }));
});
