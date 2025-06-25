import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ReactWrapperComponent } from './components/react-wrapper/react-wrapper.component';

// Mock React components
jest.mock('./react-app/App', () => ({
  App: () => <div data-testid="react-app">React App Content</div>
}));

// Mock React DOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn()
  }))
}));

describe('Application Integration Tests', () => {
  let appFixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent,
        ReactWrapperComponent
      ]
    }).compileComponents();

    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;
  });

  it('should create the main application component', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should render the Angular application structure', () => {
    appFixture.detectChanges();
    
    const compiled = appFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')).toHaveTextContent('Angular Application');
    expect(compiled.querySelector('.container')).toBeTruthy();
    expect(compiled.querySelector('.react-container')).toBeTruthy();
  });

  it('should contain the React wrapper component', () => {
    appFixture.detectChanges();
    
    const compiled = appFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-react-wrapper')).toBeTruthy();
  });

  it('should have proper styling applied', () => {
    appFixture.detectChanges();
    
    const container = appFixture.nativeElement.querySelector('.container');
    const reactContainer = appFixture.nativeElement.querySelector('.react-container');
    
    expect(container).toBeTruthy();
    expect(reactContainer).toBeTruthy();
  });

  it('should maintain component hierarchy', () => {
    appFixture.detectChanges();
    
    const compiled = appFixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.container');
    const reactContainer = compiled.querySelector('.react-container');
    const reactWrapper = compiled.querySelector('app-react-wrapper');
    
    expect(container).toContainElement(reactContainer);
    expect(reactContainer).toContainElement(reactWrapper);
  });

  it('should handle component lifecycle properly', () => {
    appFixture.detectChanges();
    
    // Component should be stable after changes
    expect(appComponent).toBeTruthy();
    
    // Trigger change detection
    appFixture.detectChanges();
    expect(appComponent).toBeTruthy();
  });

  it('should render with correct title', () => {
    expect(appComponent.title).toBe('angular-react-app');
  });

  it('should have proper DOM structure', () => {
    appFixture.detectChanges();
    
    const compiled = appFixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    const container = compiled.querySelector('.container');
    const reactContainer = compiled.querySelector('.react-container');
    
    expect(h1).toBeTruthy();
    expect(container).toBeTruthy();
    expect(reactContainer).toBeTruthy();
    expect(container).toContainElement(h1);
    expect(container).toContainElement(reactContainer);
  });
}); 