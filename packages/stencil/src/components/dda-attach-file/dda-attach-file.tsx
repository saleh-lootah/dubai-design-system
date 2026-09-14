import { Component, Prop, State, h, Host } from '@stencil/core';
import pdfIcon from '../../assets/img/icn/icn-PDF.svg';
import pptIcon from '../../assets/img/icn/icn-PowerPoint.svg';
import wordIcon from '../../assets/img/icn/icn-Word.svg';
import excelIcon from '../../assets/img/icn/icn-Excel.svg';
import imageIcon from '../../assets/img/icn/icn-Image.svg';
import videoIcon from '../../assets/img/icn/icn-Video.svg';
import onenoteIcon from '../../assets/img/icn/icn-OneNote.svg';
import { uniqueId } from '../../utils/unique-id';

@Component({
  tag: 'dda-attach-file',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaAttachFile {
  /** Label text shown above the field. Linked to the file input through `input_id` (or a generated id). */
  @Prop() label: string;
  /** Helper text shown below the field. Linked by `aria-describedby`. */
  @Prop() helper_text: string;
  /** Error text shown below the field. Also sets `aria-invalid="true"` on the file input. */
  @Prop() error_message: string;
  /** Size: `default` or `small`. */
  @Prop() size?: string;
  /** Validation state: `error` applies the error colors. */
  @Prop() validation_type?: string;
  /** Adds the class `dda-input-<value>`. `disabled` gives the disabled look only; it does not disable the file input. */
  @Prop() input_type?: string;
  @State() file: File | null = null;
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** Accessible name of the file input. Not rendered when empty. */
  @Prop() aria_label?: string = '';
  /** Accessible name of the remove button shown after a file is chosen, e.g. `Remove file`. */
  @Prop() button_aria_label?: string = '';
  /** `id` of the file input. Also used to link the label, helper text and error message. Optional: an id is generated when it is not set. */
  @Prop() input_id: string;
  /** `id` of the remove button shown after a file is chosen. */
  @Prop() button_id: string;
  /** `name` of the remove button shown after a file is chosen. */
  @Prop() button_name?: string;
  /** `name` of the file input. */
  @Prop() input_name?: string;

  private fileIcons = {
    pdf: pdfIcon,
    pptx: pptIcon,
    docx: wordIcon,
    xlsx: excelIcon,
    png: imageIcon,
    jpg: imageIcon,
    jpeg: imageIcon,
    mp4: videoIcon,
    mkv: videoIcon,
    one: onenoteIcon,
  };

  handleFileInput(event) {
    const files = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
    } else {
      this.file = null;
    }
  }

  removeFile() {
    this.file = null;
    // The file input stays in the DOM (so a native form submit sends the
    // file), so clear it too, or the removed file would still be submitted.
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }

  getFileIcon(fileName: string) {
    const extension = fileName.split('.').pop().toLowerCase();
    return this.fileIcons[extension] || 'path/to/default-icon.png';
  }

  private fileInput?: HTMLInputElement;

  // Per-instance fallback, so the labels, helper and error text stay linked
  // to the file input when the consumer omits input_id.
  private readonly fallbackId = uniqueId('dda-attach-file');

  // F-016: ids derived from the file input id (the consumer-supplied
  // input_id, or the generated fallback), same pattern as dda-input.
  private get inputId(): string {
    return this.input_id || this.fallbackId;
  }

  private get helperId(): string {
    return `${this.inputId}-helper`;
  }

  private get errorId(): string {
    return `${this.inputId}-error`;
  }

  private get describedBy(): string | undefined {
    const ids = [
      this.helper_text ? this.helperId : undefined,
      this.error_message ? this.errorId : undefined,
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }

  render() {
    const inputClass = [
      'dda-input-container',
      this.validation_type ? `dda-validation-${this.validation_type}` : '',
      this.size ? `dda-input-size-${this.size}` : '',
      this.input_type ? `dda-input-${this.input_type}` : '',
      this.custom_class,
      this.component_mode,
    ].filter(Boolean).join(' ');
    const id = this.inputId;

    return (
      <Host>
        <div class={inputClass}>
          {this.label && <label htmlFor={id} class="dda-input-label">{this.label}</label>}
          <div class="dda-input-field-group dda-attach-file">
            {/*
              WCAG 2.1.1 / 4.1.2: the native file input used to sit inside the
              "Choose File" label with display:none, so it was out of the tab
              order and the accessibility tree. It is now visually hidden (see
              `.dda-attach-file input[type='file']` in input.css) but focusable,
              and the visible control after it shows the focus ring. It is
              always rendered, so a native form submit keeps the chosen file.
            */}
            <input
              ref={(el) => (this.fileInput = el)}
              id={id}
              name={this.input_name}
              // Without a visible label the "Choose File" label names the input, but it is gone once a file is chosen.
              aria-label={this.aria_label || (this.label ? undefined : 'Choose file')}
              type="file"
              onInput={(event) => {this.handleFileInput(event)}}
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
            />
            {this.file ? (
              <div class="dda-file-details">
                <div class="dda-items">
                  <img src={this.getFileIcon(this.file.name)} alt="File Icon" class="dda-file-icon" />
                  <span class="dda-file-name">{this.file.name}</span>
                </div>
                <button type="button" id={this.button_id} name={this.button_name} aria-label={this.button_aria_label || `Remove ${this.file.name}`} class="remove-file" onClick={() => this.removeFile()}>
                  <i class="material-icons  material-symbols-outlined" aria-hidden="true">close</i>
                </button>
              </div>
            ) : (
              <div class="dda-file-input">
                <span>No File Selected</span>
                <label htmlFor={id} class="dda-file-choose">
                  Choose File
                </label>
              </div>
            )}
          </div>
          {this.helper_text && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}