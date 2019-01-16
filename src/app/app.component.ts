import { Component } from '@angular/core';
import {Message} from "./model/message";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public messages : Message[];


  constructor(){
    this.messages = [
      new Message('Welkom, stel een vraag', 'bot', 'assets/images/chatbot-talking.gif', new Date())
    ];
  }
}
