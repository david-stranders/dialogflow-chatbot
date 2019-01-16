import {Component, Input, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {Message} from "../../model/message";
import {MessageItemComponent} from "../message-item/message-item.component";
import {SpeechService} from "../../services/speech.service";

@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements AfterViewInit{

  imageTalking = 'assets/images/chatbot-talking.gif';
  imageNotTalking = 'assets/images/chatbot-not-talking.gif';

  @Input('messages')
  messages : Message[];
  viewportHeight: number;

  @ViewChild('chatlist', { read: ElementRef }) chatList: ElementRef;
  @ViewChildren(MessageItemComponent, { read: ElementRef }) chatItems: QueryList<MessageItemComponent>;

  constructor(readonly speechService: SpeechService) { }

  ngAfterViewInit() {
    this.chatItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  getImageSource(): string {
    return this.speechService.isTalking() ? this.imageTalking : this.imageNotTalking;
  }

  private scrollToBottom(): void {
    try {
      this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight;
    }
    catch (err) {
      console.log('Could not find the "chatList" element.');
    }
  }

  getHeigth(): number{
    this.viewportHeight = window.innerHeight;
    return (this.viewportHeight - 82);
  }

  setHeight(event) {
    this.viewportHeight = event.target.innerHeight;
  }

}
