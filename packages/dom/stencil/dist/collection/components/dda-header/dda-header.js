import { h } from "@stencil/core";
export class DdaHeader {
    constructor() {
        this.isMenuOpen = false;
        this.isSubMenuOpen = false;
        this.isSideSubMenuOpen = false;
        this.isAccessibiltyOpen = false;
        this.lastScrollTop = 0;
        this.openMenus = {};
        this.activeMenuIndex = null;
        this.toggleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                this.isMenuOpen = false;
                this.isAccessibiltyOpen = false;
                this.isSubMenuOpen = false;
                this.isSideSubMenuOpen = false;
                this.activeMenuIndex = null;
            }
        };
        this.handleOutsideClick = (event) => {
            let isClickInsideMenu = event.target.closest('.main_side_menu');
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
        this.handleOutsideAccessibilityClick = (event) => {
            if (this.isAccessibiltyOpen) {
                const accessibilityMenu = document.querySelector('.dda-accessibility-wrap .dda-accessibility');
                const isClickInsideDesktopMenu = accessibilityMenu && accessibilityMenu.contains(event.target);
                const isClickOnToggleButton = event.target.closest('.accessibility-btn');
                if (!isClickInsideDesktopMenu && !isClickOnToggleButton) {
                    this.isAccessibiltyOpen = false;
                }
            }
        };
        this.handleOutsideMegaMenuClick = (event) => {
            if (this.activeMenuIndex !== null) {
                const megaMenu = document.querySelector('.megamenu-content');
                const isClickInsideMegaMenu = megaMenu && megaMenu.contains(event.target);
                const isClickOnToggleLink = event.target.closest('.showSub');
                if (!isClickInsideMegaMenu && !isClickOnToggleLink) {
                    this.activeMenuIndex = null;
                }
            }
        };
        this.handleScroll = () => {
            const scrollTop = window.scrollY;
            const menuContainer = document.querySelector('.dda-menu-container');
            const logoContainer = document.querySelector('.dda-header');
            if (scrollTop > this.lastScrollTop && scrollTop > 50) {
                if (menuContainer)
                    menuContainer.style.display = 'none';
                if (logoContainer)
                    logoContainer.classList.add('white');
            }
            else {
                if (menuContainer)
                    menuContainer.style.display = 'flex';
                if (logoContainer)
                    logoContainer.classList.remove('white');
            }
            this.lastScrollTop = scrollTop;
        };
        this.toggleMenu = () => {
            if (this.isAccessibiltyOpen) {
                this.isAccessibiltyOpen = false;
            }
            this.isMenuOpen = !this.isMenuOpen;
        };
        this.toggleSubMenu = (index, event) => {
            // this.isSubMenuOpen = !this.isSubMenuOpen;
            if (event)
                event.preventDefault();
            this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
        };
        this.toggleAccessibilty = () => {
            this.isAccessibiltyOpen = !this.isAccessibiltyOpen;
        };
        this.languagehandler = () => {
            this.languageSwitch.emit();
        };
        this.smTexthandler = () => {
            this.smTextSize.emit();
        };
        this.baseTexthandler = () => {
            this.baseTextSize.emit();
        };
        this.lgTexthandler = () => {
            this.lgTextSize.emit();
        };
        this.normalContrasthandler = () => {
            this.normalContrast.emit();
        };
        this.blindContrasthandler = () => {
            this.blindContrast.emit();
        };
        this.redContrasthandler = () => {
            this.redContrast.emit();
        };
        this.greenContrasthandler = () => {
            this.greenContrast.emit();
        };
        this.renderSubMenu = (subMenu, parentLi) => {
            if (!subMenu || subMenu.length === 0)
                return null;
            return (h("div", { class: `main_sub_menu ${this.openMenus[parentLi] ? 'showSubMenu' : ''}` }, subMenu[0].headerLabel && (h("p", { class: "dda-side-nav__title" }, subMenu[0].headerLabel)), h("ol", null, subMenu.map((item, index) => {
                const currentIndex = `${parentLi}-${index}`;
                return (h("li", { key: currentIndex }, h("a", { href: item.href, class: item.subMenu && item.subMenu.length > 0 ? 'showSub' : '', onClick: (e) => {
                        e.preventDefault();
                        this.toggleSidebarSubMenu(currentIndex);
                    } }, item.label), this.renderSubMenu(item.subMenu, currentIndex)));
            }))));
        };
    }
    toggleSidebarSubMenu(index) {
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
        }
        else {
            for (const key in this.openMenus) {
                if (key !== index && !key.startsWith(`${index}-`)) {
                    newOpenMenus[key] = true;
                }
            }
        }
        this.openMenus = newOpenMenus;
    }
    componentDidLoad() {
        window.addEventListener('scroll', this.handleScroll);
        document.addEventListener('click', this.handleOutsideClick);
        document.addEventListener('keydown', this.toggleEscapeKey);
        document.addEventListener('click', this.handleOutsideAccessibilityClick);
        document.addEventListener('click', this.handleOutsideMegaMenuClick);
    }
    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('click', this.handleOutsideAccessibilityClick);
        document.addEventListener('click', this.handleOutsideMegaMenuClick);
    }
    parseJsonArray(jsonString) {
        try {
            return JSON.parse(jsonString);
        }
        catch (e) {
            console.error('Failed to parse JSON:', e);
            return [];
        }
    }
    render() {
        const sideMenuItems = this.parseJsonArray(this.sideMenuItems);
        const quickLinks = this.parseJsonArray(this.quickLinks);
        const isHomepage = window.location.pathname === '/';
        const setActiveMenuIndex = (index) => {
            this.activeMenuIndex = index;
        };
        return (h("header", { key: '41639fed29dbebed7a9239236ddde70cbe0400eb', class: `dda-header ${isHomepage ? 'transparent' : ''}` }, h("div", { key: 'd6c4f3ca9136af653a8483528ae437613fc57731', class: "dda-head-logo" }, h("a", { key: 'd259161b092937a09714a84b8dc172f4b30afe43', href: "#", class: "govt-logo" }, isHomepage ? (h("img", { class: "logo-white", src: this.firstLogoWhiteSrc, alt: this.firstLogoAlt })) : (h("img", { class: "logo-colored", src: this.firstLogoSrc, alt: this.firstLogoAlt }))), h("a", { key: '910e64ef12e318fd31fff9ee287c3ece41d2196b', href: "#", class: "entt-logo" }, isHomepage ? (h("img", { class: "logo-white", src: this.secondLogoWhiteSrc, alt: this.secondLogoAlt })) : (h("img", { class: "logo-colored", src: this.secondLogoSrc, alt: this.secondLogoAlt })))), h("div", { key: '311504563edec091c4268b891ccd048d638343ec', class: "dda-menu-container" }, h("div", { key: 'f1d0e9e9c7b4b91d297be23b8a34818b37646585', class: "dda-main-navigation" }, h("div", { key: 'af9dbe4a81eb098362c986fe23d287a56aa41d04', class: `dda-menu-overley ${this.isMenuOpen ? 'show-overley' : ''}`, onClick: this.toggleMenu }), h("div", { key: 'c3df3f99ea59aad1936cf6fcf32c703c80536b61', class: "hamburger-menu", onClick: this.toggleMenu }, h("dda-tooltip", { key: 'f0db8de430d7b9cc06c222d3188482412d737e60', title_text: "Menu", position: "top", class: "d-block" }, h("button", { key: '48cbd82088e0932f1cf50f2436cdb1d448dddc57', type: "button", class: "hamburger-menu-btn", name: "hamburger-menu-button" }, h("span", { key: 'adec9f2bb3313ee3ca6038ec2543d7da54372b56', class: "hamburger-line" }), h("span", { key: '57623fff3aca16af1e914c7efcd12dbc958c79bb', class: "hamburger-menu-text" }, "hamburger menu text")))), h("div", { key: '4884715477baff0332094d2674e6320cfc9ec55f', class: "dda-sidemenu", style: { display: this.isMenuOpen ? 'block' : '', insetInlineStart: this.isMenuOpen ? '0px' : '' } }, h("div", { key: 'c8e491be71d3fb6788ce28685546ce200a121a1c', class: "dda-sidemenu-content" }, h("p", { key: 'fdb597ae62020a453e4e45e1090f3b60d2c51a90', class: "dda-side-nav-title" }, "Quick Links"), h("ul", { key: 'ca8f983ba1d1fa2658b75a00e197d9dc63c999a4', class: "main_side_menu" }, sideMenuItems.map((menu, index) => {
            const currentIndex = `menu-${index}`;
            return (h("li", { key: currentIndex }, h("a", { href: menu.href, class: menu.subMenu && menu.subMenu.length > 0 ? 'showSub' : '', onClick: (e) => {
                    if (menu.subMenu && menu.subMenu.length > 0) {
                        e.preventDefault();
                        this.toggleSidebarSubMenu(currentIndex);
                    }
                } }, menu.label), this.renderSubMenu(menu.subMenu, currentIndex)));
        }))), h("div", { key: '3d9d0ff671aec741d012cc9a520dc7c79ca54f06', class: "dda-sidemenu-bottom" }, h("div", { key: '1d2f32e99865c469253f703fff5bf504b25397fb', class: "dda-sidemenu-gov-logo" }, h("a", { key: 'bb0fe1fac9a27660e1f29d300eaa28918ea076c6', href: "#", class: "govt-logo mb-2" }, h("img", { key: '2bcfc3f989b7e33b6af4804b6458635f7d71f40e', class: "", src: this.firstLogoSrc, alt: this.firstLogoAlt }))), h("div", { key: 'c8f629ac65954282f2ede87ff42007a62b6efb42', class: "dda-toolbar-menu-sidemenu" }, h("ul", { key: 'd76f9a6a12bf6b7e92202e73ef8f1247d210c3f5' }, h("li", { key: 'c436fec678494e2f6c54fe13ede5c1f0bf4c0843' }, h("button", { key: '6798cae1decfaa70355a53498b950a44eab07788', name: this.accessibilityButtonName, class: "tool-btn accessibility-btn", type: "button", onClick: this.toggleAccessibilty }, h("i", { key: 'b595a172213c620ec6e0372e1384d5bdbb23e4be', class: "material-icons  material-symbols-outlined" }, "accessible_forward"), h("span", { key: '9add97509770a13adb05b8f7067073b5759650bb', class: "visually-hidden" }, "Accessibility"))), h("li", { key: '999ed6c6a6a4f33976a65f2283e6d500e53e04c5' }, h("button", { key: '369b5f8509edd468acc8b2d8de12d3c2223bc1fb', name: this.languageButtonName, class: "tool-btn", type: "button", onClick: this.languagehandler }, "\u0627\u0644\u0639\u0631\u0628\u064A\u0629")), h("li", { key: '41b8ebbd76588917624691dc1260f6379015a928' }, h("dda-link-button", { key: '637fa5cebadedb100fb3cf7cdb589640e56e6d28', button_color: "onsurface-secondary", start_icon: this.loginIcon || "sentiment_satisfied", custom_class: "tool-btn", href: this.loginLink, button_shape: "circle", size: "sm" }, this.loginText || "Login"))))), h("button", { key: '9dc5d3689abeca0ec7ed4d1c0982e452a209f9bd', name: this.closeMenuButtonName, class: "close-btn side-nav-close-btn", "aria-label": "Close Sidebar", onClick: this.toggleMenu }, h("i", { key: 'af7bdbade2c1fce5589b4198d1cc4892f61e0925', class: "material-icons  material-symbols-outlined" }, "close")), h("div", { key: '2082974d23136e8c9629002416d33c8fa016203c', class: "dda-accessibility hide-accessibility mobile-accessibility", style: { display: this.isAccessibiltyOpen ? 'block' : 'none' } }, h("div", { key: '2e0206003c8809c098ff4e49054f202341cb3f6b', class: "dda-row" }, h("div", { key: 'db367d863562485b5d605487bb23b4bebbe26666', class: "dda-col-md-4 dda-accessibility-item" }, h("h2", { key: 'e869b1596264fa2f87aebe094504540855c76193', class: "dda-fs-body-lg dda-fw-700 mb-1" }, "Contrast"), h("form", { key: '04f3d42790f7659e31fd8517bfde52410c3742a1' }, h("fieldset", { key: '8a1087dbfa1a5a46870b7412a29636161abf6978', class: "dda-theme-list" }, h("legend", { key: '56acda05892e7ae96071cfd136aebbfad9a8a833' }, h("p", { key: '2d5e975f30117f1242da61ea8c3563516372c939', class: "mb-3" }, "Select your preferred contrast setting ")), h("dda-radiobutton", { key: 'c28659c8454f05a806d31493021abbd44ce3fa39', title_text: "Normal", checked: true, size: "sm", variants: "normal", supporting: "", group_name: "themeselectionmobile", input_id: "NormalMobile", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.normalContrasthandler }), h("dda-radiobutton", { key: '272820d0837977d08b74ae8c34c13791f8aaedef', title_text: "Colours Blind", checked: false, size: "sm", variants: "normal", supporting: "", group_name: "themeselectionmobile", input_id: "ColoursBlindMobile", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.blindContrasthandler }), h("dda-radiobutton", { key: '14c70749d90e7e84113adf8917f1d971faa3e8ea', title_text: "Red Weakness", checked: false, size: "sm", variants: "normal", supporting: "", group_name: "themeselectionmobile", input_id: "RedWeaknessMobile", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.redContrasthandler }), h("dda-radiobutton", { key: 'a0980b8fbaa6b24118472d51d885e930e82fe83b', title_text: "Green Weakness", checked: false, size: "sm", variants: "normal", supporting: "", group_name: "themeselectionmobile", input_id: "GreenWeaknessMobile", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.greenContrasthandler })))), h("div", { key: '386d472c5231f7935810bf2b84b0047d20a01518', class: "dda-col-md-4 dda-accessibility-item" }, h("h2", { key: '60c0676cc9070a831bdd5fffbbd5c707dbdb105d', class: "dda-fs-body-lg dda-fw-700 mb-1" }, "Screen Reader"), h("p", { key: 'd86a9863c61a286a69ec587fee792d5a05e40ae5', class: "mb-3" }, "Listen to the content of the page by clicking play or listen"), h("div", { key: '2de966c6cc56acc5473f0aaff056a498c5def279', class: "rs_skip rsbtn rs_preserve", id: "readspeaker_button1" }, h("a", { key: 'cd8fea397771dd7dcf22b154f8273da5baec0b7f', href: this.readSpeakerLink, rel: "nofollow", class: "rsbtn_play circle readspeaker", accessKey: "L", "aria-label": "Listen to this page using ReadSpeaker" }, h("i", { key: 'cb4b08904cd0f8671e51e812f92177ea4e7749d0', class: "material-icons  material-symbols-outlined" }, "volume_up")))), h("div", { key: 'ecac7a3edd743631e0222d7fbb7c1f7513f41353', class: "dda-col-md-4 dda-accessibility-item" }, h("h2", { key: '48d0d7461b72d12e6c98421a18d1b8a56e955443', class: "dda-fs-body-lg dda-fw-700 mb-1" }, "Text Size"), h("p", { key: '0d41ea3e20af70f02d1dee506700c2b9ddf27e27', class: "mb-3" }, "Use the buttons below to increase or decrease the text size"), h("div", { key: '175d023e04fad65f8729c7ddc89bdc8ff796c398', class: "d-flex dda-gap-4" }, h("dda-button", { key: '7c6147534223600eb8f2324e17d871ff7b744228', button_color: "default-secondary", icon_button_shape: "circle", custom_class: "", size: "lg", onClick: this.baseTexthandler }, "A"), h("dda-button", { key: 'e0fa1779500a419089355314e611d13334aabb2a', button_color: "default-secondary", icon_button_shape: "circle", custom_class: "", size: "lg", onClick: this.lgTexthandler }, "A+"), h("dda-button", { key: '799b79fee9b53f2b979cf3ab014a6dda415aab3a', button_color: "default-secondary", icon_button_shape: "circle", custom_class: "", size: "lg", onClick: this.smTexthandler }, "A-")))), h("button", { key: '5ecf96ad0ec94435636435d4f5cfc7fd4fe4fab0', name: this.closeAccessibilityButtonName, class: "close-btn close_accessibility", "aria-label": "Close Accessibility", onClick: this.toggleAccessibilty }, h("i", { key: 'e2587db58b6401c2be720e1beaea300f921fc717', class: "material-icons  material-symbols-outlined" }, "close")))), h("div", { key: '23754787c0bdfb4359bfa16afd641816c5a67788' }, h("ul", { key: 'f5bd45f67835abb2f9627f958899f2fd28b7cf3d', class: "dda-mega-menu" }, quickLinks.map((link, index) => (h("li", { key: index }, h("a", { href: link.subMenu && link.subMenu.length > 0 ? '#' : link.href, onClick: link.subMenu && link.subMenu.length > 0 ? (e) => this.toggleSubMenu(index, e) : undefined, class: link.subMenu && link.subMenu.length > 0 ? `showSub ${this.activeMenuIndex === index ? 'icon_arrow' : ''}` : '' }, link.label), link.subMenu && link.subMenu.length > 0 && (h("div", { class: `megamenu-content ${this.activeMenuIndex === index ? 'showSubMenu' : ''}`, style: { display: this.activeMenuIndex === index ? 'block' : 'none' } }, h("div", { class: "megamenu-item dda-container" }, h("div", { class: "dda-row" }, h("div", { class: "dda-col-md-3" }, h("h3", { class: "mega-menu-title" }, link.menuLabel), h("ul", null, link.subMenu.map((subItem, subIndex) => (h("li", { key: subIndex }, h("a", { class: "megamenu-link", href: subItem.href }, h("span", { class: "dda-btn btn-color-onsurface-secondary btn-size-sm icon-btn-default" }, h("i", { class: "material-icons material-symbols-outlined" }, subItem.icon)), h("span", { class: "text-wrap" }, h("span", { class: "title-text dda-fs-body-lg dda-fw-700" }, subItem.title), h("span", { class: "dda-fs-tagline-lg dda-fw-400" }, subItem.description))))))))), h("button", { name: "close-mega-menu", class: "close-btn close_mega-menu", "aria-label": "Close Sidebar", onClick: () => setActiveMenuIndex(null) }, h("i", { class: "material-icons material-symbols-outlined" }, "close"))))))))))), h("div", { key: '3c11674e9ad777794f28c116c4eb25c86abd6449', class: "dda-mobile-entt-logo" }, h("a", { key: '29f70b4b763ceb6f987d9a51dd892c29c0c96570', href: "#", class: "entt-logo" }, h("img", { key: '142caeeddd99316e1aa6d1ec861d8099fcdd2fab', class: "logo-colored", src: this.secondLogoSrc, alt: this.secondLogoAlt }), h("img", { key: 'a9ddddb219155a4a2175cf4050e1ed62f84d2c85', class: "logo-white", src: this.secondLogoWhiteSrc, alt: this.secondLogoAlt }))), h("div", { key: '8d22fce9e451fd7f59905d6144a8ed7c087604b3', class: "dda-mobile-search" }, h("button", { key: '23a8312a42d906f88fd667208e108c09d7826016', name: this.searchButtonName, class: "tool-btn", type: "button" }, h("span", { key: '40ac4454f0def00410849c78202a1817e7bd228c', class: "visualy-hidden" }, "Search"), h("i", { key: '8a7ca95692deee6c6279c5bb81e0306ee0040fe9', class: "material-icons  material-symbols-outlined" }, "search"))), h("div", { key: '104f3f2a8b0ed2259889362adbe612bf6a2b0f8e', class: "dda-toolbar-menu" }, h("ul", { key: 'fbe7079472c249df7dc72404f67010363cbe279b' }, h("li", { key: '624eb67e08d5ebce52c8362c4350b240b8a4d96b' }, h("dda-tooltip", { key: 'cf99382ee0df95d0a95e5e95002480478c6446f2', title_text: "Search", description: "", position: "top" }, h("div", { key: '20ffa0b99a562c3e72160b65920e4cbcc4919c87', class: "dda-search dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle tool-btn" }, h("label", { key: 'dafd30504944a9c1d5f09f4c47946d842f628070', htmlFor: "ddaSearch", class: "visualy-hidden" }, this.searchText || "Search"), h("i", { key: 'b3272ca0f3c167e996cf4ea8feafdc32deed8d9a', class: "material-icons  material-symbols-outlined" }, "search"), h("input", { key: 'fa4f7cd2d19b65fdd5dbb01b4e75e0b5196e532f', name: this.searchInputName, type: "text", id: 'ddaSearch', class: "", placeholder: this.searchText || "Search" })))), h("li", { key: '7c24fe32886f1db1101cc68681806c2b8cbf788e' }, h("dda-tooltip", { key: '8d2805340dbd8e24e4803a98323a1270a8cca104', title_text: "Accessibility", position: "top" }, h("button", { key: 'c41d9dd9bf68d4648c1b73bdf3a9cbab14f11368', name: this.toggleAccessibilityButtonName, class: "tool-btn dda-btn btn-color-onsurface-secondary btn-size-sm btn-shape-circle accessibility-btn", type: "button", onClick: this.toggleAccessibilty }, h("i", { key: 'c500a4ee0b6546ef745417d36ef9cfc012de15c2', class: "material-icons  material-symbols-outlined" }, "accessible_forward"), h("span", { key: '04f91de734295c3f5fbd3c1e9253d3d0ded888fa', class: "visually-hidden" }, "Accessibility"))), h("div", { key: '1ecd217bc00090f8bbda3af4fd3915a097a80b09', class: "dda-accessibility-wrap" }, h("div", { key: 'd779e572fdb20c6cdf40bdc5284388c2bc0f46ad', class: "dda-accessibility hide-accessibility", style: { display: this.isAccessibiltyOpen ? 'block' : 'none' } }, h("div", { key: '8e5bac1f44f4c811e6d2f8d15036817d79a3c441', class: "dda-row" }, h("div", { key: '70eab0855e4698c8faa5b3bb41e479a9513081a4', class: "dda-col-md-4 dda-accessibility-item" }, h("h2", { key: 'fe038f8af58030d7fa949496901ec6bf7368378b', class: "dda-fs-body-lg dda-fw-700 mb-1" }, "Contrast"), h("form", { key: '0c00dac2b959a082352abab82d5f91da9816bde3' }, h("fieldset", { key: '20616e4a706500ce3225bf06454e84cb263cb932', class: "dda-theme-list" }, h("legend", { key: '2c49c70cb2584326c3dd285f4344d636b9b16626' }, h("p", { key: '94a60de1b2c8e5f84c94c9728a003ea52f914383', class: "mb-3" }, "Select your preferred contrast setting ")), h("dda-radiobutton", { key: '450f1cf3c6dfca8b39c690bb59ffc1b9c993f581', title_text: "Normal", checked: true, size: "sm", variants: "normal", supporting: "", group_name: "themeselection", input_id: "Normal", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.normalContrasthandler }), h("dda-radiobutton", { key: 'b1e63d281eb706875912ed15d0d2ca42de83d5dd', title_text: "Colours Blind", checked: false, size: "sm", variants: "normal", supporting: "", group_name: "themeselection", input_id: "ColoursBlind", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.blindContrasthandler }), h("dda-radiobutton", { key: '95a7d569a55658a177279e592b9974c14085bc0e', title_text: "Red Weakness", checked: false, size: "sm", variants: "normal", supporting: "", group_name: "themeselection", input_id: "RedWeakness", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.redContrasthandler }), h("dda-radiobutton", { key: '9f94b89128314c7e31678d68d5ba7a73e7b2c5ca', title_text: "Green Weakness", checked: false, size: "sm", variants: "normal", supporting: "", group_name: "themeselection", input_id: "GreenWeakness", custom_class: "", component_mode: "", aria_label: "radio-button", onClick: this.greenContrasthandler })))), h("div", { key: 'cd1aa2a77054809826ca1e1eb1e9ee7c4b19a118', class: "dda-col-md-4 dda-accessibility-item" }, h("h2", { key: 'c8747528426446b7e0a4b7c2da41faac4ac4e41a', class: "dda-fs-body-lg dda-fw-700 mb-1" }, "Screen Reader"), h("p", { key: 'af3acab66c26db4d01ee1d976ba23afcb5cd33ee', class: "mb-3" }, "Listen to the content of the page by clicking play or listen"), h("div", { key: 'd45d83296ddb91ec48d412072fe53be539109251', class: "rs_skip rsbtn rs_preserve", id: "readspeaker_button1" }, h("a", { key: '85cdf4cfda2bd22c4f426a35633175a9efc41997', href: this.readSpeakerLink, rel: "nofollow", class: "rsbtn_play circle readspeaker", accessKey: "L", "aria-label": "Listen to this page using ReadSpeaker" }, h("i", { key: 'b624e37e80d6f6d55159bb84f5e146f68c7b340e', class: "material-icons  material-symbols-outlined" }, "volume_up")))), h("div", { key: 'd4e742443dc3b118c4960592c16b2be2724a0b87', class: "dda-col-md-4 dda-accessibility-item" }, h("h2", { key: 'b0a41af364d3f56c36851809b39cf0c351f9e616', class: "dda-fs-body-lg dda-fw-700 mb-1" }, "Text Size"), h("p", { key: '3b054143734b473c769f14aa51dc06019051bf9c', class: "mb-3" }, "Use the buttons below to increase or decrease the text size"), h("div", { key: '11aa82b5866439ae2e88af210e0c43e8a355123c', class: "d-flex dda-gap-4" }, h("dda-button", { key: '93749ded7064fd52c0d0ae1b42670a0add709146', button_color: "default-secondary", icon_button_shape: "circle", custom_class: "", size: "lg", onClick: this.baseTexthandler }, "A"), h("dda-button", { key: '1ebee1242e2d9dbb61238f02c6bd20174c1a5b52', button_color: "default-secondary", icon_button_shape: "circle", custom_class: "", size: "lg", onClick: this.lgTexthandler }, "A+"), h("dda-button", { key: 'a1b476e148214030200ce7da42e97e5e69a60c5d', button_color: "default-secondary", icon_button_shape: "circle", custom_class: "", size: "lg", onClick: this.smTexthandler }, "A-")))), h("button", { key: '0b407faed1bdccba3facd1f21b3ed5bfcca857dc', name: this.closeAccessibilityButtonName, class: "close-btn close_accessibility", "aria-label": "Close Sidebar", onClick: this.toggleAccessibilty }, h("i", { key: 'f4c05289ddf0b107a06a90f4f9ccd57fd97c1cc7', class: "materinal-icons  material-symbols-outlined" }, "close"))))), h("li", { key: '926138ab64d31dd4f613f4304053c12748b8d8c4' }, h("dda-tooltip", { key: '23a2c32854055f0d420b0d97bd62ed76b0891f92', title_text: "Language", position: "top" }, h("dda-button", { key: 'ebecac5afb4af0661996c645bed2d6bc66a6645d', button_color: "onsurface-secondary", custom_class: "tool-btn", button_shape: "circle", size: "sm", onClick: this.languagehandler }, this.languageText))), h("li", { key: '91c44642f799aaa0874ac6f8850f805a3db7c9b0' }, h("dda-tooltip", { key: '5b7c2836137cba22b4a0f2f7eb89416c940a65a4', title_text: "Login", position: "top" }, h("dda-link-button", { key: '78d1be43964b48c02b90eef8602d308e0486454d', button_color: "onsurface-secondary", start_icon: "sentiment_satisfied", custom_class: "tool-btn", href: this.loginLink, button_shape: "circle", size: "sm" }, "Login"))))))));
    }
    static get is() { return "dda-header"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-header.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-header.css"]
        };
    }
    static get properties() {
        return {
            "firstLogoSrc": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "first-logo-src",
                "reflect": false
            },
            "firstLogoWhiteSrc": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "first-logo-white-src",
                "reflect": false
            },
            "firstLogoAlt": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "first-logo-alt",
                "reflect": false
            },
            "secondLogoSrc": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "second-logo-src",
                "reflect": false
            },
            "secondLogoWhiteSrc": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "second-logo-white-src",
                "reflect": false
            },
            "secondLogoAlt": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "second-logo-alt",
                "reflect": false
            },
            "loginLink": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "login-link",
                "reflect": false
            },
            "sideMenuItems": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "side-menu-items",
                "reflect": false
            },
            "quickLinks": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "quick-links",
                "reflect": false
            },
            "readSpeakerLink": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "read-speaker-link",
                "reflect": false
            },
            "searchText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "search-text",
                "reflect": false
            },
            "loginIcon": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "login-icon",
                "reflect": false
            },
            "loginText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "login-text",
                "reflect": false
            },
            "languageText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "language-text",
                "reflect": false
            },
            "hamburgerMenuButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "hamburger-menu-button-name",
                "reflect": false
            },
            "accessibilityButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "accessibility-button-name",
                "reflect": false
            },
            "searchButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "search-button-name",
                "reflect": false
            },
            "searchInputName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "search-input-name",
                "reflect": false
            },
            "languageButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "language-button-name",
                "reflect": false
            },
            "closeMenuButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "close-menu-button-name",
                "reflect": false
            },
            "closeAccessibilityButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "close-accessibility-button-name",
                "reflect": false
            },
            "closeSidebarButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "close-sidebar-button-name",
                "reflect": false
            },
            "toggleAccessibilityButtonName": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "toggle-accessibility-button-name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "isMenuOpen": {},
            "isSubMenuOpen": {},
            "isSideSubMenuOpen": {},
            "isAccessibiltyOpen": {},
            "openMenus": {},
            "activeMenuIndex": {}
        };
    }
    static get events() {
        return [{
                "method": "languageSwitch",
                "name": "languageSwitch",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "smTextSize",
                "name": "smTextSize",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "baseTextSize",
                "name": "baseTextSize",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "lgTextSize",
                "name": "lgTextSize",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "normalContrast",
                "name": "normalContrast",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "blindContrast",
                "name": "blindContrast",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "redContrast",
                "name": "redContrast",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "greenContrast",
                "name": "greenContrast",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=dda-header.js.map
