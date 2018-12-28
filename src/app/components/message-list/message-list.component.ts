import {Component, Input, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {Message} from "../../model/message";
import {MessageItemComponent} from "../message-item/message-item.component";

@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements AfterViewInit{

  @Input('messages')
  messages : Message[];
  viewportHeight: number;

  @ViewChild('chatlist', { read: ElementRef }) chatList: ElementRef;
  @ViewChildren(MessageItemComponent, { read: ElementRef }) chatItems: QueryList<MessageItemComponent>;

  constructor() { }

  ngAfterViewInit() {
    this.chatItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
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
