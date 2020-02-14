import { Injectable } from '@angular/core';

@Injectable()
export class ApimessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  constructor() { 
    //console.log('ApimessageService constructor')
  }
  ngOnInit() {
    //console.log('ApimessageService ngOnInit')
  }
}

