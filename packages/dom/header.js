//scroll hide header footer
$(document).ready(function() {
    var lastScrollTop = 0;

    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();

        if (scrollTop > lastScrollTop && scrollTop > 50) { 
            $('.dda-menu-container').slideUp('fast');
            $('footer').slideUp('fast');
        } else {
            $('.dda-menu-container').slideDown('fast');
            $('footer').slideDown('fast');
        }
        lastScrollTop = scrollTop;
    });
});


$(document).ready(function() {
    $('.hamburger-menu-btn').click(function(event) {
        event.stopPropagation();
        $('.dda-sidemenu').toggle().css({left: "0"});
        $('.hamburger-menu-btn').toggleClass('close-menu');
        $(".dda-accessibility").slideUp(200);
        $('.megamenu-content').slideUp(200);
    });
    $(document).click(function(event) {
        if (!$(event.target).closest('.dda-sidemenu, .hamburger-menu-btn').length) {
            $('.dda-sidemenu').hide().css({left: "-375px"});
            $('.hamburger-menu-btn').removeClass('close-menu');
        }
    });
    $('.side-nav-close-btn').click(function(event) {
        $('.dda-sidemenu').hide().css({left: "-375px"});
        $('.hamburger-menu-btn').removeClass('close-menu');
    });
});


//Accessibility 
$(document).ready(function(){
	$(".accessibility-btn").click(function (event) {
	    $(".dda-accessibility").slideToggle(200);
        $('.dda-sidemenu').hide().css({left: "-375px"});
        $('.hamburger-menu-btn').removeClass('close-menu');
        $('.main_sub_menu').removeClass('showSubMenu');
        $('.megamenu-content').slideUp(200);
	    event.stopPropagation();
	});
	$(".dda-accessibility").on("click", function (event) {
	    event.stopPropagation();
	});
	$(document).on("click", function (event) {
	    $(".dda-accessibility").slideUp(200);
	});
    //
    $('.close_accessibility').click(function() {
        $(".dda-accessibility").slideUp(200);
    });
});


//Mega Menu
$(document).ready(function() {
    $('.dda-mega-menu > li > a').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.megamenu-content').slideToggle(200);
        $(this).parent().siblings().find('.megamenu-content').slideUp();
        $('.dda-mega-menu > li > a').removeClass('active');
        $(this).addClass('active');
    });
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dda-mega-menu').length) {
            $('.megamenu-content').slideUp(200);
            $('.dda-mega-menu > li > a').removeClass('active');
        }
    });
    $('.close_mega-menu').click(function() {
        $('.megamenu-content').slideUp(200);
    });
});


//press esc action
$(document).on('keydown', function(e) {
    if (e.key === "Escape") {
        $('.megamenu-content').slideUp(200);
        $('.hamburger-menu-btn').removeClass('close-menu');
        $('.dda-mega-menu > li > a').removeClass('active');
        $(".dda-accessibility").slideUp(200);
        $('.dda-sidemenu').hide().css({left: "-375px"});
    }
});


////Sidbar Menu
document.querySelectorAll('.main_side_menu li').forEach(function(li) {
    if (li.querySelector('div')) {
        li.querySelector('a').classList.add('showSub');
    }
});

document.querySelectorAll('.showSub').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        let subMenu = anchor.nextElementSibling;
        // Close all sibling submenus at the same level
        let parentLi = anchor.closest('li');
        let siblingSubMenus = parentLi.parentElement.querySelectorAll('.main_sub_menu');
        siblingSubMenus.forEach(function(menu) {
            if (menu !== subMenu) {
                menu.classList.remove('showSubMenu');
                //menu.style.top = ''; // Reset top position when hiding
            }
        });
        // Toggle the clicked submenu
        if (subMenu && subMenu.classList.contains('main_sub_menu')) {
            // If submenu is being shown, set its position
            if (!subMenu.classList.contains('showSubMenu')) {
                let parentRect = parentLi.getBoundingClientRect();
                //subMenu.style.top = `${parentRect.top}px`; // Set top position to match parent
            }
            subMenu.classList.toggle('showSubMenu');
            // Add or remove active class
            anchor.classList.toggle('icon_arrow');
        }
        // Remove active class from sibling showSub elements
        let siblingShowSubs = parentLi.parentElement.querySelectorAll('.showSub');
        siblingShowSubs.forEach(function(siblingAnchor) {
            if (siblingAnchor !== anchor) {
                siblingAnchor.classList.remove('icon_arrow');
            }
        });
    });
});
// Close all open submenus when clicking outside
document.addEventListener('click', function(event) {
    let isClickInsideMenu = event.target.closest('.main_side_menu');
    if (!isClickInsideMenu) {
        document.querySelectorAll('.main_sub_menu').forEach(function(menu) {
            menu.classList.remove('showSubMenu');
            //menu.style.top = ''; // Reset top position when hiding
        });
        // Remove active class from all showSub elements
        document.querySelectorAll('.showSub').forEach(function(anchor) {
            anchor.classList.remove('icon_arrow');
        });
    }
});


//Header Fooetr hide on scroll
// $(document).ready(function() {
//     var lastScrollTop = 0;
//     var header = $('.dda-menu-container');
//     var footer = $('footer');

//     $(window).scroll(function() {
//         var scrollTop = $(this).scrollTop();
//         if (scrollTop > lastScrollTop) {
//             // Scroll down
//             header.slideUp("fast");
//             footer.slideUp("fast");
//         } else {
//             // Scroll up
//             header.slideDown("fast");
//             footer.slideDown("fast");
//         }
//         lastScrollTop = scrollTop;
//     });
// });








