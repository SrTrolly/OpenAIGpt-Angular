import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';


export interface TextMessageEvent {
  file: File;
  prompt?: string | null;
}

@Component({
  selector: 'app-text-messagebox-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageboxFile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxFileComponent {

  @Input() public placeholder: string = "";
  @Input() public disableCorrections: boolean = false;

  @Output() public onMessage: EventEmitter<TextMessageEvent> = new EventEmitter<TextMessageEvent>();

  // private fb: FormBuilder = Inject(FormBuilder);

  public form = this.fb.group({
    prompt: [],
    file: [null, Validators.required]
  });

  public file: File | undefined;

  constructor(private fb: FormBuilder) { }

  handleSelectedFile(event: any) {
    const file = event.target.files.item(0);
    this.form.get("file")?.setValue(file);
  }


  handleSubmit() {
    if (this.form.invalid) return;
    const { prompt, file } = this.form.value;
    this.onMessage.emit({ prompt, file: file! });
    this.form.reset();
  }

}
