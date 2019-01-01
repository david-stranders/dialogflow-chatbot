import { Component, OnInit, Input } from '@angular/core';
import {Message} from "../../model/message";


@Component({
  selector: 'message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  @Input('message')
  message: Message = new Message('', '', '', new Date());

  constructor() { }

  ngOnInit() {
  }

}
