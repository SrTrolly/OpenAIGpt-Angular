import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { ProsConsResponse } from '@interfaces/pros-cons.response';
import { OpenAiService } from '@services/openai.service';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent
  ],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent {

  // public messages = signal<Message[]>([{ text: "Hola Mundo", isGpt: false }]);
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

    this.openAiService.prosConsDiscusser(prompt).subscribe(resp => {
      this.isLoading.set(false);
      const { ok, ...resto } = resp;
      const data = resto as ProsConsResponse;

      this.messages.update(prev => [
        ...prev,
        {
          isGpt: true,
          text: data.content,
        }
      ]);

    });


  }



}
