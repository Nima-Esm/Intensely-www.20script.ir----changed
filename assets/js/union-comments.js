/**
 * assets/js/union-comments.js
 * مدیریت سیستم ثبت و نمایش نظرات کاربران با پشتیبانی از LocalStorage
 */

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('comment-form');
  var list = document.getElementById('comments-list');

  if (!form || !list) return;

  // کلید ذخیره‌سازی در مرورگر
  var STORAGE_KEY = 'union_user_comments';

  // تولید آیکون‌های ستاره بر اساس امتیاز
  function renderStars(rating) {
    rating = parseInt(rating, 10) || 5;
    var starsHtml = '';
    for (var i = 1; i <= 5; i++) {
      starsHtml += '<i class="fa ' + (i <= rating ? 'fa-star' : 'fa-star-o') + '" style="color:#f59e0b; margin-left:2px;"></i>';
    }
    return starsHtml;
  }

  // قالب ساخت المان کارت نظر در صفحه
  function createCommentElement(item) {
    var card = document.createElement('div');
    card.className = 'comment-card';
    card.style.cssText = 'border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); transition: all 0.2s;';

    var header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;';

    var author = document.createElement('div');
    author.innerHTML = '<i class="fa fa-user-circle" style="color: #64748b; margin-left: 6px;"></i><strong style="color: #0f172a; font-size: 14px;">' + escapeHtml(item.name) + '</strong>';

    var meta = document.createElement('div');
    meta.style.cssText = 'font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 10px;';
    meta.innerHTML = '<span>' + renderStars(item.rate) + ' (' + item.rate + ' از ۵)</span> <span style="color: #94a3b8;">• ' + (item.date || 'امروز') + '</span>';

    header.appendChild(author);
    header.appendChild(meta);

    var content = document.createElement('p');
    content.style.cssText = 'font-size: 13px; color: #334155; line-height: 1.7; margin: 0;';
    content.textContent = item.text;

    card.appendChild(header);
    card.appendChild(content);

    return card;
  }

  // جلوگیری از حملات XSS ساده
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // بارگذاری نظرات قبلی از LocalStorage
  function loadComments() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        var comments = JSON.parse(saved);
        comments.forEach(function (c) {
          list.appendChild(createCommentElement(c));
        });
      } catch (e) {
        console.error('خطا در بارگذاری نظرات:', e);
      }
    }
  }

  // ذخیره نظر جدید در LocalStorage
  function saveComment(commentObj) {
    var saved = localStorage.getItem(STORAGE_KEY);
    var comments = saved ? JSON.parse(saved) : [];
    comments.unshift(commentObj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }

  // رویداد ارسال فرم نظر
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = document.getElementById('cm-name');
    var rateInput = document.getElementById('cm-rate');
    var textInput = document.getElementById('cm-text');

    var name = nameInput.value.trim();
    var rate = rateInput.value;
    var text = textInput.value.trim();

    if (!name || !text) return;

    var newComment = {
      name: name,
      rate: rate,
      text: text,
      date: new Date().toLocaleDateString('fa-IR')
    };

    // اضافه کردن به ابتدای لیست با افکت
    var element = createCommentElement(newComment);
    list.insertBefore(element, list.firstChild);

    // ذخیره در دیتابیس لوکال
    saveComment(newComment);

    // ریست کردن فرم
    form.reset();
  });

  // اجرا در هنگام بارگذاری صفحه
  loadComments();
});
