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
  viewportWidth: number = window.innerWidth;
  micColor = '';
  listening = false;

  constructor(readonly dialogFlowService: DialogflowService,
              readonly speechService: SpeechService) {
  }

  ngOnInit() {
    this.speechService.resultEmitter.subscribe( speechResult => {
      this.micColor = '';
      this.playSound();
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
      if (res.result && res.result.fulfillment && res.result.fulfillment && res.result.fulfillment.speech.length === 0 ) {
        res.result.fulfillment.speech = 'Voor deze vraag hebben mijn programmeurs nog geen antwoord gedefinieerd. (' +
        res.result.action + ')';
      }
      this.messages.push(
        new Message(res.result.fulfillment.speech, 'bot', 'assets/images/bot.png', res.timestamp)
      );
      this.playReplyMessage(res.result.fulfillment.speech);
    });
    this.message = '';
  }

  public toggleListening(): void {
    if (!this.listening) {
      this.playSound();
      this.listening = true;
      this.micColor = 'lightcoral';
      if (this.speechService.IsListening) {
        this.speechService.stopListening();
      } else {
        this.speechService.requestListening();
      }
    }
  }

  playReplyMessage(message: string) {
    this.speechService.requestSpeak(message);
  }

  playSound() {
    // checking for mobile device, those use native sounds on starting and stopping recording with the device's microphone
    if ((typeof window.orientation == "undefined") || (navigator.userAgent.indexOf('IEMobile') == -1)) {
      const audio = new Audio();
      if (!this.listening) {
        audio.src = "assets/sounds/start-recording.wav";
      } else {
        audio.src = "assets/sounds/end-recording.wav";
      }
      audio.volume = 0.5;
      audio.load();
      audio.play();
    }
  }

  getPlaceholder(){
    if (this.speechService.supportRecognition) {
      return 'Stel je vraag of type hem in'
    } else {
      return 'Type je vraag en druk enter'
    }
  }

  getLeft(): number {
    if(window.innerWidth >  552) {
      return (window.innerWidth / 2 + 224);
    }
    else {
      return (window.innerWidth - 40 - (0.02 * window.innerWidth));
    }
  }

  setWidth() {
    this.viewportWidth = window.innerWidth;
  }

  getColor(): string{
    return this.micColor;
  }

}
