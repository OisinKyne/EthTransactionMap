import { TestBed, inject } from '@angular/core/testing';

import { RetrieveTransactionsService } from './retrieve-transactions.service';

describe('RetrieveTransactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrieveTransactionsService]
    });
  });

  it('should be created', inject([RetrieveTransactionsService], (service: RetrieveTransactionsService) => {
    expect(service).toBeTruthy();
  }));
});
