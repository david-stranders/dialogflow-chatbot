import {Injectable, EventEmitter, NgZone} from '@angular/core';
import {RecognitionResult} from "../model/RecognitionResult";

export interface AppWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
  msSpeechRecognition: any;
  SpeechSynthesisUtterance: any;
  SpeechSynthesis: any;
}

const { webkitSpeechRecognition }: AppWindow = <AppWindow>window;
const { SpeechRecognition }: AppWindow = <AppWindow>window;
const { msSpeechRecognition }: AppWindow = <AppWindow>window;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private isListening: boolean;
  private _supportRecognition: boolean;
  private _supportSpeechUtterance: boolean;
  private speechRecognition: any;
  private messageToSpeak: any;
  private lastResult: RecognitionResult = null;

  public get IsListening(): boolean {
    return this.isListening;
  }

  public get supportRecognition(): boolean {
    return this._supportRecognition;
  }

  public resultEmitter: EventEmitter<RecognitionResult> = new EventEmitter<RecognitionResult>();

  constructor(private zone: NgZone) {
    this.init();
  }

  private init(): void {
    this._supportRecognition = true;
    if (window['SpeechRecognition']) {
      this.speechRecognition = new SpeechRecognition();
    } else if (window['webkitSpeechRecognition']) {
      this.speechRecognition = new webkitSpeechRecognition();
    } else if(window['msSpeechRecognition']){
      this.speechRecognition = new msSpeechRecognition();
    } else {
      this._supportRecognition = false;
    }

    if (window['speechSynthesis'] || window['SpeechSynthesisUtterance']) {
      this.messageToSpeak =  new SpeechSynthesisUtterance();
    } else {
      this._supportSpeechUtterance = false;
    }
  }

  private setupSpeechUtterance(message?: string) {
    this.messageToSpeak.lang = 'nl-NL';
    this.messageToSpeak.voiceURI = 'Google Nederlands';
    this.messageToSpeak.volume = 1;
    this.messageToSpeak.rate = 0.9;
    this.messageToSpeak.pitch = 1.05;
    if (message) {
      this.messageToSpeak.text = message;
    }
  }

  private setupListener() {
    this.speechRecognition.lang = 'nl-NL';
    this.speechRecognition.interimResults = false;
    this.speechRecognition.maxAlternatives = 1;

    if (!this.speechRecognition.onstart) {
      this.speechRecognition.onspeechstart = (event) => { this.handleSpeechStart(event) };
    }

    if (!this.speechRecognition.onresult) {
      this.speechRecognition.onresult = (event) => { this.handleResultevent(event) };
    }

    if (!this.speechRecognition.onend) {
      this.speechRecognition.onend = (event) => { this.handleEndEvent(event) };
    }

    if (!this.speechRecognition.onspeechend) {
      this.speechRecognition.onspeechend = (event) => {
        this.handleSpeechEndEvent(event) };
    }

    if (!this.speechRecognition.nomatch) {
      this.speechRecognition.nomatch = (event) => { this.handleNoRecognitionAvaliable(event) };
    }
  }

  handleSpeechStart(event: any) {
    this.lastResult = null;
  }

  handleNoRecognitionAvaliable(event: any) {
    console.log('no recognition');
  }

  private handleResultevent(event: any) {
    const result = event.results[0][0];
    this.lastResult = { confidence: result.confidence, transcript: result.transcript };
    this.zone.run(() => {
      this.resultEmitter.emit(this.lastResult);
    })
  }

  private handleEndEvent(event: any) {
    this.isListening = false;
    this.zone.run(() => {
      this.resultEmitter.emit(null);
    });
    this.lastResult = null;
  }

  private handleSpeechEndEvent(event: any) {
    this.isListening = false;
  }

  public requestListening() {
    this.isListening = true;
    this.setupListener();
    this.speechRecognition.start();
  }

  public stopListening() {
    this.isListening = false;
    this.speechRecognition.stop();
  }

  public cancelSpeech() {
    const speechSynthesis = window.speechSynthesis;
    speechSynthesis.cancel();
  }

  public isTalking() {
    const speechSynthesis = window.speechSynthesis;
    return speechSynthesis.speaking

  }

  public requestSpeak(message: string) {
    this.setupSpeechUtterance(message);
    const speechSynthesis = window.speechSynthesis;
    speechSynthesis.cancel();
    speechSynthesis.speak(this.messageToSpeak);
    let interval = setInterval( () => {
      if (!speechSynthesis.speaking) {
        clearInterval(interval);
      } else {
        speechSynthesis.resume();
      }
    }, 14000)
  }
}

