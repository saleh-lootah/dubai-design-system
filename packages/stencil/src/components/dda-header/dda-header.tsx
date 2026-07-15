import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-header',
  styleUrls: ['dda-header.css',],
  shadow: false,
})

export class DdaHeader {
  @Prop() firstLogoSrc: string;
  @Prop() firstLogoWhiteSrc: string;
  @Prop() firstLogoAlt: string;
  @Prop() secondLogoSrc: string;
  @Prop() secondLogoWhiteSrc: string;
  @Prop() secondLogoAlt: string;
  @Prop() loginLink: string;
  @Prop() sideMenuItems: string;
  @Prop() quickLinks: string;
  @Prop() readSpeakerLink: string;
  @Prop() searchText: string;
  @Prop() loginIcon: string;
  @Prop() loginText: string;
  @Prop() language_text: string;
  @Event() languageSwitch: EventEmitter<void>;
  @Event() smTextSize: EventEmitter<void>;
  @Event() baseTextSize: EventEmitter<void>;
  @Event() lgTextSize: EventEmitter<void>;
  @Event() normalContrast: EventEmitter<void>;
  @Event() blindContrast: EventEmitter<void>;
  @Event() redContrast: EventEmitter<void>;
  @Event() greenContrast: EventEmitter<void>;

  @State() isMenuOpen: boolean = false;
  @State() isSubMenuOpen: boolean = false;
  @State() isSideSubMenuOpen: boolean = false;
  @State() isAccessibiltyOpen: boolean = false;
  private lastScrollTop = 0;

  @Prop() hamburger_menu_button_name: string;
  @Prop() accessibility_button_name: string;
  @Prop() search_button_name: string;
  @Prop() search_input_name: string;
  @Prop() language_button_name: string;
  @Prop() close_menu_button_name: string;
  @Prop() close_accessibility_button_name: string;
  @Prop() close_sidebar_button_name: string;
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
    document.removeEventListener('click', this.handleOutsideAccessibilityClick);
    document.addEventListener('click', this.handleOutsideMegaMenuClick)
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
                    e.preventDefault();
                    this.toggleSidebarSubMenu(currentIndex);
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
    const isHomepage = window.location.pathname === '/';
    const setActiveMenuIndex = (index: number | null) => {
      this.activeMenuIndex = index;
    };

    return (
      <header class={`dda-header ${isHomepage ? 'transparent' : ''}`}>
          {/* Logo Section */}
          <div class="dda-head-logo">
            <a href="#" class="govt-logo">
              {isHomepage ? (<img class="logo-white" src={this.firstLogoWhiteSrc} alt={this.firstLogoAlt} />) : (<img class="logo-colored" src={this.firstLogoSrc} alt={this.firstLogoAlt} />)}
              {/* <img class="logo-colored" src={this.firstLogoSrc} alt={this.firstLogoAlt} />
              <img class="logo-white" src={this.firstLogoWhiteSrc} alt={this.firstLogoAlt} /> */}
            </a>
            <a href="#" class="entt-logo">
              {isHomepage ? (<img class="logo-white" src={this.secondLogoWhiteSrc} alt={this.secondLogoAlt} />) : (<img class="logo-colored" src={this.secondLogoSrc} alt={this.secondLogoAlt} />)}
              {/* <img class="logo-colored" src={this.secondLogoSrc} alt={this.secondLogoAlt} />
              <img class="logo-white" src={this.secondLogoWhiteSrc} alt={this.secondLogoAlt} /> */}
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
                                <button name={this.accessibility_button_name} class="tool-btn accessibility-btn" type="button" onClick={this.toggleAccessibilty}>
                                  <i class="material-icons  material-symbols-outlined">accessible_forward</i>
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
                <button name={this.search_button_name} class="tool-btn" type="button"><span class="visualy-hidden">Search</span><i class="material-icons  material-symbols-outlined">search</i></button>
            </div>

            {/* Toolbar Menu */}
            <div class="dda-toolbar-menu">
              <ul>
                <li>
                  <dda-tooltip title_text="Search" description="" position="top">
                    <div class="dda-search dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle tool-btn">
                      <label htmlFor="ddaSearch" class="visualy-hidden">{this.searchText || "Search"}</label>
                      <i class="material-icons  material-symbols-outlined">search</i>
                      <input name={this.search_input_name} type="text" id='ddaSearch' class="" placeholder={this.searchText || "Search"} />
                    </div>
                  </dda-tooltip>
                </li>

                <li>
                  <dda-tooltip title_text="Accessibility" position="top">
                    <button name={this.toggle_accessibility_button_name} class="tool-btn dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle accessibility-btn" type="button" onClick={this.toggleAccessibilty}>
                      <i class="material-icons  material-symbols-outlined">accessible_forward</i>
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
