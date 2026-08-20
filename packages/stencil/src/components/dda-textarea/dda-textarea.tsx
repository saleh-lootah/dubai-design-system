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

  // F-016: ids derived from the consumer-supplied input_id (same pattern as
  // dda-input/dda-select). F-015: the rich-editor container also needs a
  // stable label id to point aria-labelledby at.
  private get labelId(): string | undefined {
    return this.input_id ? `${this.input_id}-label` : undefined;
  }

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

  // F-015: Quill does not make the container passed to `new Quill(...)`
  // editable — it mounts its real editable surface as a child `.ql-editor`
  // div with contenteditable="true" (that's what Tab actually lands on, per
  // the pre-existing focus-ring e2e test below). aria-labelledby/role/etc.
  // on the container never reach an AT's accessible-name computation for a
  // descendant, so the label/description/invalid-state must be applied
  // directly to quill.root (the `.ql-editor` element) after mount, and kept
  // in sync whenever the driving props change.
  private syncRichEditorA11y() {
    if (!this.quill) {
      return;
    }
    const editorEl = this.quill.root as HTMLElement;
    editorEl.setAttribute('role', 'textbox');
    editorEl.setAttribute('aria-multiline', 'true');

    if (this.labelId) {
      editorEl.setAttribute('aria-labelledby', this.labelId);
    } else {
      editorEl.removeAttribute('aria-labelledby');
    }

    if (this.describedBy) {
      editorEl.setAttribute('aria-describedby', this.describedBy);
    } else {
      editorEl.removeAttribute('aria-describedby');
    }

    if (this.error_message) {
      editorEl.setAttribute('aria-invalid', 'true');
    } else {
      editorEl.removeAttribute('aria-invalid');
    }
  }

  componentDidLoad() {
    if (this.enable_rich_editor) {
      // F-015: was `#editor` — the id is now the consumer-supplied
      // input_id (possibly undefined), so target the stable class instead.
      const editor = this.el.querySelector('.dda-richeditor-field') as HTMLElement;
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

      this.syncRichEditorA11y();
    }
  }

  componentDidUpdate() {
    if (this.enable_rich_editor) {
      this.syncRichEditorA11y();
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
          {this.label && <label id={this.labelId} htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          {this.enable_rich_editor ? (
            // F-015: previously a bare `<div id="editor">` — the visible
            // label's `for` cannot target a non-labelable <div>, and even
            // aria-labelledby here would be wrong: Quill turns this
            // container into a wrapper and mounts the real editable surface
            // as a child `.ql-editor`, which is what AT and Tab actually
            // land on. The ARIA lives on quill.root (.ql-editor), applied
            // imperatively in syncRichEditorA11y() after mount.
            <div
              id={this.input_id}
              class="dda-richeditor-field"
            ></div>
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
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
            ></textarea>
          )}
          {this.helper_text && (
            <div id={this.helperId} class="dda-helper-text">
              <span class="dda-flex dda-align-center dda-gap-2"><i class="material-icons  material-symbols-outlined">info</i> {this.helper_text}</span>
              <span class="dda-letter-count">{this.characterCount} / {this.max_characters}</span>
            </div>
          )}
          {this.error_message && (
            <div id={this.errorId} class="dda-error-message">
              <span class="dda-flex dda-align-center dda-gap-2"><i class="material-icons  material-symbols-outlined">info</i> {this.error_message}</span>
              <span class="dda-letter-count">{this.characterCount} / {this.max_characters}</span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
