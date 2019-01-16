import { Component, OnInit, Input } from '@angular/core';
import {Message} from "../../model/message";
import {SpeechService} from "../../services/speech.service";


@Component({
  selector: 'message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  @Input() imageSource: string;
  @Input('message')
  message: Message = new Message('', '', '', new Date());

  constructor(readonly speechService: SpeechService) { }

  ngOnInit() {
  }

  cancelSpeech(){
    this.speechService.cancelSpeech();
  }

}
