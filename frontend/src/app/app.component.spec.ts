import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule, MatListModule } from '@angular/material';
import { GraphComponent } from './components/graph.component';
import { RetrieveTransactionsService } from './services/retrieve-transactions.service';
import { flatten } from '@angular/compiler';
import { Transaction } from './models/transaction.model';
import { Observable, of } from 'rxjs';


describe('AppComponent', () => {
  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    const TRANSACTIONS_OBJECT: Transaction[] = [];
 
    class MockRetrieveTransactionsService { 
    
      getTransactionsFromServer(hashes: string[]): Observable<Transaction[]> {
        return of(TRANSACTIONS_OBJECT);
      }
    }

    TestBed.configureTestingModule({
      declarations: [
        AppComponent, GraphComponent
      ],
      imports: [
        BrowserModule,
        NgxGraphModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatListModule
      ], providers: [{provide: RetrieveTransactionsService, useClass:MockRetrieveTransactionsService }, HttpClient, HttpHandler]
    }).compileComponents();



  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-toolbar').querySelector('mat-toolbar-row').textContent).toContain('Ethereum Transaction Visualiser');
  }));

  it('should return false for an invalid hash given to parseHash', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.parseHash('a')).toBeFalsy();
    return;
  }));

  it('should return true for a valid hash given to parseHash', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.parseHash('0x58e5a0fc7fbc849eddc100d44e86276168a8c7baaa5604e44ba6f5eb8ba1b7eb')).toBeTruthy();
  }));
});
