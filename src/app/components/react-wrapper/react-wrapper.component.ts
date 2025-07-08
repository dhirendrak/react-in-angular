import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Injectable } from '@angular/core';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { App as ReactApp } from '../../react-app/App';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactCommunicationService {
  private focusFormElementSubject = new Subject<string>();
  focusFormElement$ = this.focusFormElementSubject.asObservable();

  focusElement(elementId: string) {
    this.focusFormElementSubject.next(elementId);
  }
}

@Component({
  selector: 'app-react-wrapper',
  standalone: true,
  template: '<div #reactRoot></div>'
})
export class ReactWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactRoot', { static: true }) reactRoot!: ElementRef<HTMLDivElement>;
  private root: any;

  constructor(private reactCommunicationService: ReactCommunicationService) { }

  ngOnInit() {
    this.root = createRoot(this.reactRoot.nativeElement);
    this.root.render(React.createElement(ReactApp, {
      focusElementObservable: this.reactCommunicationService.focusFormElement$
    }))
  };

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}