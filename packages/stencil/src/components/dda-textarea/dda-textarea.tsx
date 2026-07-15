import { Component, Prop, h, Host, Element, State } from '@stencil/core';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

@Component({
  tag: 'dda-textarea',
  styleUrls: ['../../global/global.css', '../../global/input.css'],
  shadow: false,
})
export class DdaTextarea {
  @Prop() placeholder: string;
  @Prop() label: string;
  @Prop() value: string = '';
  @Prop() error_message: string;
  @Prop() validation_type?: string;
  @Prop() input_status?: string; // Custom prop for different textarea types
  @Prop() helper_text?: string;
  @Prop() custom_class?: string;
  @Prop() enable_rich_editor?: boolean; // Prop to enable rich text editor
  @Prop() max_characters: number;
  @Prop() component_mode?: string; 
  @Prop() input_id: string;
  @Prop() aria_label?: string;
  @Prop() textarea_name: string;

  @Element() el: HTMLElement;

  @State() characterCount: number = 0; // State to track the character count

  private quill: Quill;

  componentDidLoad() {
    if (this.enable_rich_editor) {
      const editor = this.el.querySelector('#editor') as HTMLElement;
      this.quill = new Quill(editor, {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
        
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
        
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
        
            ['clean'],                                         // remove formatting button
        
            ['link', 'image', 'video']                         // link and image, video
          ],
        },
        theme: 'snow',
        placeholder: this.placeholder,
      });

      this.quill.on('text-change', () => {
        this.value = this.quill.root.innerHTML;
        this.characterCount = this.quill.getText().length - 1; // Update character count
      });
    }
  }

  handleInput(event) {
    if (!this.enable_rich_editor) {
      this.value = event.target.value;
      this.characterCount = event.target.value.length; // Update character count
    }
  }

  render() {
    const textareaClass = [
      'dda-input-container dda-richtext-editor',
      this.validation_type ? `dda-validation-${this.validation_type}` : '',
      this.input_status ? `dda-input-${this.input_status}` : '',
        this.custom_class, this.component_mode, this.textarea_name,
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <div class={textareaClass}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          {this.enable_rich_editor ? (
            <div id="editor" class="dda-richeditor-field"></div>
          ) : (
            <textarea
              id={this.input_id}
              name={this.textarea_name}
              aria-label={this.aria_label}
              placeholder={this.placeholder}
              value={this.value}
              onInput={(event) => this.handleInput(event)}
              class="dda-input-field dda-input-textarea"
              maxLength={this.max_characters}
            ></textarea>
          )}
          {this.helper_text && (
            <div class="dda-helper-text">
              <span class="dda-flex dda-align-center dda-gap-2"><i class="material-icons  material-symbols-outlined">info</i> {this.helper_text}</span>
              <span class="dda-letter-count">{this.characterCount} / {this.max_characters}</span>
            </div>
          )}
          {this.error_message && (
            <div class="dda-error-message">
              <span class="dda-flex dda-align-center dda-gap-2"><i class="material-icons  material-symbols-outlined">info</i> {this.error_message}</span>
              <span class="dda-letter-count">{this.characterCount} / {this.max_characters}</span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
