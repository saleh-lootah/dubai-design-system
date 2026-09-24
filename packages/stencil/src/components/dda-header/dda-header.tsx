import { Component, Element, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';

// Gives each header its own search input ids, so several headers on a page do not clash.
let headerInstanceCount = 0;

@Component({
  tag: 'dda-header',
  styleUrls: ['dda-header.css',],
  shadow: false,
})

export class DdaHeader {
  @Element() el: HTMLElement;

  /** Image URL of the first (government) logo, on the left of the header and in the side menu. */
  @Prop() firstLogoSrc: string;
  /** Image URL of the white first logo, shown in dark theme and on a transparent header (`<body class="transparent">`). Falls back to `firstLogoSrc`. */
  @Prop() firstLogoWhiteSrc: string;
  /** Alternative text for the first logo. */
  @Prop() firstLogoAlt: string;
  /** Link URL of the first logo in the header and the side menu. Default: `/`. */
  @Prop() firstLogoHref: string = '/';
  /** Image URL of the second (entity) logo. */
  @Prop() secondLogoSrc: string;
  /** Image URL of the white second logo, shown in dark theme and on a transparent header. Falls back to `secondLogoSrc` on desktop. */
  @Prop() secondLogoWhiteSrc: string;
  /** Alternative text for the second logo. */
  @Prop() secondLogoAlt: string;
  /** Link URL of the second logo on desktop and mobile. Default: `/`. */
  @Prop() secondLogoHref: string = '/';
  /** URL of the Login link in the toolbar and the side menu. */
  @Prop() loginLink: string;
  /** Side menu items. JSON array of `{ label, href, subMenu }`; each `subMenu` item is `{ headerLabel, label, href, subMenu }` and can nest. */
  @Prop() sideMenuItems: string;
  /** Main navigation links. JSON array of `{ label, href, menuLabel, subMenu }`; `subMenu` items are `{ title, description, icon, href }` and open a mega menu. */
  @Prop() quickLinks: string;
  /** URL of the ReadSpeaker "listen" link in the accessibility panel. */
  @Prop() readSpeakerLink: string;
  /** 3.x name of `readSpeakerLink`, as an attribute: `read_speaker_link`. `readSpeakerLink` wins when both are set. */
  @Prop() read_speaker_link: string;
  /** Heading of the contrast column in the accessibility panel. Default: `Contrast`. An empty value removes the heading. */
  @Prop() contrast_title: string;
  /** Text above the contrast options. Default: `Select your preferred contrast setting`. */
  @Prop() contrast_description: string;
  /** Label of the normal contrast option. Default: `Normal`. */
  @Prop() contrast_normal_text: string;
  /** 3.x spelling of `contrast_normal_text`. `contrast_normal_text` wins when both are set. */
  @Prop() contrast_noraml_text: string;
  /** Label of the colour-blind contrast option. Default: `Colours Blind`. */
  @Prop() contrast_color_blind_text: string;
  /** Label of the red-weakness contrast option. Default: `Red Weakness`. */
  @Prop() contrast_red_weakness_text: string;
  /** Label of the green-weakness contrast option. Default: `Green Weakness`. */
  @Prop() contrast_green_weakness_text: string;
  /** Heading of the screen reader column. Default: `Screen Reader`. */
  @Prop() screen_reader_title: string;
  /** Text in the screen reader column. Default: `Listen to the content of the page by clicking play or listen`. */
  @Prop() screen_reader_description: string;
  /** Accessible name of the ReadSpeaker play link. Default: `Listen to this page using ReadSpeaker`. */
  @Prop() screen_reader_link_label: string;
  /** Heading of the text size column. Default: `Text Size`. */
  @Prop() text_size_title: string;
  /** Text in the text size column. Default: `Use the buttons below to increase or decrease the text size`. */
  @Prop() text_size_description: string;
  /** The contrast option shown as selected. The header updates it when the user picks an option. Default: `normal`. */
  @Prop({ mutable: true }) selected_contrast: 'normal' | 'colorblind' | 'redweakness' | 'greenweakness' = 'normal';
  /** The text size button shown as selected (`default-primary`). The header updates it on each click. Default: none. */
  @Prop({ mutable: true }) selected_text_size: 'small' | 'normal' | 'large';
  /** Placeholder and accessible label of the search input. Default: `Search`. */
  @Prop() searchText: string;
  /** Material Symbols icon name of the Login link in the desktop toolbar and the side menu. Default: `sentiment_satisfied`. */
  @Prop() loginIcon: string;
  /** Label of the Login link in the desktop toolbar and the side menu. Default: `Login`. An empty value removes the Login link. */
  @Prop() loginText: string;
  /** Hides the Login link in the desktop toolbar and the side menu. */
  @Prop() hide_login: boolean = false;
  /** Label of the language buttons in the desktop toolbar and the side menu. Default: `العربية`. An empty value removes the language buttons. */
  @Prop() language_text: string;
  /** `lang` attribute of the language buttons, the language of `language_text`. Default: `ar`. */
  @Prop() language_lang: string = 'ar';
  /** Tooltip of the desktop accessibility button. Default: `Accessibility`. */
  @Prop() accessibility_tooltip: string;
  /** Accessible name (visually hidden text) of both accessibility buttons. Default: `Accessibility`. */
  @Prop() accessibility_button_text: string;
  /** `id` of the desktop accessibility button. The side-menu button gets this id plus `-sidemenu`. */
  @Prop() accessibility_button_id: string;
  /** `class` of the accessibility button icon. Default: `material-icons  material-symbols-outlined`. */
  @Prop() accessibility_button_icon_family: string;
  /** Material icon name of the accessibility buttons. Default: `accessibility`. */
  @Prop() accessibility_button_icon_name: string;
  /** Tooltip of the desktop search. Default: `Search`. */
  @Prop() search_tooltip: string;
  /** Placeholder of the search inputs. Default: the `searchText` value, else `Search`. */
  @Prop() search_input_placeholder: string;
  /** Tooltip of the desktop language button. Default: `Language`. */
  @Prop() language_tooltip: string;
  /** Tooltip of the desktop Login link. Default: the Login label. */
  @Prop() login_tooltip: string;
  /** When `false`, the header renders no accessibility panel; the buttons only emit `accessibilitymenufunctionality`, so the page can open its own panel. Default: `true`. */
  @Prop() usePredesignedAccessibilityMenu: boolean = true;
  /** Emitted on every click of an accessibility button (3.x name). */
  @Event({ eventName: 'accessibilitymenufunctionality' }) accessibilityMenuToggle: EventEmitter<void>;
  /** Emitted with the query when a non-empty search is submitted (3.x name). Pages that open a results page from this event keep working. `searchSubmit` is the 5.x event, and it can cancel the navigation. */
  @Event({ eventName: 'searchfunctionality' }) searchInput: EventEmitter<string>;
  /** Emitted when the user clicks the language button. */
  @Event() languageSwitch: EventEmitter<void>;
  /** Emitted when the user clicks the `A-` (smaller text) button in the accessibility panel. */
  @Event() smTextSize: EventEmitter<void>;
  /** Emitted when the user clicks the `A` (default text size) button in the accessibility panel. */
  @Event() baseTextSize: EventEmitter<void>;
  /** Emitted when the user clicks the `A+` (larger text) button in the accessibility panel. */
  @Event() lgTextSize: EventEmitter<void>;
  /** Emitted when the user selects the Normal contrast option. */
  @Event() normalContrast: EventEmitter<void>;
  /** Emitted when the user selects the Colours Blind contrast option. */
  @Event() blindContrast: EventEmitter<void>;
  /** Emitted when the user selects the Red Weakness contrast option. */
  @Event() redContrast: EventEmitter<void>;
  /** Emitted when the user selects the Green Weakness contrast option. */
  @Event() greenContrast: EventEmitter<void>;
  /**
   * Emitted when a non-empty search is submitted. Call `preventDefault()` to stop the
   * browser navigating to `search_action`, for example to route inside a single-page app.
   */
  @Event({ cancelable: true }) searchSubmit: EventEmitter<{ query: string }>;

  @State() isMenuOpen: boolean = false;
  @State() isSubMenuOpen: boolean = false;
  @State() isSideSubMenuOpen: boolean = false;
  @State() isAccessibiltyOpen: boolean = false;
  @State() isSearchOpen: boolean = false;
  private readonly searchId = `dda-header-search-${++headerInstanceCount}`;
  private mobileSearchButton: HTMLButtonElement;
  private mobileSearchInput: HTMLInputElement;
  private focusSearchAfterRender = false;
  private lastScrollTop = 0;

  /** `name` attribute of the hamburger menu button. */
  @Prop() hamburger_menu_button_name: string;
  /** Accessible name of the hamburger menu button (visually hidden text). Default: `Menu`. */
  @Prop() menu_button_label: string = 'Menu';
  /** `name` attribute of the accessibility button in the side menu. */
  @Prop() accessibility_button_name: string;
  /** `name` attribute of the mobile search button. */
  @Prop() search_button_name: string;
  /** `name` of the search input, which is the query parameter sent to `search_action`. Default: `q`. */
  @Prop() search_input_name: string;
  /** Results page URL. When set, a search does a GET to this URL with the query in `search_input_name` (default `q`). */
  @Prop() search_action: string;
  /** `name` attribute of the language button in the side menu. */
  @Prop() language_button_name: string;
  /** `name` attribute of the button that closes the side menu. */
  @Prop() close_menu_button_name: string;
  /** `name` attribute of the buttons that close the accessibility panel. */
  @Prop() close_accessibility_button_name: string;
  /** Not used: the current markup does not render an element with this name. */
  @Prop() close_sidebar_button_name: string;
  /** `name` attribute of the accessibility button in the desktop toolbar. */
  @Prop() toggle_accessibility_button_name: string;

  @State() openMenus: { [index: string]: boolean } = {};
  @State() activeMenuIndex: number | null = null;

  toggleSidebarSubMenu(index: string) {
    if (index === '') {
      this.openMenus = {};
      return;
    }
    
    const isCurrentlyOpen = this.openMenus[index];
    const newOpenMenus = {};
    
    if (!isCurrentlyOpen) {
      const parts = index.split('-');
      let parentPath = '';
      
      for (let i = 0; i < parts.length - 1; i++) {
        parentPath = parentPath ? `${parentPath}-${parts[i]}` : parts[i];
        newOpenMenus[parentPath] = true;
      }
      
      newOpenMenus[index] = true;
    } else {
      for (const key in this.openMenus) {
        if (key !== index && !key.startsWith(`${index}-`)) {
          newOpenMenus[key] = true;
        }
      }
    }
    
    this.openMenus = newOpenMenus;
  }

  toggleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (this.isSearchOpen) {
        this.closeMobileSearch();
      }
      this.isMenuOpen = false;
      this.isAccessibiltyOpen = false;
      this.isSubMenuOpen = false;
      this.isSideSubMenuOpen = false;
      this.activeMenuIndex = null;
    }
  }

  componentDidLoad() {
    this.updateScrolled();
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.toggleEscapeKey);
    document.addEventListener('click', this.handleOutsideAccessibilityClick);
    document.addEventListener('click', this.handleOutsideMegaMenuClick)
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.toggleEscapeKey);
    document.removeEventListener('click', this.handleOutsideAccessibilityClick);
    document.removeEventListener('click', this.handleOutsideMegaMenuClick);
    this.lockPageScroll(false);
  }

  // While the side menu is open, the page underneath must not scroll; the menu itself still does.
  @Watch('isMenuOpen')
  onMenuOpenChange(isOpen: boolean) {
    this.lockPageScroll(isOpen);
  }

  private lockPageScroll(lock: boolean) {
    document.documentElement.classList.toggle('dda-scroll-lock', lock);
  }

  private handleSearchSubmit = (event: Event) => {
    const input = (event.currentTarget as HTMLFormElement).querySelector('input');
    const query = input.value.trim();
    if (!query) {
      event.preventDefault();
      input.focus();
      return;
    }
    this.searchInput.emit(query);
    const searchEvent = this.searchSubmit.emit({ query });
    // Without a results URL there is nowhere to go; a cancelled event means the app routes itself.
    if (searchEvent.defaultPrevented || !this.search_action) {
      event.preventDefault();
    }
  };

  private openMobileSearch = () => {
    this.focusSearchAfterRender = true;
    this.isSearchOpen = true;
  };

  private closeMobileSearch = () => {
    this.isSearchOpen = false;
    this.mobileSearchButton?.focus();
  };

  componentDidUpdate() {
    // The panel is hidden until this render, so focus can only move into it now.
    if (this.focusSearchAfterRender) {
      this.focusSearchAfterRender = false;
      this.mobileSearchInput?.focus();
    }
  }

  private renderSearchInput(id: string, ref?: (el: HTMLInputElement) => void) {
    return [
      <label htmlFor={id} class="visually-hidden">{this.searchText || 'Search'}</label>,
      <i class="material-icons  material-symbols-outlined" aria-hidden="true">search</i>,
      <input
        name={this.search_input_name || 'q'}
        type="text"
        id={id}
        placeholder={this.text(this.search_input_placeholder, this.searchText || 'Search')}
        enterkeyhint="search"
        autocomplete="off"
        ref={ref}
      />,
    ];
  }

  handleOutsideClick = (event: MouseEvent) => {
    let isClickInsideMenu = (event.target as Element).closest('.main_side_menu');
    if (!isClickInsideMenu) {
      this.toggleSidebarSubMenu('');
      document.querySelectorAll('.main_sub_menu').forEach((menu) => {
        menu.classList.remove('showSubMenu');
      });
      document.querySelectorAll('.showSub').forEach((anchor) => {
        anchor.classList.remove('icon_arrow');
      });
    }
  };

  handleOutsideAccessibilityClick = (event: MouseEvent) => {
    if (this.isAccessibiltyOpen) {
      const accessibilityMenu = document.querySelector('.dda-accessibility-wrap .dda-accessibility');
      const isClickInsideDesktopMenu = accessibilityMenu && accessibilityMenu.contains(event.target as Node);
      const isClickOnToggleButton = (event.target as Element).closest('.accessibility-btn');
      
      if (!isClickInsideDesktopMenu && !isClickOnToggleButton) {
        this.isAccessibiltyOpen = false;
      }
    }
  };

  handleOutsideMegaMenuClick = (event: MouseEvent) => {
    if (this.activeMenuIndex !== null) {
      const megaMenu = document.querySelector('.megamenu-content');
      const isClickInsideMegaMenu = megaMenu && megaMenu.contains(event.target as Node);
      const isClickOnToggleLink = (event.target as Element).closest('.showSub');
  
      if (!isClickInsideMegaMenu && !isClickOnToggleLink) {
        this.activeMenuIndex = null;
      }
    }
  };

  // The transparent style (<body class="transparent">) shows only at the top of the page.
  // Below the top, `dda-scrolled` turns it off in CSS and the header uses the standard style.
  private updateScrolled() {
    this.el.classList.toggle('dda-scrolled', window.scrollY > 0);
  }

  handleScroll = () => {
    this.updateScrolled();
    const scrollTop = window.scrollY;
    const menuContainer = document.querySelector('.dda-menu-container') as HTMLElement;
    const logoContainer = document.querySelector('.dda-header') as HTMLElement;

    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      if (menuContainer) menuContainer.style.display = 'none';
      if (logoContainer) logoContainer.classList.add('white');
    } else {
      if (menuContainer) menuContainer.style.display = 'flex';
      if (logoContainer) logoContainer.classList.remove('white');
    }
    this.lastScrollTop = scrollTop;
  };



  private parseJsonArray(jsonString: string) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return [];
    }
  }
  private toggleMenu = () => {
    if (this.isAccessibiltyOpen) {
      this.isAccessibiltyOpen = false;
    }
    this.isMenuOpen = !this.isMenuOpen;
  };
  private toggleSubMenu = (index: number, event?: MouseEvent) => {
    // this.isSubMenuOpen = !this.isSubMenuOpen;
    if (event) event.preventDefault();
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  };
  private toggleAccessibilty = () => {
    if (this.usePredesignedAccessibilityMenu) {
      this.isAccessibiltyOpen = !this.isAccessibiltyOpen;
    }
    this.accessibilityMenuToggle.emit();
  };

  private languagehandler = () => {
    this.languageSwitch.emit();
  };
  // Text-prop rule: an absent attribute uses the English default; an empty one means "show nothing".
  private text(value: string | undefined, fallback: string): string {
    return value === undefined || value === null ? fallback : value;
  }

  private smTexthandler = () => {
    this.selected_text_size = 'small';
    this.smTextSize.emit();
  };
  private baseTexthandler = () => {
    this.selected_text_size = 'normal';
    this.baseTextSize.emit();
  };
  private lgTexthandler = () => {
    this.selected_text_size = 'large';
    this.lgTextSize.emit();
  };
  private normalContrasthandler = () => {
    this.selected_contrast = 'normal';
    this.normalContrast.emit();
  };
  private blindContrasthandler = () => {
    this.selected_contrast = 'colorblind';
    this.blindContrast.emit();
  };
  private redContrasthandler = () => {
    this.selected_contrast = 'redweakness';
    this.redContrast.emit();
  };
  private greenContrasthandler = () => {
    this.selected_contrast = 'greenweakness';
    this.greenContrast.emit();
  };

  renderSubMenu = (subMenu, parentLi) => {
    if (!subMenu || subMenu.length === 0) return null;

    return (
      <div class={`main_sub_menu ${this.openMenus[parentLi] ? 'showSubMenu' : ''}`}>
        {subMenu[0].headerLabel && (
          <p class="dda-side-nav__title">{subMenu[0].headerLabel}</p>
        )}
        <ol>
          {subMenu.map((item, index) => {
            const currentIndex = `${parentLi}-${index}`;
            return (
              <li key={currentIndex}>
                <a
                  href={item.href}
                  class={item.subMenu && item.subMenu.length > 0 ? 'showSub' : ''}
                  onClick={(e) => {
                    if (item.subMenu && item.subMenu.length > 0) {
                      e.preventDefault();
                      this.toggleSidebarSubMenu(currentIndex);
                    }
                  }}
                >
                  {item.label}
                </a>
                {this.renderSubMenu(item.subMenu, currentIndex)}
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  // The three columns of the accessibility panel. The desktop panel and the side-menu panel show
  // the same content; only the radio group and ids differ, so both panels stay independent forms.
  private renderAccessibilityColumns(variant: 'desktop' | 'mobile') {
    const suffix = variant === 'mobile' ? 'Mobile' : '';
    const group = variant === 'mobile' ? 'themeselectionmobile' : 'themeselection';
    const contrastTitle = this.text(this.contrast_title, 'Contrast');
    const contrastDescription = this.text(this.contrast_description, 'Select your preferred contrast setting');
    const readSpeakerLink = this.readSpeakerLink || this.read_speaker_link;
    const screenReaderTitle = this.text(this.screen_reader_title, 'Screen Reader');
    const screenReaderDescription = this.text(this.screen_reader_description, 'Listen to the content of the page by clicking play or listen');
    const textSizeTitle = this.text(this.text_size_title, 'Text Size');
    const textSizeDescription = this.text(this.text_size_description, 'Use the buttons below to increase or decrease the text size');
    const options = [
      { value: 'normal', label: this.text(this.contrast_normal_text ?? this.contrast_noraml_text, 'Normal'), id: 'Normal', handler: this.normalContrasthandler },
      { value: 'colorblind', label: this.text(this.contrast_color_blind_text, 'Colours Blind'), id: 'ColoursBlind', handler: this.blindContrasthandler },
      { value: 'redweakness', label: this.text(this.contrast_red_weakness_text, 'Red Weakness'), id: 'RedWeakness', handler: this.redContrasthandler },
      { value: 'greenweakness', label: this.text(this.contrast_green_weakness_text, 'Green Weakness'), id: 'GreenWeakness', handler: this.greenContrasthandler },
    ];
    const sizes = [
      { value: 'normal', label: 'A', handler: this.baseTexthandler },
      { value: 'large', label: 'A+', handler: this.lgTexthandler },
      { value: 'small', label: 'A-', handler: this.smTexthandler },
    ];
    return (
      <div class="dda-row">
        <div class="dda-col-md-4 dda-accessibility-item">
          {contrastTitle && <h2 class="dda-fs-body-lg dda-fw-700 mb-1">{contrastTitle}</h2>}
          <form>
            <fieldset class="dda-theme-list">
              {contrastDescription && (
                <legend>
                  <p class="mb-3">{contrastDescription}</p>
                </legend>
              )}
              {options.map(option =>
                option.label ? (
                  <dda-radiobutton
                    title_text={option.label}
                    checked={this.selected_contrast === option.value}
                    size="sm"
                    variants="normal"
                    supporting=""
                    group_name={group}
                    input_id={`${option.id}${suffix}`}
                    custom_class=""
                    component_mode=""
                    aria_label="radio-button"
                    onClick={option.handler}
                  ></dda-radiobutton>
                ) : null,
              )}
            </fieldset>
          </form>
        </div>
        {/* Without a ReadSpeaker URL the link has no target, so the item is not shown. */}
        {readSpeakerLink && (
          <div class="dda-col-md-4 dda-accessibility-item">
            {screenReaderTitle && <h2 class="dda-fs-body-lg dda-fw-700 mb-1">{screenReaderTitle}</h2>}
            {screenReaderDescription && <p class="mb-3">{screenReaderDescription}</p>}
            <div class="rs_skip rsbtn rs_preserve" id={`readspeaker_button1${suffix}`}>
              <a
                href={readSpeakerLink}
                rel="nofollow"
                class="rsbtn_play circle readspeaker"
                accessKey={variant === 'desktop' ? 'L' : undefined}
                aria-label={this.text(this.screen_reader_link_label, 'Listen to this page using ReadSpeaker')}
              >
                <i class="material-icons  material-symbols-outlined" aria-hidden="true">
                  volume_up
                </i>
              </a>
            </div>
          </div>
        )}
        <div class="dda-col-md-4 dda-accessibility-item">
          {textSizeTitle && <h2 class="dda-fs-body-lg dda-fw-700 mb-1">{textSizeTitle}</h2>}
          {textSizeDescription && <p class="mb-3">{textSizeDescription}</p>}
          <div class="d-flex dda-gap-4 dda-text-size-buttons">
            {sizes.map(size => (
              <dda-button
                button_color={this.selected_text_size === size.value ? 'default-primary' : 'default-secondary'}
                icon_button_shape="circle"
                custom_class=""
                size="lg"
                onClick={size.handler}
              >
                {size.label}
              </dda-button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // A tooltip must have text, so an empty tooltip attribute falls back to the default.
  private tooltip(value: string | undefined, fallback: string): string {
    return value ? value : fallback;
  }

  private get loginLabel(): string {
    return this.text(this.loginText, 'Login');
  }

  // 3.x hid Login when login-text was empty; hide_login is the 5.x switch.
  private get showLogin(): boolean {
    return !this.hide_login && this.loginLabel !== '';
  }

  private get languageLabel(): string {
    return this.text(this.language_text, 'العربية');
  }

  private renderAccessibilityButton(variant: 'desktop' | 'mobile') {
    const id = this.accessibility_button_id ? (variant === 'desktop' ? this.accessibility_button_id : `${this.accessibility_button_id}-sidemenu`) : undefined;
    const iconClass = this.accessibility_button_icon_family || 'material-icons  material-symbols-outlined';
    const buttonClass = variant === 'desktop' ? 'tool-btn dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle accessibility-btn' : 'tool-btn accessibility-btn';
    return (
      <button
        id={id}
        name={variant === 'desktop' ? this.toggle_accessibility_button_name : this.accessibility_button_name}
        class={buttonClass}
        type="button"
        aria-expanded={this.usePredesignedAccessibilityMenu ? (this.isAccessibiltyOpen ? 'true' : 'false') : undefined}
        onClick={this.toggleAccessibilty}
      >
        <i class={iconClass} aria-hidden="true">
          {this.accessibility_button_icon_name || 'accessibility'}
        </i>
        <span class="visually-hidden">{this.text(this.accessibility_button_text, 'Accessibility')}</span>
      </button>
    );
  }

  render() {
    const sideMenuItems = this.parseJsonArray(this.sideMenuItems);
    const quickLinks = this.parseJsonArray(this.quickLinks);
    const setActiveMenuIndex = (index: number | null) => {
      this.activeMenuIndex = index;
    };

    // The transparent style is opt-in at page level (<body class="transparent">);
    // CSS shows the white or colored logo to match.
    return (
      <header class="dda-header">
          {/* Logo Section */}
          <div class="dda-head-logo">
            <a href={this.firstLogoHref} class="govt-logo">
              <img class="logo-colored" src={this.firstLogoSrc} alt={this.firstLogoAlt} />
              <img class="logo-white" src={this.firstLogoWhiteSrc || this.firstLogoSrc} alt={this.firstLogoAlt} />
            </a>
            <a href={this.secondLogoHref} class="entt-logo">
              <img class="logo-colored" src={this.secondLogoSrc} alt={this.secondLogoAlt} />
              <img class="logo-white" src={this.secondLogoWhiteSrc || this.secondLogoSrc} alt={this.secondLogoAlt} />
            </a>
          </div>

          {/* Main Navigation Section */}
          <div class="dda-menu-container">
            <div class="dda-main-navigation">
              <div class={`dda-menu-overley ${this.isMenuOpen ? 'show-overley' : ''}`} onClick={this.toggleMenu}></div>

              {/* Hamburger Menu */}
              <div class="hamburger-menu" onClick={this.toggleMenu}>
                <dda-tooltip title_text={this.menu_button_label} position="top" class="d-block">
                  <button type="button" class="hamburger-menu-btn" name={this.hamburger_menu_button_name}>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-menu-text">{this.menu_button_label}</span>
                  </button>
                </dda-tooltip>
              </div>

              {/* Side Menu */}
              <div class="dda-sidemenu" style={{ display: this.isMenuOpen ? 'block' : '', insetInlineStart: this.isMenuOpen ? '0px' : '' }}>
                <div class="dda-sidemenu-content">
                  <p class="dda-side-nav-title">Quick Links</p>
                  <ul class="main_side_menu">
                    {sideMenuItems.map((menu, index) => {
                      const currentIndex = `menu-${index}`;
                      return (
                        <li key={currentIndex}>
                          <a
                            href={menu.href}
                            class={menu.subMenu && menu.subMenu.length > 0 ? 'showSub' : ''}
                            onClick={(e) => {
                              if (menu.subMenu && menu.subMenu.length > 0) {
                                e.preventDefault();
                                this.toggleSidebarSubMenu(currentIndex);
                              }
                            }}
                          >
                            {menu.label}
                          </a>
                          {this.renderSubMenu(menu.subMenu, currentIndex)}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div class="dda-sidemenu-bottom">
                    <div class="dda-sidemenu-gov-logo">
                        <a href={this.firstLogoHref} class="govt-logo mb-2">
                          <img class="" src={this.firstLogoSrc} alt={this.firstLogoAlt} />
                        </a>
                    </div>
                    <div class="dda-toolbar-menu-sidemenu">
                        <ul>
                            <li>{this.renderAccessibilityButton('mobile')}</li>
                            {this.languageLabel && (
                              <li>
                                <button name={this.language_button_name} class="tool-btn" type="button" lang={this.language_lang} onClick={this.languagehandler}>
                                  {this.languageLabel}
                                </button>
                              </li>
                            )}
                            {this.showLogin && (
                              <li>
                                <dda-link-button
                                  button_color="onsurface-secondary"
                                  start_icon={this.loginIcon || 'sentiment_satisfied'}
                                  custom_class="tool-btn"
                                  href={this.loginLink}
                                  button_shape="circle"
                                  size="sm"
                                >
                                  {this.loginLabel}
                                </dda-link-button>
                              </li>
                            )}
                        </ul>
                    </div>
                </div>
                
                <button name={this.close_menu_button_name} class="close-btn side-nav-close-btn" aria-label="Close Sidebar" onClick={this.toggleMenu}>
                  <i class="material-icons  material-symbols-outlined" aria-hidden="true">close</i>
                </button>


                {this.usePredesignedAccessibilityMenu && (
                  <div class="dda-accessibility hide-accessibility mobile-accessibility" style={{ display: this.isAccessibiltyOpen ? 'block' : 'none' }}>
                    {this.renderAccessibilityColumns('mobile')}

                    <button name={this.close_accessibility_button_name} class="close-btn close_accessibility" aria-label="Close Accessibility" onClick={this.toggleAccessibilty}>
                      <i class="material-icons  material-symbols-outlined" aria-hidden="true">close</i>
                    </button>
                  </div>
                )}
              </div>

              {/* Mega Menu */}
              <div>
                <ul class="dda-mega-menu">
                  {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.subMenu && link.subMenu.length > 0 ? '#' : link.href} 
                      onClick={link.subMenu && link.subMenu.length > 0 ? (e) => this.toggleSubMenu(index, e) : undefined}
                      class={link.subMenu && link.subMenu.length > 0 ? `showSub ${this.activeMenuIndex === index ? 'icon_arrow' : ''}` : ''}
                    >
                      {link.label}
                    </a>
                    {/* Conditionally render submenu */}
                    {link.subMenu && link.subMenu.length > 0 && (
                      <div 
                        class={`megamenu-content ${this.activeMenuIndex === index ? 'showSubMenu' : ''}`} 
                        style={{ display: this.activeMenuIndex === index ? 'block' : 'none' }}
                      >
                        <div class="megamenu-item dda-container">
                          <div class="dda-row">
                            <div class="dda-col-md-3">
                              <h3 class="mega-menu-title">{link.menuLabel}</h3>
                              <ul>
                                {link.subMenu.map((subItem, subIndex) => (
                                  <li key={subIndex}>
                                    <a class="megamenu-link" href={subItem.href}>
                                      <span class="dda-btn btn-color-onsurface-secondary btn-size-sm icon-btn-default">
                                        <i class="material-icons material-symbols-outlined" aria-hidden="true">{subItem.icon}</i>
                                      </span>
                                      <span class="text-wrap">
                                        <span class="title-text dda-fs-body-lg dda-fw-700">{subItem.title}</span>
                                        <span class="dda-fs-tagline-lg dda-fw-400">{subItem.description}</span>
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <button 
                            name="close-mega-menu" 
                            class="close-btn close_mega-menu" 
                            aria-label="Close Sidebar" 
                            onClick={() => setActiveMenuIndex(null)}
                          >
                            <i class="material-icons material-symbols-outlined" aria-hidden="true">close</i>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  ))}
                </ul>
              </div>
            </div>

            <div class="dda-mobile-entt-logo">
              <a href={this.secondLogoHref} class="entt-logo">
                <img class="logo-colored" src={this.secondLogoSrc} alt={this.secondLogoAlt} />
                <img class="logo-white" src={this.secondLogoWhiteSrc} alt={this.secondLogoAlt} />
              </a>
            </div>
            <div class="dda-mobile-search">
                <button
                  name={this.search_button_name}
                  class="tool-btn"
                  type="button"
                  aria-expanded={this.isSearchOpen ? 'true' : 'false'}
                  aria-controls={`${this.searchId}-mobile-panel`}
                  onClick={this.isSearchOpen ? this.closeMobileSearch : this.openMobileSearch}
                  ref={el => (this.mobileSearchButton = el)}
                >
                  <span class="visually-hidden">Search</span>
                  <i class="material-icons  material-symbols-outlined" aria-hidden="true">search</i>
                </button>
            </div>
            <div id={`${this.searchId}-mobile-panel`} class="dda-mobile-search-panel" hidden={!this.isSearchOpen}>
              <form class="dda-mobile-search-form" role="search" method="get" action={this.search_action} onSubmit={this.handleSearchSubmit}>
                {this.renderSearchInput(`${this.searchId}-mobile`, el => (this.mobileSearchInput = el))}
                <button type="button" class="dda-mobile-search-close" aria-label="Close search" onClick={this.closeMobileSearch}>
                  <i class="material-icons  material-symbols-outlined" aria-hidden="true">close</i>
                </button>
              </form>
            </div>

            {/* Toolbar Menu */}
            <div class="dda-toolbar-menu">
              <ul>
                <li>
                  <dda-tooltip title_text={this.tooltip(this.search_tooltip, 'Search')} description="" position="top">
                    <form
                      class="dda-search dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle tool-btn"
                      role="search"
                      method="get"
                      action={this.search_action}
                      onSubmit={this.handleSearchSubmit}
                    >
                      {this.renderSearchInput(this.searchId)}
                    </form>
                  </dda-tooltip>
                </li>

                <li>
                  <dda-tooltip title_text={this.tooltip(this.accessibility_tooltip, 'Accessibility')} position="top">
                    {this.renderAccessibilityButton('desktop')}
                  </dda-tooltip>
                  {this.usePredesignedAccessibilityMenu && (
                    <div class="dda-accessibility-wrap">
                      <div class="dda-accessibility hide-accessibility" style={{ display: this.isAccessibiltyOpen ? 'block' : 'none' }}>
                        {this.renderAccessibilityColumns('desktop')}

                        <button name={this.close_accessibility_button_name} class="close-btn close_accessibility" aria-label="Close Sidebar" onClick={this.toggleAccessibilty}>
                          <i class="material-icons  material-symbols-outlined" aria-hidden="true">close</i>
                          {/* <i class="fa-solid fa-close"></i> */}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
                {this.languageLabel && (
                  <li>
                    <dda-tooltip title_text={this.tooltip(this.language_tooltip, 'Language')} position="top">
                      <dda-button button_color="onsurface-secondary" custom_class="tool-btn" button_shape="circle" size="sm" lang={this.language_lang} onClick={this.languagehandler}>
                        {this.languageLabel}
                      </dda-button>
                    </dda-tooltip>
                  </li>
                )}
                {this.showLogin && (
                  <li>
                    <dda-tooltip title_text={this.tooltip(this.login_tooltip, this.loginLabel)} position="top">
                      <dda-link-button
                        button_color="onsurface-secondary"
                        start_icon={this.loginIcon || 'sentiment_satisfied'}
                        custom_class="tool-btn"
                        href={this.loginLink}
                        button_shape="circle"
                        size="sm"
                      >
                        {this.loginLabel}
                      </dda-link-button>
                    </dda-tooltip>
                  </li>
                )}
              </ul>
            </div>
          </div>
      </header>
    );
  }
}
