import { Component, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';

// Gives each header its own search input ids, so several headers on a page do not clash.
let headerInstanceCount = 0;

@Component({
  tag: 'dda-header',
  styleUrls: ['dda-header.css',],
  shadow: false,
})

export class DdaHeader {
  /** Image URL of the first (government) logo, on the left of the header and in the side menu. */
  @Prop() firstLogoSrc: string;
  /** Image URL of the white first logo, shown in dark theme and on a transparent header (`<body class="transparent">`). Falls back to `firstLogoSrc`. */
  @Prop() firstLogoWhiteSrc: string;
  /** Alternative text for the first logo. */
  @Prop() firstLogoAlt: string;
  /** Image URL of the second (entity) logo. */
  @Prop() secondLogoSrc: string;
  /** Image URL of the white second logo, shown in dark theme and on a transparent header. Falls back to `secondLogoSrc` on desktop. */
  @Prop() secondLogoWhiteSrc: string;
  /** Alternative text for the second logo. */
  @Prop() secondLogoAlt: string;
  /** URL of the Login link in the toolbar and the side menu. */
  @Prop() loginLink: string;
  /** Side menu items. JSON array of `{ label, href, subMenu }`; each `subMenu` item is `{ headerLabel, label, href, subMenu }` and can nest. */
  @Prop() sideMenuItems: string;
  /** Main navigation links. JSON array of `{ label, href, menuLabel, subMenu }`; `subMenu` items are `{ title, description, icon, href }` and open a mega menu. */
  @Prop() quickLinks: string;
  /** URL of the ReadSpeaker "listen" link in the accessibility panel. */
  @Prop() readSpeakerLink: string;
  /** Placeholder and accessible label of the search input. Default: `Search`. */
  @Prop() searchText: string;
  /** Material Symbols icon name of the Login link in the side menu. Default: `sentiment_satisfied`. */
  @Prop() loginIcon: string;
  /** Label of the Login link in the side menu. Default: `Login`. */
  @Prop() loginText: string;
  /** Label of the language button in the desktop toolbar, e.g. `العربية`. */
  @Prop() language_text: string;
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
        placeholder={this.searchText || 'Search'}
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

  handleScroll = () => {
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
    this.isAccessibiltyOpen = !this.isAccessibiltyOpen;
  };

  private languagehandler = () => {
    this.languageSwitch.emit();
  };
  private smTexthandler = () => {
    this.smTextSize.emit();
  };
  private baseTexthandler = () => {
    this.baseTextSize.emit();
  };
  private lgTexthandler = () => {
    this.lgTextSize.emit();
  };
  private normalContrasthandler = () => {
    this.normalContrast.emit();
  };
  private blindContrasthandler = () => {
    this.blindContrast.emit();
  };
  private redContrasthandler = () => {
    this.redContrast.emit();
  };
  private greenContrasthandler = () => {
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
            <a href="#" class="govt-logo">
              <img class="logo-colored" src={this.firstLogoSrc} alt={this.firstLogoAlt} />
              <img class="logo-white" src={this.firstLogoWhiteSrc || this.firstLogoSrc} alt={this.firstLogoAlt} />
            </a>
            <a href="#" class="entt-logo">
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
                <dda-tooltip title_text="Menu" position="top" class="d-block">
                  <button type="button" class="hamburger-menu-btn" name={this.hamburger_menu_button_name}>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-menu-text">hamburger menu text</span>
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
                        <a href="#" class="govt-logo mb-2">
                          <img class="" src={this.firstLogoSrc} alt={this.firstLogoAlt} />
                        </a>
                    </div>
                    <div class="dda-toolbar-menu-sidemenu">
                        <ul>
                            <li>
                                <button name={this.accessibility_button_name} class="tool-btn accessibility-btn" type="button" aria-expanded={this.isAccessibiltyOpen ? 'true' : 'false'} onClick={this.toggleAccessibilty}>
                                  <i class="material-icons  material-symbols-outlined" aria-hidden="true">accessibility</i>
                                  <span class="visually-hidden">Accessibility</span>
                                </button>
                            </li>
                            <li>
                                <button name={this.language_button_name} class="tool-btn" type="button" onClick={this.languagehandler}>العربية</button>
                            </li>
                            <li>
                              <dda-link-button
                                button_color="onsurface-secondary"
                                start_icon={this.loginIcon || "sentiment_satisfied"}
                                custom_class="tool-btn"
                                href={this.loginLink}
                                button_shape="circle"
                                size="sm">
                                {this.loginText || "Login"}
                              </dda-link-button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <button name={this.close_menu_button_name} class="close-btn side-nav-close-btn" aria-label="Close Sidebar" onClick={this.toggleMenu}>
                  <i class="material-icons  material-symbols-outlined">close</i>
                </button>


                <div class="dda-accessibility hide-accessibility mobile-accessibility" style={{ display: this.isAccessibiltyOpen ? 'block' : 'none' }}>
                  <div class="dda-row">
                    <div class="dda-col-md-4 dda-accessibility-item">
                      <h2 class="dda-fs-body-lg dda-fw-700 mb-1">Contrast</h2>
                      <form>
                        <fieldset class="dda-theme-list">
                          <legend><p class="mb-3">Select your preferred contrast setting </p></legend>
                          <dda-radiobutton
                                title_text="Normal"
                                checked={true}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselectionmobile"
                                input_id="NormalMobile"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.normalContrasthandler}
                              ></dda-radiobutton>
                              <dda-radiobutton
                                title_text="Colours Blind"
                                checked={false}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselectionmobile"
                                input_id="ColoursBlindMobile"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.blindContrasthandler}
                              ></dda-radiobutton>
                              <dda-radiobutton
                                title_text="Red Weakness"
                                checked={false}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselectionmobile"
                                input_id="RedWeaknessMobile"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.redContrasthandler}
                              ></dda-radiobutton>
                              <dda-radiobutton
                                title_text="Green Weakness"
                                checked={false}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselectionmobile"
                                input_id="GreenWeaknessMobile"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.greenContrasthandler}
                              ></dda-radiobutton>
                        </fieldset>
                      </form>
                    </div>
                    <div class="dda-col-md-4 dda-accessibility-item">
                      <h2 class="dda-fs-body-lg dda-fw-700 mb-1">Screen Reader</h2>
                      <p class="mb-3">Listen to the content of the page by clicking play or listen</p>
                      <div class="rs_skip rsbtn rs_preserve" id="readspeaker_button1">
                        <a href={this.readSpeakerLink} rel="nofollow" class="rsbtn_play circle readspeaker" accessKey="L" aria-label="Listen to this page using ReadSpeaker">
                          <i class="material-icons  material-symbols-outlined">volume_up</i>
                        </a>
                      </div>
                    </div>
                    <div class="dda-col-md-4 dda-accessibility-item">
                      <h2 class="dda-fs-body-lg dda-fw-700 mb-1">Text Size</h2>
                      <p class="mb-3">Use the buttons below to increase or decrease the text size</p>
                      <div class="d-flex dda-gap-4">
                        <dda-button button_color="default-secondary" icon_button_shape="circle" custom_class="" size="lg" onClick={this.baseTexthandler}>
                          A
                        </dda-button>
                        <dda-button button_color="default-secondary" icon_button_shape="circle" custom_class="" size="lg" onClick={this.lgTexthandler}>
                          A+
                        </dda-button>
                        <dda-button button_color="default-secondary" icon_button_shape="circle" custom_class="" size="lg" onClick={this.smTexthandler}>
                          A-
                        </dda-button>
                      </div>
                    </div>
                  </div>

                <button name={this.close_accessibility_button_name} class="close-btn close_accessibility" aria-label="Close Accessibility" onClick={this.toggleAccessibilty}>
                  <i class="material-icons  material-symbols-outlined">close</i>
                </button>
                </div>
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
                                        <i class="material-icons material-symbols-outlined">{subItem.icon}</i>
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
                            <i class="material-icons material-symbols-outlined">close</i>
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
              <a href="#" class="entt-logo">
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
                  <dda-tooltip title_text="Search" description="" position="top">
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
                  <dda-tooltip title_text="Accessibility" position="top">
                    <button name={this.toggle_accessibility_button_name} class="tool-btn dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle accessibility-btn" type="button" aria-expanded={this.isAccessibiltyOpen ? 'true' : 'false'} onClick={this.toggleAccessibilty}>
                      <i class="material-icons  material-symbols-outlined" aria-hidden="true">accessibility</i>
                      <span class="visually-hidden">Accessibility</span>
                    </button>
                  </dda-tooltip>
                  <div class="dda-accessibility-wrap">
                    <div class="dda-accessibility hide-accessibility" style={{ display: this.isAccessibiltyOpen ? 'block' : 'none' }}>
                      <div class="dda-row">
                        <div class="dda-col-md-4 dda-accessibility-item">
                          <h2 class="dda-fs-body-lg dda-fw-700 mb-1">Contrast</h2>
                          <form>
                            <fieldset class="dda-theme-list">
                              <legend><p class="mb-3">Select your preferred contrast setting </p></legend>
                              <dda-radiobutton
                                title_text="Normal"
                                checked={true}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselection"
                                input_id="Normal"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.normalContrasthandler}
                              ></dda-radiobutton>
                              <dda-radiobutton
                                title_text="Colours Blind"
                                checked={false}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselection"
                                input_id="ColoursBlind"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.blindContrasthandler}
                              ></dda-radiobutton>
                              <dda-radiobutton
                                title_text="Red Weakness"
                                checked={false}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselection"
                                input_id="RedWeakness"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.redContrasthandler}
                              ></dda-radiobutton>
                              <dda-radiobutton
                                title_text="Green Weakness"
                                checked={false}
                                size="sm"
                                variants="normal"
                                supporting=""
                                group_name="themeselection"
                                input_id="GreenWeakness"
                                custom_class=""
                                component_mode=""
                                aria_label="radio-button"
                                onClick={this.greenContrasthandler}
                              ></dda-radiobutton>
                            </fieldset>
                          </form>
                        </div>
                        <div class="dda-col-md-4 dda-accessibility-item">
                          <h2 class="dda-fs-body-lg dda-fw-700 mb-1">Screen Reader</h2>
                          <p class="mb-3">Listen to the content of the page by clicking play or listen</p>
                          <div class="rs_skip rsbtn rs_preserve" id="readspeaker_button1">
                            <a href={this.readSpeakerLink} rel="nofollow" class="rsbtn_play circle readspeaker" accessKey="L" aria-label="Listen to this page using ReadSpeaker">
                              <i class="material-icons  material-symbols-outlined">volume_up</i>
                            </a>
                          </div>
                        </div>
                        <div class="dda-col-md-4 dda-accessibility-item">
                          <h2 class="dda-fs-body-lg dda-fw-700 mb-1">Text Size</h2>
                          <p class="mb-3">Use the buttons below to increase or decrease the text size</p>
                          <div class="d-flex dda-gap-4">
                            <dda-button button_color="default-secondary" icon_button_shape="circle" custom_class="" size="lg" onClick={this.baseTexthandler}>
                              A
                            </dda-button>
                            <dda-button button_color="default-secondary" icon_button_shape="circle" custom_class="" size="lg" onClick={this.lgTexthandler}>
                              A+
                            </dda-button>
                            <dda-button button_color="default-secondary" icon_button_shape="circle" custom_class="" size="lg" onClick={this.smTexthandler}>
                              A-
                            </dda-button>
                          </div>
                        </div>
                      </div>

                      <button name={this.close_accessibility_button_name} class="close-btn close_accessibility" aria-label="Close Sidebar" onClick={this.toggleAccessibilty}>
                        <i class="materinal-icons  material-symbols-outlined">close</i>
                        {/* <i class="fa-solid fa-close"></i> */}
                      </button>
                    </div>
                  </div>
                </li>
                <li>
                  <dda-tooltip title_text="Language" position="top">
                    <dda-button button_color="onsurface-secondary" custom_class="tool-btn" button_shape="circle" size="sm" onClick={this.languagehandler}>
                      {this.language_text}
                    </dda-button>
                  </dda-tooltip>
                </li>
                <li>
                  <dda-tooltip title_text="Login" position="top">
                    <dda-link-button
                      button_color="onsurface-secondary"
                      start_icon="sentiment_satisfied"
                      custom_class="tool-btn"
                      href={this.loginLink}
                      button_shape="circle"
                      size="sm"
                    >
                      Login
                    </dda-link-button>
                  </dda-tooltip>
                </li>
              </ul>
            </div>
          </div>
      </header>
    );
  }
}
