/**
 * مدیریت ثبت، نمایش و ذخیره‌سازی محلی نظرات اتحادیه
 */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('comment-form');
  var list = document.getElementById('comments-list');

  if (!form || !list) return;

  var STORAGE_KEY = 'union_user_comments';

  // تابع تبدیل ارقام به فارسی
  function toPersianDigits(value) {
    return String(value).replace(/[0-9]/g, function (digit) {
      return '۰۱۲۳۴۵۶۷۸۹'[Number(digit)];
    });
  }

  // جلوگیری از تزریق کدهای مخرب HTML
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // تولید ستاره‌های طلایی
  function renderStars(rate) {
    var r = parseInt(rate, 10) || 5;
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      if (i <= r) {
        stars += '<i class="fa fa-star"></i>';
      } else {
        stars += '<i class="fa fa-star-o"></i>';
      }
    }
    return stars;
  }

  // ساخت کارت نظر دقیقاً کپیِ کارت‌های نمونه و باکلاس صفحه
  function createCommentElement(item) {
    var card = document.createElement('div');
    card.className = 'comment-card';
    card.style.cssText = 'border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.02);';

    var r = parseInt(item.rate, 10) || 5;
    var roleBadge = item.role ? `<span style="background: #f1f5f9; color: #475569; font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-right: 4px;">${escapeHtml(item.role)}</span>` : '';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa fa-user-circle" style="font-size: 20px; color: #64748b;"></i>
          <strong style="color: #0f172a; font-size: 14px;">${escapeHtml(item.name)}</strong>
          ${roleBadge}
        </div>
        <div style="font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 8px;">
          <span style="color: #f59e0b;">
            ${renderStars(r)}
          </span>
          <span>(${toPersianDigits(r)} از ۵)</span>
          <span style="color: #cbd5e1;">|</span>
          <span>${item.date || 'امروز'}</span>
        </div>
      </div>
      <p style="font-size: 13px; color: #334155; line-height: 1.8; margin: 0;">
        ${escapeHtml(item.text)}
      </p>
    `;

    return card;
  }

  // خواندن نظرات ذخیره شده از قبل
  function readSavedComments() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  // ذخیره نظر جدید
  function saveComment(comment) {
    try {
      var comments = readSavedComments();
      comments.unshift(comment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch (e) {
      console.error(e);
    }
  }

  // بارگذاری نظرات قبلی کاربر هنگام لود صفحه
  function loadComments() {
    var comments = readSavedComments();
    comments.forEach(function (comment) {
      list.appendChild(createCommentElement(comment));
    });
  }

  // رویداد سابمیت فرم
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // پشتیبانی همزمان از آی‌دی‌های جدید و قدیم
    var nameInput = document.getElementById('comment-name') || document.getElementById('cm-name');
    var textInput = document.getElementById('comment-text') || document.getElementById('cm-text');
    var rateInput = document.getElementById('comment-rating') || document.getElementById('cm-rate');
    var roleInput = document.getElementById('comment-role');

    if (!nameInput || !textInput) return;

    var name = nameInput.value.trim();
    var text = textInput.value.trim();
    var rate = rateInput ? rateInput.value : 5;
    var role = roleInput ? roleInput.value : 'مراجعه‌کننده عمومی';

    if (!name || !text) {
      alert('لطفاً نام و متن نظر را وارد کنید.');
      return;
    }

    var newComment = {
      name: name,
      role: role,
      rate: rate,
      text: text,
      date: new Date().toLocaleDateString('fa-IR')
    };

    // افزودن نظر دقیقاً به ابتدای لیست
    var element = createCommentElement(newComment);
    list.insertBefore(element, list.firstChild);

    // ذخیره در LocalStorage
    saveComment(newComment);

    // خالی کردن فرم
    form.reset();
  });

  // اجرای بارگذاری
  loadComments();

  // ---------- فعال‌سازی ستاره‌های امتیازدهی ----------
(function () {
  var container = document.getElementById('star-rating');
  var rateInput = document.getElementById('cm-rate');
  if (!container || !rateInput) return;

  var stars = container.querySelectorAll('i');
  var selected = 5; // پیش‌فرض: ۵ ستاره

  function paintUpTo(count) {
    stars.forEach(function (star) {
      var value = parseInt(star.getAttribute('data-rate'), 10);
      if (value <= count) {
        star.classList.remove('fa-star-o');
        star.classList.add('fa-star');
        star.style.color = '#f59e0b'; // طلایی
      } else {
        star.classList.add('fa-star-o');
        star.classList.remove('fa-star');
        star.style.color = '#cbd5e1'; // خاکستری روشن
      }
    });
  }

  stars.forEach(function (star) {
    var value = parseInt(star.getAttribute('data-rate'), 10);

    // پیش‌نمایش با هاور ماوس
    star.addEventListener('mouseenter', function () {
      paintUpTo(value);
    });

    // ثبت امتیاز با کلیک
    star.addEventListener('click', function () {
      selected = value;
      rateInput.value = selected;
      paintUpTo(selected);
    });
  });

  // وقتی ماوس از محدوده ستاره‌ها خارج شد، برگرد به انتخاب نهایی
  container.addEventListener('mouseleave', function () {
    paintUpTo(selected);
  });

  // رنگ اولیه هنگام لود صفحه
  paintUpTo(selected);
})();

});
