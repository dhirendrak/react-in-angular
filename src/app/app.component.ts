import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactWrapperComponent, ReactCommunicationService } from './components/react-wrapper/react-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactWrapperComponent],
  template: `
    <div class="container">
      <h1>Angular Application</h1>
      <div class="focus-buttons">
        <button (click)="focusNameField()" class="focus-button">Focus Name Field</button>
        <button (click)="focusDescriptionField()" class="focus-button">Focus Description</button>
        <button (click)="focusObjectivesField()" class="focus-button">Focus Objectives</button>
        <button (click)="focusSectionField()" class="focus-button">Focus Section</button>
      </div>
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
    .focus-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .focus-button {
      padding: 8px 16px;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .focus-button:hover {
      background-color: #303f9f;
    }
  `]
})
export class AppComponent {
  title = 'angular-react-app';

  constructor(private reactCommunicationService: ReactCommunicationService) {}

  focusNameField() {
    this.reactCommunicationService.focusElement('root_name');
  }

  focusDescriptionField() {
    this.reactCommunicationService.focusElement('root_description');
  }

  focusObjectivesField() {
    this.reactCommunicationService.focusElement('root_objectives');
  }

  focusSectionField() {
    this.reactCommunicationService.focusElement('root_sections');
  }
}