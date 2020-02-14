import { Component } from '@angular/core';
import { ApimessageService } from './apimessage.service';

@Component({
  selector: 'app-message-apimessage',
  templateUrl: './apimessage.component.html'
})
export class ApimessageComponent {
  hoveredValue=1;
  hovered=-1;
  constructor(
    public apimessageService: ApimessageService
  ) {
  }
  ngOnInit() { }
}

