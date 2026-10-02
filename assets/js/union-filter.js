document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("unionSearchInput");
  const categoryFilter = document.getElementById("unionCategoryFilter");
  const unionItems = document.querySelectorAll(".union-item");

  function applyFilters() {
    const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";

    unionItems.forEach(function (item) {
      const itemText = item.innerText.toLowerCase();
      const itemCategory = item.getAttribute("data-category");

      const matchesSearch = itemText.includes(searchText);
      const matchesCategory = selectedCategory === "all" || itemCategory === selectedCategory;

      if (matchesSearch && matchesCategory) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  // ثبت ایونت‌ لیسنرها
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }
});

// عملکرد دوحالته دکمه نمایش / بستن سایر اتحادیه‌ها
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleUnionsBtn');
  const btnText = document.getElementById('toggleBtnText');
  let isExpanded = false; // وضعیت باز یا بسته بودن

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const extraCards = document.querySelectorAll('.extra-union');
      const icon = toggleBtn.querySelector('i');

      if (!isExpanded) {
        // --- حالت باز کردن (نمایش اتحادیه‌ها) ---
        extraCards.forEach(function (card) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease';
            card.style.opacity = '1';
          }, 30);
        });

        btnText.innerText = 'بستن لیست اتحادیه‌ها';
        icon.className = 'fa fa-chevron-up';
        toggleBtn.style.backgroundColor = '#f8fafc';
        toggleBtn.style.borderColor = '#64748b';
        toggleBtn.style.color = '#475569';
        isExpanded = true;

      } else {
        // --- حالت بستن (مخفی کردن اتحادیه‌ها) ---
        extraCards.forEach(function (card) {
          card.style.display = 'none';
          card.style.opacity = '0';
        });

        btnText.innerText = 'مشاهده سایر اتحادیه‌ها';
        icon.className = 'fa fa-chevron-down';
        toggleBtn.style.backgroundColor = '#ffffff';
        toggleBtn.style.borderColor = '#2563eb';
        toggleBtn.style.color = '#2563eb';
        isExpanded = false;

        // اسکرول نرم به ابتدای سکشن اتحادیه‌ها تا کاربر بالا برگرده
        const targetSection = document.getElementById('representatives-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
});
