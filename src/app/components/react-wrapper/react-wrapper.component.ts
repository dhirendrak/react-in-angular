import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { App as ReactApp } from '../../react-app/App';

@Component({
  selector: 'app-react-wrapper',
  standalone: true,
  template: '<div #reactRoot></div>'
})
export class ReactWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactRoot', { static: true }) reactRoot!: ElementRef<HTMLDivElement>;
  private root: any;

  ngOnInit() {
    this.root = createRoot(this.reactRoot.nativeElement);
    this.root.render(React.createElement(ReactApp));
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
} 