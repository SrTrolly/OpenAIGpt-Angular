import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxEvent, TextMessageBoxSelectComponent, TextMessagesBoxComponent, TypingLoaderComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '@services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessagesBoxComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  public voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);


  handleMessageWithSelect({ prompt, selectedOption }: TextMessageBoxEvent) {

    const message = `${selectedOption}- ${prompt}`;

    this.messages.update(prev => [...prev, { text: message, isGpt: false }]);
    this.isLoading.set(true);

    this.openAiService.textToAudio(prompt, selectedOption).subscribe(({ audioUrl, message }) => {
      this.isLoading.set(false);

      this.messages.update(prev => [
        ...prev,
        {
          isGpt: true,
          text: message,
          audioUrl: audioUrl
        }
      ]);
    });

  }

}
