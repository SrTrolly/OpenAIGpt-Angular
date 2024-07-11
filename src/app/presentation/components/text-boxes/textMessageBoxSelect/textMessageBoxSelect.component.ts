import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Option {
  id: string;
  text: string
}

export interface TextMessageBoxEvent {
  prompt: string;
  selectedOption: string
}

@Component({
  selector: 'app-text-message-box-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageBoxSelect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxSelectComponent {

  @Input() public placeholder: string = "";
  @Input({ required: true }) options: Option[] = []


  @Output() public onMessage: EventEmitter<TextMessageBoxEvent> = new EventEmitter<TextMessageBoxEvent>();

  // private fb: FormBuilder = Inject(FormBuilder);

  public form = this.fb.group({
    prompt: ["", Validators.required],
    selectedOption: ["", Validators.required],
  });
  constructor(private fb: FormBuilder) { }


  handleSubmit() {
    if (this.form.invalid) return;
    const { prompt, selectedOption } = this.form.value;
    this.onMessage.emit({ prompt: prompt!, selectedOption: selectedOption! });
    this.form.reset();
  }

}
