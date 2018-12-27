export class Message {
  content: string;
  timestamp: Date;
  avatar: string;

  constructor(content: string, avatar: string, timestamp?: Date) {
    this.content = content;
    this.avatar = avatar;
    this.timestamp = timestamp;
  }
}
