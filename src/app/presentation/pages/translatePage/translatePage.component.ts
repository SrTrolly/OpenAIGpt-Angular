import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessagesBoxComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '@services/openai.service';
import { TextMessageBoxSelectComponent } from "../../components/text-boxes/textMessageBoxSelect/textMessageBoxSelect.component";

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);


  public languages = signal([
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);


  handleMessageSelect(event: TextMessageBoxEvent) {
    const { prompt, selectedOption } = event;
    const message = `Traduce a ${selectedOption}:${prompt}`;

    this.messages.update(prev => [
      ...prev,
      {
        isGpt: false,
        text: message
      }
    ]);

    this.isLoading.set(true);

    this.openAiService.translateText(prompt, selectedOption).subscribe(resp => {
      this.isLoading.set(false);
      this.messages.update(prev => [
        ...prev,
        {
          isGpt: true,
          text: resp.message
        }
      ])

    });

  }


}
