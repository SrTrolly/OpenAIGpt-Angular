import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-messages-box',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessagesBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessagesBoxComponent {

  @Input() public placeholder: string = "";
  @Input() public disableCorrections: boolean = false;

  @Output() public onMessage: EventEmitter<string> = new EventEmitter<string>();

  // private fb: FormBuilder = Inject(FormBuilder);

  public form = this.fb.group({
    prompt: ["", Validators.required],
  });
  constructor(private fb: FormBuilder) { }


  handleSubmit() {
    if (this.form.invalid) return;
    const { prompt } = this.form.value;
    console.log({ prompt });
    this.onMessage.emit(prompt ?? "");
    this.form.reset();
  }

}
