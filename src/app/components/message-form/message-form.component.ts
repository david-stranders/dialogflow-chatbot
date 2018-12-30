import {Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import {DialogflowService} from "../../services/dialogflow.service";
import {Message} from "../../model/message";
import {SpeechService} from "../../services/speech.service";


@Component({
  selector: 'message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {

  message = '';

  @Input('messages')
  messages : Message[];

  constructor(readonly dialogFlowService: DialogflowService,
              readonly speechService: SpeechService) {
  }

  ngOnInit() {
    this.speechService.resultEmitter.subscribe( speechResult => {
      if (speechResult && speechResult.transcript && speechResult.transcript.length > 0) {
       this.sendMessage(speechResult.transcript);
    }});
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
    if (this.speechService.IsListening) {
      this.speechService.stopListening();
    } else {
      this.speechService.requestListening();
    }
  }

}
