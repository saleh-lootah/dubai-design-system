// Arabic text for the components' built-in English labels. Call applyComponentLabels() before the components load.
import { locale } from './i18n.js';

const LABELS = {
  ar: {
    'dda-alert': {
      close_button_label: 'إغلاق',
    },
    'dda-avatar': {
      verified_label: 'موثّق',
    },
    'dda-banner': {
      aria_label: 'الشرائح',
    },
    'dda-chip': {
      close_button_label: 'إزالة',
    },
    'dda-dropdown': {
      toggle_button_label: 'عرض الخيارات',
    },
    'dda-header': {
      menu_button_label: 'القائمة',
      sideMainMenuTitle: 'الروابط السريعة',
      contrast_title: 'التباين',
      contrast_description: 'اختر إعداد التباين الذي تفضّله',
      contrast_normal_text: 'عادي',
      contrast_color_blind_text: 'عمى الألوان',
      contrast_red_weakness_text: 'ضعف إدراك اللون الأحمر',
      contrast_green_weakness_text: 'ضعف إدراك اللون الأخضر',
      screen_reader_title: 'قارئ الشاشة',
      screen_reader_description: 'استمع إلى محتوى الصفحة بالنقر على «تشغيل» أو «استماع»',
      screen_reader_link_label: 'استمع إلى هذه الصفحة باستخدام ReadSpeaker',
      text_size_title: 'حجم الخط',
      text_size_description: 'استخدم الأزرار أدناه لتكبير حجم الخط أو تصغيره',
      searchText: 'بحث',
      loginText: 'تسجيل الدخول',
      accessibility_tooltip: 'إمكانية الوصول',
      accessibility_button_text: 'إمكانية الوصول',
      search_tooltip: 'بحث',
      language_tooltip: 'اللغة',
    },
    'dda-home-banner': {
      aria_label: 'أبرز المحتويات',
      previous_button_label: 'الشريحة السابقة',
      next_button_label: 'الشريحة التالية',
      pause_button_label: 'إيقاف العرض مؤقتاً',
      play_button_label: 'تشغيل العرض',
      slide_button_label: 'الانتقال إلى الشريحة',
      slide_status_label: 'الشريحة {current} من {total}',
    },
    'dda-home-carousel': {
      aria_label: 'الروابط السريعة',
    },
    'dda-number-field': {
      toggle_button_label: 'اختر العملة',
    },
    'dda-pagination': {
      previous_button_label: 'الصفحة السابقة',
      next_button_label: 'الصفحة التالية',
    },
    'dda-phonefield': {
      placeholder: 'أدخل رقم الهاتف',
      toggle_button_label: 'اختر رمز الدولة',
    },
    'dda-progressbar': {
      aria_label: 'التقدم',
    },
    'dda-search-input': {
      placeholder: 'بحث',
      clear_button_label: 'مسح البحث',
    },
    'dda-select': {
      placeholder: 'اختر خياراً',
    },
    // Not a label, but a default that depends on the language: the link arrow points the way the text reads.
    'dda-ui-card': {
      linkicon: 'arrow_back',
    },
    'dda-sticky-footer': {
      more_button_label: 'المزيد',
      aria_label: 'الإجراءات السريعة',
    },
  },
};

/** Sets each built-in label as an attribute on every instance, unless the page set it already. Call before the components load. */
export function applyComponentLabels(root = document) {
  if (locale !== 'ar') {
    return;
  }

  const labels = LABELS[locale];
  if (!labels) {
    return;
  }

  for (const [tag, tagLabels] of Object.entries(labels)) {
    const elements = root.querySelectorAll(tag);
    for (const element of elements) {
      for (const [prop, value] of Object.entries(tagLabels)) {
        // Convert camelCase prop to kebab-case attribute
        const attr = prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        if (!element.hasAttribute(attr)) {
          element.setAttribute(attr, value);
        }
      }
    }
  }
}
