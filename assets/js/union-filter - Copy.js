// فعال‌سازی سرچ باکس هدر
document.addEventListener('DOMContentLoaded', function () {
  var toggleBtn = document.getElementById('search-toggle-btn');
  var searchBox = document.getElementById('header-search-box');
  var searchInput = document.getElementById('header-search-input');
  var searchIcon = document.getElementById('search-icon');

  if (toggleBtn && searchBox) {
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isHidden = searchBox.style.display === 'none' || searchBox.style.display === '';
      
      if (isHidden) {
        searchBox.style.display = 'block';
        searchIcon.className = 'fa fa-times'; // تغییر آیکون به ضربدر
        if (searchInput) searchInput.focus();
      } else {
        searchBox.style.display = 'none';
        searchIcon.className = 'fa fa-search';
      }
    });

    // جلوگیری از بسته شدن موقع کلیک داخل باکس سرچ
    searchBox.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    // بسته شدن خودکار در صورت کلیک روی هر نقطه دیگر صفحه
    document.addEventListener('click', function () {
      searchBox.style.display = 'none';
      if (searchIcon) searchIcon.className = 'fa fa-search';
    });
  }
});
