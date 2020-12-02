import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cf-client-panel',
  templateUrl: './client-panel.component.html',
  styleUrls: ['./client-panel.component.scss']
})
export class ClientPanelComponent implements OnInit {

  constructor(private translate: TranslateService) { }
  breakpoint: number;
  ratio: string = '2:1';

  ngOnInit(): void {
    this.changeLayoutAndRatio(window.innerWidth);
  }

  onResize(event) {
    this.changeLayoutAndRatio(event.target.innerWidth);
  }

  private changeLayoutAndRatio(width){
    this.breakpoint = (width <= 700) ? 1 : 2;
    if(width >= 1000){
      this.ratio = '2:1';
    }
    if(width >= 700 && width <= 1000){
      this.ratio = '1:1';
    }
    if(width <= 700 && width >= 500){
      this.ratio = '2:1';
    }
    if(width <= 500){
      this.ratio = '1.1:1';
    }
  }
}
