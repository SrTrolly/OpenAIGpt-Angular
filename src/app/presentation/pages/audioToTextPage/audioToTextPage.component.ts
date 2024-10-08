import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxEvent, TextMessageBoxFileComponent, TextMessageEvent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '@services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {


  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);


  handleMessageWithFile(event: TextMessageEvent) {

    const { file, prompt } = event;

    const text = prompt ?? file.name ?? "Traduce el audio";
    this.isLoading.set(true);

    this.messages.update(prev => [...prev, { text: text, isGpt: false }]);

    this.openAiService.audioToText(file, text).subscribe(resp => this.handleResponse(resp));
  }

  private handleResponse(resp: AudioToTextResponse | null) {
    this.isLoading.set(false);

    if (!resp) return;

    const text = `## Transcripcion: 
    __Duracion:__${Math.round(resp.duration)}segundos.
    
    ##El texto es:
    ${resp.text}
    `;

    this.messages.update(prev => [...prev, { text: text, isGpt: true }]);

    for (const segment of resp.segments) {
      const segmentMessage = `
      __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundo.__
      ${segment.text}
      `;

      this.messages.update(prev => [...prev, { text: segmentMessage, isGpt: true }]);
    }


  }


}
