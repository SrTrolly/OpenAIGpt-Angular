import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, GptMessageOrthographyComponent, MyMessageComponent, TextMessageBoxEvent, TextMessageBoxFileComponent, TextMessageBoxSelectComponent, TextMessageEvent, TextMessagesBoxComponent, TypingLoaderComponent } from '@components/index';

import { Message } from '@interfaces/message.interface';
import { OrthographyReponse } from '@interfaces/orthography.response';
import { OpenAiService } from '@services/openai.service';



@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    GptMessageOrthographyComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxSelectComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [
      ...prev,
      {
        isGpt: false,
        text: prompt
      }
    ]);

    this.openAiService.checkOrthography(prompt).subscribe(resp => {
      this.isLoading.set(false);
      const { ok, ...resto } = resp;
      const data = resto as OrthographyReponse
      this.messages.update(prev => [
        ...prev,
        {
          isGpt: true,
          text: resp.message,
          info: data,
        }
      ]);
    });


  }


}
