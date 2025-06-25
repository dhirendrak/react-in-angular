import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ReactWrapperComponent } from './components/react-wrapper/react-wrapper.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent,
        ReactWrapperComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'angular-react-app'`, () => {
    expect(component.title).toEqual('angular-react-app');
  });

  it('should render title in h1', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1Element = compiled.querySelector('h1');
    expect(h1Element?.textContent).toContain('Angular Application');
  });

  it('should contain react-wrapper component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const reactWrapper = compiled.querySelector('app-react-wrapper');
    expect(reactWrapper).toBeTruthy();
  });

  it('should have proper container styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.container');
    expect(container).toBeTruthy();
  });

  it('should have react-container div', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const reactContainer = compiled.querySelector('.react-container');
    expect(reactContainer).toBeTruthy();
  });
}); 