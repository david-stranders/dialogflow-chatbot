import {Injectable, EventEmitter, NgZone} from '@angular/core';
import {RecognitionResult} from "../model/RecognitionResult";

export interface AppWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
  msSpeechRecognition: any;
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
  private _speech: any;
  private _lastResult: RecognitionResult = null;

  public get IsListening(): boolean {
    return this._isListening;
  }

  public get SupportRecognition(): boolean {
    return this._supportRecognition;
  }

  public resultEmitter: EventEmitter<RecognitionResult> = new EventEmitter<RecognitionResult>();

  constructor(private zone: NgZone) {
    this.init();
  }

  private init(): void {
    this._supportRecognition = true;
    if (window['SpeechRecognition']) {
      this._speech = new SpeechRecognition();
    } else if (window['webkitSpeechRecognition']) {
      this._speech = new webkitSpeechRecognition();
    } else if(window['msSpeechRecognition']){
      this._speech = new msSpeechRecognition();
    } else {
      this._supportRecognition = false;
    }
  }

  private setupListener(): void {
    this._speech.lang = 'nl-NL';
    this._speech.interimResults = false; // We don't want partial results
    this._speech.maxAlternatives = 1; // By now we are interested only on the most accurate alternative

    if (!this._speech.onstart) {
      this._speech.onspeechstart = (event) => { this.handleSpeechStart(event) };
    }

    if (!this._speech.onresult) {
      this._speech.onresult = (event) => { this.handleResultevent(event) };
    }

    if (!this._speech.onend) {
      this._speech.onend = (event) => { this.handleEndEvent(event) };
    }

    if (!this._speech.onspeechend) {
      this._speech.onspeechend = (event) => {
        this.handleSpeechEndEvent(event) };
    }

    if (!this._speech.nomatch) {
      this._speech.nomatch = (event) => { this.handleNoRecognitionAvaliable(event) };
    }

  }
  handleSpeechStart(event: any): void {
    this._lastResult = null;
  }

  handleNoRecognitionAvaliable(event: any): any {
    console.log('no recognition');
  }

  private handleResultevent(event: any): void {
    const result = event.results[0][0];
    this._lastResult = { confidence: result.confidence, transcript: result.transcript };
    console.log('resultaat: ' + this._lastResult.transcript);
    this.zone.run(() => {
      this.resultEmitter.emit(this._lastResult);
    })
  }

  private handleEndEvent(event: any): void {
    this._isListening = false;
    if (!this._lastResult) {
      this.resultEmitter.emit(null);
    }
    this._lastResult = null;
  }

  private handleSpeechEndEvent(event: any): void {
    this._isListening = false;
  }

  public requestListening(): void {
    this._isListening = true;
    this.setupListener();
    this._speech.start();
  }

  public stopListening(): void {
    this._isListening = false;
    this._speech.stop();
  }
}

