import { TestBed, async } from '@angular/core/testing';
import { GraphComponent } from './graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RetrieveTransactionsService } from '../services/retrieve-transactions.service';
import { HttpHandler, HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GraphComponent
      ], imports: [NgxChartsModule],
      providers: [RetrieveTransactionsService, HttpClient, HttpHandler]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(GraphComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
});
