import { Component, Prop, State, h, Host } from '@stencil/core';
import pdfIcon from '../../assets/img/icn/icn-PDF.svg';
import pptIcon from '../../assets/img/icn/icn-PowerPoint.svg';
import wordIcon from '../../assets/img/icn/icn-Word.svg';
import excelIcon from '../../assets/img/icn/icn-Excel.svg';
import imageIcon from '../../assets/img/icn/icn-Image.svg';
import videoIcon from '../../assets/img/icn/icn-Video.svg';
import onenoteIcon from '../../assets/img/icn/icn-OneNote.svg';

@Component({
  tag: 'dda-attach-file',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaAttachFile {
  /** Label text shown above the field. Linked to the file input when `input_id` is set. */
  @Prop() label: string;
  /** Helper text shown below the field. Linked by `aria-describedby` when `input_id` is set. */
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
  /** Accessible name of the file input. */
  @Prop() aria_label?: string = '';
  /** Accessible name of the remove button shown after a file is chosen, e.g. `Remove file`. */
  @Prop() button_aria_label?: string = '';
  /** `id` of the file input. Also used to link the label, helper text and error message. */
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
  }

  getFileIcon(fileName: string) {
    const extension = fileName.split('.').pop().toLowerCase();
    return this.fileIcons[extension] || 'path/to/default-icon.png';
  }

  // F-016: ids derived from the consumer-supplied input_id, same pattern as
  // dda-input/dda-select.
  private get helperId(): string | undefined {
    return this.input_id ? `${this.input_id}-helper` : undefined;
  }

  private get errorId(): string | undefined {
    return this.input_id ? `${this.input_id}-error` : undefined;
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

    return (
      <Host>
        <div class={inputClass}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-input-field-group dda-attach-file">
            {this.file ? (
              <div class="dda-file-details">
                <div class="dda-items">
                  <img src={this.getFileIcon(this.file.name)} alt="File Icon" class="dda-file-icon" />
                  <span class="dda-file-name">{this.file.name}</span>
                </div>
                <button id={this.button_id} name={this.button_name} aria-label={this.button_aria_label} class="remove-file" onClick={() => this.removeFile()}>
                  <i class="material-icons  material-symbols-outlined" aria-hidden="true">close</i>
                </button>
              </div>
            ) : (
              <div class="dda-file-input">
                <span>No File Selected</span>
                <label htmlFor={this.input_id} class="dda-file-choose">
                  Choose File
                  <input
                    id={this.input_id}
                    name={this.input_name}
                    aria-label={this.aria_label}
                    type="file"
                    onInput={(event) => {this.handleFileInput(event)}}
                    aria-describedby={this.describedBy}
                    aria-invalid={this.error_message ? 'true' : undefined}
                  />
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