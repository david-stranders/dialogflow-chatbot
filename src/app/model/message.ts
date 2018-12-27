export class Message {
  content: string;
  sentBy: string;
  timestamp: Date;
  avatar: string;

  constructor(content: string, sentBy: string,  avatar: string, timestamp?: Date) {
    this.content = content;
    this.sentBy = sentBy;
    this.avatar = avatar;
    this.timestamp = timestamp;
  }
}
