import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {DialogflowService} from "../../services/dialogflow.service";
import {Message} from "../../model/message";
import {SpeechService} from "../../services/speech.service";


@Component({
  selector: 'message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit, AfterViewInit {

  message = '';

  @Input('messages')
  messages : Message[];
  viewportWidth: number;
  micColor = '';
  listening = false;

  constructor(readonly dialogFlowService: DialogflowService,
              readonly speechService: SpeechService) {
  }

  ngOnInit() {
    this.speechService.resultEmitter.subscribe( speechResult => {
      this.micColor = '';
      this.listening = false;
      if (speechResult && speechResult.transcript && speechResult.transcript.length > 0) {
       this.sendMessage(speechResult.transcript);
    }});
  }

  ngAfterViewInit() {
    this.viewportWidth = window.innerWidth;
  }

  public sendMessage(spokenResult?: string): void {
    if (spokenResult) {
      this.message = spokenResult;
    }
    this.messages.push(new Message(this.message, 'user', 'assets/images/user.png', new Date()));

    this.dialogFlowService.getResponse(this.message).subscribe(res => {
      this.messages.push(
        new Message(res.result.fulfillment.speech, 'bot', 'assets/images/bot.png', res.timestamp)
      );
    });
    this.message = '';
  }

  public toggleListening(): void {
    if (!this.listening) {
      this.listening = true;
      this.micColor = 'lightcoral';
      if (this.speechService.IsListening) {
        this.speechService.stopListening();
      } else {
        this.speechService.requestListening();
      }
    }
  }

  getLeft(): number {
    if(this.viewportWidth >  552) {
      return (this.viewportWidth / 2 + 224);
    }
    else {
      return (this.viewportWidth - 40 - (0.02 * this.viewportWidth));
    }
  }

  setWidth() {
    this.viewportWidth = window.innerWidth;
  }

  getColor(): string{
    return this.micColor;
  }

}
