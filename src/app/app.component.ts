import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactWrapperComponent } from './components/react-wrapper/react-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactWrapperComponent],
  template: `
    <div class="container">
      <h1>Angular Application</h1>
      <div class="react-container">
        <app-react-wrapper></app-react-wrapper>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .react-container {
      margin-top: 20px;
    }
  `]
})
export class AppComponent {
  title = 'angular-react-app';
} 