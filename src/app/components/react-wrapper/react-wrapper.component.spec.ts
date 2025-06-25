import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactWrapperComponent } from './react-wrapper.component';
import { createRoot } from 'react-dom/client';

// Mock React DOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn()
  }))
}));

// Mock React
jest.mock('react', () => ({
  createElement: jest.fn()
}));

describe('ReactWrapperComponent', () => {
  let component: ReactWrapperComponent;
  let fixture: ComponentFixture<ReactWrapperComponent>;
  let mockRoot: any;

  beforeEach(async () => {
    mockRoot = {
      render: jest.fn(),
      unmount: jest.fn()
    };
    (createRoot as jest.Mock).mockReturnValue(mockRoot);

    await TestBed.configureTestingModule({
      imports: [ReactWrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have reactRoot ViewChild', () => {
    expect(component.reactRoot).toBeDefined();
  });

  it('should create React root on ngOnInit', () => {
    const mockElement = document.createElement('div');
    component.reactRoot = { nativeElement: mockElement };
    
    component.ngOnInit();
    
    expect(createRoot).toHaveBeenCalledWith(mockElement);
    expect(mockRoot.render).toHaveBeenCalled();
  });

  it('should unmount React root on ngOnDestroy', () => {
    component.root = mockRoot;
    
    component.ngOnDestroy();
    
    expect(mockRoot.unmount).toHaveBeenCalled();
  });

  it('should not unmount if root is not defined', () => {
    component.root = null;
    
    expect(() => component.ngOnDestroy()).not.toThrow();
    expect(mockRoot.unmount).not.toHaveBeenCalled();
  });

  it('should render template with reactRoot div', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const reactRootDiv = compiled.querySelector('#reactRoot');
    expect(reactRootDiv).toBeTruthy();
  });
}); 