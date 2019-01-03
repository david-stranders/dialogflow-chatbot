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

  private _isListening: boolean;
  private _supportRecognition: boolean;
  private _supportSpeechUtterance: boolean;
  private _speechRecognition: any;
  private _messageToSpeak: any;
  private _lastResult: RecognitionResult = null;

  public get IsListening(): boolean {
    return this._isListening;
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
      this._speechRecognition = new SpeechRecognition();
    } else if (window['webkitSpeechRecognition']) {
      this._speechRecognition = new webkitSpeechRecognition();
    } else if(window['msSpeechRecognition']){
      this._speechRecognition = new msSpeechRecognition();
    } else {
      this._supportRecognition = false;
    }

    if (window['speechSynthesis'] || window['SpeechSynthesisUtterance']) {
      this._messageToSpeak =  new SpeechSynthesisUtterance();
    } else {
      this._supportSpeechUtterance = false;
    }
  }

  private setupSpeechUtterance(message?: string) {
    this._messageToSpeak.lang = 'nl-NL';
    this._messageToSpeak.voiceURI = 'Google Nederlands';
    this._messageToSpeak.volume = 1;
    this._messageToSpeak.rate = 0.8;
    this._messageToSpeak.pitch = 1;
    if (message) {
      this._messageToSpeak.text = message;
    }
  }

  private setupListener() {
    this._speechRecognition.lang = 'nl-NL';
    this._speechRecognition.interimResults = false; // We don't want partial results
    this._speechRecognition.maxAlternatives = 1; // By now we are interested only on the most accurate alternative

    if (!this._speechRecognition.onstart) {
      this._speechRecognition.onspeechstart = (event) => { this.handleSpeechStart(event) };
    }

    if (!this._speechRecognition.onresult) {
      this._speechRecognition.onresult = (event) => { this.handleResultevent(event) };
    }

    if (!this._speechRecognition.onend) {
      this._speechRecognition.onend = (event) => { this.handleEndEvent(event) };
    }

    if (!this._speechRecognition.onspeechend) {
      this._speechRecognition.onspeechend = (event) => {
        this.handleSpeechEndEvent(event) };
    }

    if (!this._speechRecognition.nomatch) {
      this._speechRecognition.nomatch = (event) => { this.handleNoRecognitionAvaliable(event) };
    }

  }
  handleSpeechStart(event: any) {
    this._lastResult = null;
  }

  handleNoRecognitionAvaliable(event: any) {
    console.log('no recognition');
  }

  private handleResultevent(event: any) {
    const result = event.results[0][0];
    this._lastResult = { confidence: result.confidence, transcript: result.transcript };
    this.zone.run(() => {
      this.resultEmitter.emit(this._lastResult);
    })
  }

  private handleEndEvent(event: any) {
    this._isListening = false;
    this.zone.run(() => {
      this.resultEmitter.emit(null);
    });
    this._lastResult = null;
  }

  private handleSpeechEndEvent(event: any) {
    this._isListening = false;
  }

  public requestListening() {
    this._isListening = true;
    this.setupListener();
    this._speechRecognition.start();
  }

  public stopListening() {
    this._isListening = false;
    this._speechRecognition.stop();
  }

  public requestSpeak(message: string) {
    this.setupSpeechUtterance(message);
    window.speechSynthesis.speak(this._messageToSpeak);
  }
}

