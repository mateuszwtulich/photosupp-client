import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cf-manager-panel',
  templateUrl: './manager-panel.component.html',
  styleUrls: ['./manager-panel.component.scss']
})
export class ManagerPanelComponent implements OnInit {
  breakpoint: number;
  ratio: string = '2:1';

  constructor() { }

  ngOnInit(): void {
    this.changeLayoutAndRatio(window.innerWidth);
  }

  onResize(event) {
    this.changeLayoutAndRatio(event.target.innerWidth);
  }

  private changeLayoutAndRatio(width) {
    this.breakpoint = (width <= 700) ? 1 : 2;
    if (width >= 1000) {
      this.ratio = '2:1';
    }
    if (width >= 700 && width <= 1000) {
      this.ratio = '1:1';
    }
    if (width <= 700 && width >= 500) {
      this.ratio = '2:1';
    }
    if (width <= 500) {
      this.ratio = '1:1';
    }
  }
}
