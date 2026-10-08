/**
 * Food Rescue MVP - Application Controller & Client Router
 * Pure Vanilla JavaScript - No external frameworks
 * Non-AI food rescue platform
 */

(function () {
  'use strict';

  // State
  let currentActiveId = null;
  let currentSearchQuery = '';
  let currentFoodTypeFilter = 'ALL';
  let currentLocationFilter = 'ALL';
  let currentAvailabilityFilter = 'ALL';

  // DOM Elements - Views
  const views = {
    home: document.getElementById('view-home'),
    donate: document.getElementById('view-donate'),
    login: document.getElementById('view-login'),
    find: document.getElementById('view-find'),
    details: document.getElementById('view-details'),
    confirmation: document.getElementById('view-claim-confirmation')
  };

  const navLinks = {
    home: document.getElementById('navHome'),
    donate: document.getElementById('navDonate'),
    login: document.getElementById('navLogin'),
    find: document.getElementById('navFind')
  };

  const mobileNavLinks = {
    home: document.getElementById('mNavHome'),
    donate: document.getElementById('mNavDonate'),
    login: document.getElementById('mNavLogin'),
    find: document.getElementById('mNavFind')
  };

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const navUserBadge = document.getElementById('navUserBadge');
  const navUserName = document.getElementById('navUserName');
  const navLogoutBtn = document.getElementById('navLogoutBtn');

  // Modal
  const claimModal = document.getElementById('claimModal');
  const confirmClaimBtn = document.getElementById('confirmClaimBtn');
  const cancelClaimBtn = document.getElementById('cancelClaimBtn');
  const modalFoodSummary = document.getElementById('modalFoodSummary');

  // Toast
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================================================
  // Toast Helper
  // ==========================================================================
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'info' ? 'toast-info' : ''}`;

    let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B8D3A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else if (type === 'info') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#164E36" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <span style="display:flex;align-items:center;">${iconSvg}</span>
      <span style="flex:1;">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // Hash-Based Router
  // ==========================================================================
  function parseHash() {
    const raw = window.location.hash.slice(1) || 'home';
    const parts = raw.split('?');
    const route = parts[0];
    const params = new URLSearchParams(parts[1] || '');
    return { route, params };
  }

  function handleRoute() {
    const { route, params } = parseHash();

    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');

    Object.values(views).forEach(view => { if (view) view.classList.remove('active'); });
    Object.values(navLinks).forEach(link => { if (link) link.classList.remove('active'); });
    Object.values(mobileNavLinks).forEach(link => { if (link) link.classList.remove('active'); });

    if (route === 'home' || route === '') {
      activateView('home');
      setNavActive('home');
      renderHomePage();
    } else if (route === 'donate') {
      activateView('donate');
      setNavActive('donate');
      setupDonateForm();
    } else if (route === 'find') {
      activateView('find');
      setNavActive('find');
      renderFindFoodPage();
    } else if (route === 'login') {
      activateView('login');
      setNavActive('login');
      renderLoginPage();
    } else if (route === 'details') {
      const id = params.get('id');
      if (!id) { window.location.hash = '#find'; return; }
      activateView('details');
      setNavActive('find');
      renderDetailsPage(id);
    } else if (route === 'claim-confirmation') {
      const id = params.get('id');
      if (!id) { window.location.hash = '#find'; return; }
      activateView('confirmation');
      setNavActive('find');
      renderConfirmationPage(id);
    } else {
      activateView('home');
      setNavActive('home');
      renderHomePage();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function activateView(viewKey) {
    if (views[viewKey]) views[viewKey].classList.add('active');
  }

  function setNavActive(navKey) {
    if (navLinks[navKey]) navLinks[navKey].classList.add('active');
    if (mobileNavLinks[navKey]) mobileNavLinks[navKey].classList.add('active');
  }

  // ==========================================================================
  // User Session
  // ==========================================================================
  function updateUserSessionUI() {
    const user = window.foodStore.getUser();
    const mNavUserStatus = document.getElementById('mNavUserStatus');
    if (user) {
      if (navUserBadge) { navUserBadge.style.display = 'inline-flex'; navUserName.textContent = user.name; }
      if (mNavUserStatus) mNavUserStatus.textContent = 'Signed in: ' + user.name;
    } else {
      if (navUserBadge) navUserBadge.style.display = 'none';
      if (mNavUserStatus) mNavUserStatus.textContent = 'Not logged in';
    }
  }

  if (navLogoutBtn) {
    navLogoutBtn.addEventListener('click', () => {
      window.foodStore.setUser(null);
      updateUserSessionUI();
      showToast('You have signed out successfully.', 'info');
      window.location.hash = '#home';
    });
  }

  // ==========================================================================
  // 1. HOME PAGE
  // ==========================================================================
  function renderHomePage() {
    const items = window.foodStore.getItems();
    const availableItems = items.filter(i => i.status === 'Available');

    const totalMeals = items.reduce((acc, curr) => acc + (curr.quantityNumber || 10), 0);
    const homeTotalMealsStat = document.getElementById('homeTotalMealsStat');
    const homeAvailableMealsStat = document.getElementById('homeAvailableMealsStat');
    if (homeTotalMealsStat) homeTotalMealsStat.textContent = totalMeals + '+';
    if (homeAvailableMealsStat) homeAvailableMealsStat.textContent = availableItems.length.toString();

    const homeFeaturedGrid = document.getElementById('homeFeaturedGrid');
    if (!homeFeaturedGrid) return;
    const featuredItems = availableItems.slice(0, 3);
    homeFeaturedGrid.innerHTML = '';
    featuredItems.forEach(item => homeFeaturedGrid.appendChild(createFoodCard(item)));
  }

  // ==========================================================================
  // Food Card Creator (Used in Home and Find Food)
  // ==========================================================================
  function createFoodCard(item) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.dataset.id = item.id;

    const isVeg = item.dietary === 'Vegetarian' || item.foodType === 'Vegetarian';
    const typeLabel = isVeg ? '🌱 Vegetarian' : '🍗 Non-Veg';
    const typeBadgeColor = isVeg ? 'var(--color-primary-green)' : '#C05621';
    const location = item.pickupLocation || item.location || 'Unknown Location';
    const shortLocation = location.length > 40 ? location.substring(0, 37) + '...' : location;
    const desc = item.description || '';
    const shortDesc = desc.length > 80 ? desc.substring(0, 77) + '...' : desc;

    card.innerHTML = `
      <div class="food-card-img-wrapper">
        <img 
          src="${escapeHtml(item.imageUrl)}" 
          alt="${escapeHtml(item.name)}" 
          class="food-card-img" 
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'"
        >
        <span class="food-card-type-tag" style="background:${typeBadgeColor};">${typeLabel}</span>
      </div>

      <div class="food-card-content">
        <h3 class="food-card-title">${escapeHtml(item.name)}</h3>
        ${shortDesc ? `<p class="food-card-desc">${escapeHtml(shortDesc)}</p>` : ''}

        <div class="food-card-meta">
          <div class="card-meta-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" stroke-width="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <strong class="card-meta-meals">${escapeHtml(item.quantity)}</strong>
          </div>
          <div class="card-meta-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="card-meta-location">📍 ${escapeHtml(item.location)}</span>
          </div>
          <div class="card-meta-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="card-meta-until">Available until: <strong>${escapeHtml(item.availableUntil)}</strong></span>
          </div>
        </div>

        <div class="food-card-footer">
          <a href="#details?id=${encodeURIComponent(item.id)}" class="btn-view-details">
            View Details →
          </a>
        </div>
      </div>
    `;

    return card;
  }

  // ==========================================================================
  // 2. FIND FOOD PAGE
  // ==========================================================================
  function renderFindFoodPage() {
    const foodListingGrid = document.getElementById('foodListingGrid');
    const findResultsSummary = document.getElementById('findResultsSummary');
    if (!foodListingGrid) return;

    // Always start with Available items only
    let items = window.foodStore.getItems().filter(item => item.status === 'Available');

    // Populate location dropdown dynamically
    populateLocationDropdown(window.foodStore.getItems().filter(i => i.status === 'Available'));

    // Filter: Food Type (Vegetarian / Non-Vegetarian)
    if (currentFoodTypeFilter !== 'ALL') {
      items = items.filter(item => {
        const itemType = item.dietary || item.foodType || '';
        return itemType.toLowerCase() === currentFoodTypeFilter.toLowerCase();
      });
    }

    // Filter: Location
    if (currentLocationFilter !== 'ALL') {
      items = items.filter(item => {
        const loc = (item.location || '').toLowerCase();
        return loc.includes(currentLocationFilter.toLowerCase());
      });
    }

    // Filter: Availability (time-based is approximate for demo)
    // We just show all for 'today' and 'urgent'; full implementation would parse times

    // Search Query
    if (currentSearchQuery.trim()) {
      const q = currentSearchQuery.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.foodType || '').toLowerCase().includes(q) ||
        (item.dietary || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.donorName || '').toLowerCase().includes(q)
      );
    }

    // Results Summary
    if (findResultsSummary) {
      const count = items.length;
      if (count === 0) {
        findResultsSummary.textContent = 'No results found';
      } else {
        findResultsSummary.textContent = `${count} food listing${count === 1 ? '' : 's'} available`;
      }
    }

    foodListingGrid.innerHTML = '';

    if (items.length === 0) {
      foodListingGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 class="empty-state-title">No food available right now.</h3>
          <p class="empty-state-text">Check again later or consider donating surplus food.</p>
          <a href="#donate" class="btn btn-primary btn-empty-donate">
            Donate Food
          </a>
        </div>
      `;
      return;
    }

    items.forEach(item => foodListingGrid.appendChild(createFoodCard(item)));
  }

  function populateLocationDropdown(items) {
    const locationSelect = document.getElementById('filterLocation');
    if (!locationSelect) return;
    const current = locationSelect.value;
    const locations = [...new Set(items.map(i => i.location).filter(Boolean))];
    locationSelect.innerHTML = '<option value="ALL">All Locations</option>';
    locations.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc;
      opt.textContent = loc;
      if (loc === current) opt.selected = true;
      locationSelect.appendChild(opt);
    });
  }

  // Wire Find Food filters
  const foodSearchInput = document.getElementById('foodSearchInput');
  if (foodSearchInput) {
    foodSearchInput.addEventListener('input', e => {
      currentSearchQuery = e.target.value;
      renderFindFoodPage();
    });
  }

  const filterFoodType = document.getElementById('filterFoodType');
  if (filterFoodType) {
    filterFoodType.addEventListener('change', e => {
      currentFoodTypeFilter = e.target.value;
      renderFindFoodPage();
    });
  }

  const filterLocation = document.getElementById('filterLocation');
  if (filterLocation) {
    filterLocation.addEventListener('change', e => {
      currentLocationFilter = e.target.value;
      renderFindFoodPage();
    });
  }

  const filterAvailability = document.getElementById('filterAvailability');
  if (filterAvailability) {
    filterAvailability.addEventListener('change', e => {
      currentAvailabilityFilter = e.target.value;
      renderFindFoodPage();
    });
  }

  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      currentFoodTypeFilter = 'ALL';
      currentLocationFilter = 'ALL';
      currentAvailabilityFilter = 'ALL';
      if (foodSearchInput) foodSearchInput.value = '';
      if (filterFoodType) filterFoodType.value = 'ALL';
      if (filterLocation) filterLocation.value = 'ALL';
      if (filterAvailability) filterAvailability.value = 'ALL';
      renderFindFoodPage();
    });
  }

  // ==========================================================================
  // 3. FOOD DETAILS PAGE (Two-Column)
  // ==========================================================================
  function renderDetailsPage(id) {
    const item = window.foodStore.getItemById(id);
    if (!item) {
      showToast('Food item not found.', 'error');
      window.location.hash = '#find';
      return;
    }

    currentActiveId = item.id;

    const detailImage = document.getElementById('detailImage');
    const detailTypeBadge = document.getElementById('detailTypeBadge');
    const detailFoodName = document.getElementById('detailFoodName');
    const detailFoodDesc = document.getElementById('detailFoodDesc');
    const detailQuantityText = document.getElementById('detailQuantityText');
    const detailLocationText = document.getElementById('detailLocationText');
    const detailAvailabilityText = document.getElementById('detailAvailabilityText');
    const detailDonorText = document.getElementById('detailDonorText');
    const claimFoodBtn = document.getElementById('claimFoodBtn');
    const alreadyClaimedBox = document.getElementById('alreadyClaimedBox');

    // Populate image
    if (detailImage) {
      detailImage.src = item.imageUrl || '';
      detailImage.alt = item.name;
      detailImage.onerror = () => {
        detailImage.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
      };
    }

    // Food type badge
    const isVeg = item.dietary === 'Vegetarian' || item.foodType === 'Vegetarian';
    if (detailTypeBadge) {
      detailTypeBadge.textContent = isVeg ? '🌱 Vegetarian' : '🍗 Non-Vegetarian';
      detailTypeBadge.style.background = isVeg ? 'rgba(22, 78, 54, 0.9)' : 'rgba(192, 86, 33, 0.9)';
    }

    // Text fields
    if (detailFoodName) detailFoodName.textContent = item.name;
    if (detailFoodDesc) detailFoodDesc.textContent = item.description || '';
    if (detailQuantityText) detailQuantityText.textContent = item.quantity + ' available';
    if (detailLocationText) {
      const pickupLoc = item.pickupLocation || item.location || 'Pickup Location';
      detailLocationText.textContent = '📍 ' + pickupLoc;
    }
    if (detailAvailabilityText) detailAvailabilityText.textContent = 'Available until ' + item.availableUntil;
    if (detailDonorText) detailDonorText.textContent = 'Donated by: ' + (item.donorOrg || item.donorName || 'Community Donor');

    // Claim button state
    if (item.status === 'Claimed') {
      if (claimFoodBtn) claimFoodBtn.style.display = 'none';
      if (alreadyClaimedBox) {
        alreadyClaimedBox.style.display = 'block';
        alreadyClaimedBox.textContent = '✓ This food donation has already been claimed.';
      }
    } else {
      if (claimFoodBtn) {
        claimFoodBtn.style.display = 'block';
        claimFoodBtn.disabled = false;
      }
      if (alreadyClaimedBox) alreadyClaimedBox.style.display = 'none';
    }
  }

  // Claim This Food → Open Modal
  const claimFoodBtn = document.getElementById('claimFoodBtn');
  if (claimFoodBtn) {
    claimFoodBtn.addEventListener('click', () => {
      const item = window.foodStore.getItemById(currentActiveId);
      if (!item || item.status === 'Claimed') return;
      if (modalFoodSummary) {
        modalFoodSummary.textContent = `${item.name} (${item.quantity})`;
      }
      if (claimModal) claimModal.classList.add('open');
    });
  }

  // Close modal on Cancel
  if (cancelClaimBtn) {
    cancelClaimBtn.addEventListener('click', () => {
      if (claimModal) claimModal.classList.remove('open');
    });
  }

  // Close modal on backdrop click
  if (claimModal) {
    claimModal.addEventListener('click', e => {
      if (e.target === claimModal) claimModal.classList.remove('open');
    });
  }

  // Confirm Claim → Update status, save to localStorage, redirect
  if (confirmClaimBtn) {
    confirmClaimBtn.addEventListener('click', () => {
      if (!currentActiveId) return;
      const claimedItem = window.foodStore.claimItem(currentActiveId, { name: 'Community Member' });
      if (!claimedItem) {
        showToast('Unable to claim this item.', 'error');
        return;
      }
      if (claimModal) claimModal.classList.remove('open');
      showToast(`🎉 Food claimed successfully!`, 'success');
      window.location.hash = `#claim-confirmation?id=${encodeURIComponent(claimedItem.id)}`;
    });
  }

  // ==========================================================================
  // 4. CLAIM CONFIRMATION PAGE
  // ==========================================================================
  function renderConfirmationPage(id) {
    const item = window.foodStore.getItemById(id);
    if (!item) { window.location.hash = '#find'; return; }

    const confirmFoodName = document.getElementById('confirmFoodName');
    const confirmQuantity = document.getElementById('confirmQuantity');
    const confirmLocation = document.getElementById('confirmLocation');
    const confirmPickupTime = document.getElementById('confirmPickupTime');
    const confirmDonorInfo = document.getElementById('confirmDonorInfo');

    if (confirmFoodName) confirmFoodName.textContent = item.name;
    if (confirmQuantity) confirmQuantity.textContent = item.quantity;
    if (confirmLocation) confirmLocation.textContent = item.pickupLocation || item.location || 'Pickup Location';
    if (confirmPickupTime) confirmPickupTime.textContent = 'Available until ' + item.availableUntil;
    if (confirmDonorInfo) {
      const donorDisplay = item.donorOrg || item.donorName || 'Community Donor';
      const contactDisplay = item.donorContact ? ` • ${item.donorContact}` : '';
      confirmDonorInfo.textContent = donorDisplay + contactDisplay;
    }
  }

  // ==========================================================================
  // 5. DONATE FOOD PAGE
  // ==========================================================================
  let selectedPresetImageUrl = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80';
  let uploadedImageBase64 = null;

  function setupDonateForm() {
    const selectedFoodType = document.getElementById('selectedFoodType');
    const typeVegBtn = document.getElementById('typeVegBtn');
    const typeNonVegBtn = document.getElementById('typeNonVegBtn');
    const donorNameInput = document.getElementById('donorNameInput');
    const donorPhoneInput = document.getElementById('donorPhoneInput');
    const imageUploadBox = document.getElementById('imageUploadBox');
    const foodImageFileInput = document.getElementById('foodImageFileInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreviewElement = document.getElementById('imagePreviewElement');
    const removeImageBtn = document.getElementById('removeImageBtn');

    const user = window.foodStore.getUser();
    if (user && donorNameInput && !donorNameInput.value) {
      donorNameInput.value = user.name;
      if (donorPhoneInput && user.contact) donorPhoneInput.value = user.contact;
    }

    if (typeVegBtn && typeNonVegBtn) {
      typeVegBtn.onclick = () => {
        typeVegBtn.classList.add('active');
        typeNonVegBtn.classList.remove('active');
        if (selectedFoodType) selectedFoodType.value = 'Vegetarian';
      };
      typeNonVegBtn.onclick = () => {
        typeNonVegBtn.classList.add('active');
        typeVegBtn.classList.remove('active');
        if (selectedFoodType) selectedFoodType.value = 'Non-Vegetarian';
      };
    }

    if (imageUploadBox && foodImageFileInput) {
      imageUploadBox.onclick = () => foodImageFileInput.click();
      imageUploadBox.ondragover = e => { e.preventDefault(); imageUploadBox.style.borderColor = 'var(--color-primary-green)'; };
      imageUploadBox.ondragleave = () => { imageUploadBox.style.borderColor = 'rgba(59, 141, 58, 0.35)'; };
      imageUploadBox.ondrop = e => {
        e.preventDefault();
        imageUploadBox.style.borderColor = 'rgba(59, 141, 58, 0.35)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileChosen(e.dataTransfer.files[0]);
      };
      foodImageFileInput.onchange = e => {
        if (e.target.files && e.target.files[0]) handleFileChosen(e.target.files[0]);
      };
    }

    function handleFileChosen(file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file (PNG, JPG, WEBP).', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        uploadedImageBase64 = event.target.result;
        if (imagePreviewElement) imagePreviewElement.src = uploadedImageBase64;
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
        if (imageUploadBox) imageUploadBox.style.display = 'none';
        document.querySelectorAll('.preset-thumbnail-btn').forEach(btn => btn.classList.remove('active'));
      };
      reader.readAsDataURL(file);
    }

    if (removeImageBtn) {
      removeImageBtn.onclick = () => {
        uploadedImageBase64 = null;
        if (foodImageFileInput) foodImageFileInput.value = '';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
        if (imageUploadBox) imageUploadBox.style.display = 'flex';
      };
    }

    const presetButtons = document.querySelectorAll('.preset-thumbnail-btn');
    presetButtons.forEach(btn => {
      btn.onclick = () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPresetImageUrl = btn.dataset.img;
        uploadedImageBase64 = null;
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
        if (imageUploadBox) imageUploadBox.style.display = 'flex';
      };
    });
  }

  const donationForm = document.getElementById('donationForm');
  const donationSuccessModal = document.getElementById('donationSuccessModal');
  const goToFindFoodBtn = document.getElementById('goToFindFoodBtn');

  if (donationForm) {
    donationForm.addEventListener('submit', e => {
      e.preventDefault();

      const foodName = document.getElementById('foodNameInput').value.trim();
      const foodDescription = document.getElementById('foodDescriptionInput').value.trim();
      const foodType = document.getElementById('selectedFoodType').value;
      const quantity = document.getElementById('foodQuantityInput').value.trim();
      const mealsCount = document.getElementById('foodMealsCountInput').value.trim();
      const location = document.getElementById('pickupLocationInput').value.trim();
      const availableFrom = document.getElementById('pickupAvailableFromInput').value.trim();
      const availableUntil = document.getElementById('pickupAvailableUntilInput').value.trim();
      const donorName = document.getElementById('donorNameInput').value.trim();
      const donorPhone = document.getElementById('donorPhoneInput').value.trim();

      document.querySelectorAll('.field-error-msg').forEach(el => el.style.display = 'none');
      let isValid = true;

      if (!foodName) { document.getElementById('errFoodName').style.display = 'block'; isValid = false; }
      if (!foodDescription) { document.getElementById('errFoodDescription').style.display = 'block'; isValid = false; }
      if (!quantity) { document.getElementById('errFoodQuantity').style.display = 'block'; isValid = false; }
      if (!mealsCount) { document.getElementById('errFoodMeals').style.display = 'block'; isValid = false; }
      if (!location) { document.getElementById('errPickupLocation').style.display = 'block'; isValid = false; }
      if (!availableFrom) { document.getElementById('errAvailableFrom').style.display = 'block'; isValid = false; }
      if (!availableUntil) { document.getElementById('errAvailableUntil').style.display = 'block'; isValid = false; }
      if (!donorName) { document.getElementById('errDonorName').style.display = 'block'; isValid = false; }
      if (!donorPhone) { document.getElementById('errDonorPhone').style.display = 'block'; isValid = false; }

      if (!isValid) { showToast('Please complete all required fields.', 'error'); return; }

      const finalImage = uploadedImageBase64 || selectedPresetImageUrl;

      window.foodStore.addItem({
        name: foodName,
        description: foodDescription,
        foodType: foodType,
        dietary: foodType,
        quantity: quantity,
        mealsCount: mealsCount,
        location: location,
        availableFrom: availableFrom,
        availableUntil: availableUntil,
        donorName: donorName,
        donorContact: donorPhone,
        imageUrl: finalImage
      });

      donationForm.reset();
      uploadedImageBase64 = null;
      const imgPreview = document.getElementById('imagePreviewContainer');
      const imgBox = document.getElementById('imageUploadBox');
      if (imgPreview) imgPreview.style.display = 'none';
      if (imgBox) imgBox.style.display = 'flex';

      if (donationSuccessModal) donationSuccessModal.classList.add('open');
      showToast('Food donation posted successfully!', 'success');
    });
  }

  if (goToFindFoodBtn && donationSuccessModal) {
    goToFindFoodBtn.addEventListener('click', () => {
      donationSuccessModal.classList.remove('open');
      window.location.hash = '#find';
    });
  }

  // ==========================================================================
  // 6. LOGIN PAGE
  // ==========================================================================
  function renderLoginPage() {
    const user = window.foodStore.getUser();
    const loginFormSection = document.getElementById('loginFormContainer');
    const loggedInSection = document.getElementById('loggedInContainer');

    if (user) {
      if (loginFormSection) loginFormSection.style.display = 'none';
      if (loggedInSection) loggedInSection.style.display = 'block';
      const loggedUserName = document.getElementById('loggedUserName');
      const loggedUserRole = document.getElementById('loggedUserRole');
      const loggedUserAvatar = document.getElementById('loggedUserAvatar');
      if (loggedUserName) loggedUserName.textContent = user.name;
      if (loggedUserRole) loggedUserRole.textContent = user.role + ' Account';
      if (loggedUserAvatar) loggedUserAvatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
    } else {
      if (loginFormSection) loginFormSection.style.display = 'block';
      if (loggedInSection) loggedInSection.style.display = 'none';
    }
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmailInput');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) { showToast('Please enter your email.', 'error'); return; }
      const namePart = email.split('@')[0] || 'Community Member';
      const formattedName = namePart.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const user = {
        name: formattedName,
        email: email,
        role: 'Member',
        org: 'Food Rescue Community',
        contact: ''
      };
      window.foodStore.setUser(user);
      updateUserSessionUI();
      showToast('Login successful! Welcome back.', 'success');
      setTimeout(() => { window.location.hash = '#home'; }, 800);
    });
  }

  // Sign up link — MVP demo: treat as login
  const signupLinkBtn = document.getElementById('signupLinkBtn');
  if (signupLinkBtn) {
    signupLinkBtn.addEventListener('click', () => {
      showToast('Sign-up is coming soon! Use a demo account to explore.', 'info');
    });
  }

  const quickDonorBtn = document.getElementById('quickDonorBtn');
  if (quickDonorBtn) {
    quickDonorBtn.addEventListener('click', () => {
      const demoUser = { name: 'Chef Rajesh Kumar', email: 'rajesh@communitykitchen.org', role: 'Donor', org: 'Community Kitchen', contact: '+91 98460 12345' };
      window.foodStore.setUser(demoUser);
      updateUserSessionUI();
      showToast('Logged in as Chef Rajesh (Donor)', 'success');
      renderLoginPage();
    });
  }

  const quickRecipientBtn = document.getElementById('quickRecipientBtn');
  if (quickRecipientBtn) {
    quickRecipientBtn.addEventListener('click', () => {
      const demoUser = { name: 'Maya Lin', email: 'maya@volunteer.org', role: 'Recipient', org: 'Community Volunteer', contact: '+91 98460 23456' };
      window.foodStore.setUser(demoUser);
      updateUserSessionUI();
      showToast('Logged in as Maya Lin (Recipient)', 'success');
      renderLoginPage();
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.foodStore.setUser(null);
      updateUserSessionUI();
      showToast('Signed out successfully.', 'info');
      renderLoginPage();
    });
  }

  // ==========================================================================
  // Mobile Nav Toggle
  // ==========================================================================
  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => mobileNavDrawer.classList.toggle('open'));
  }

  // ==========================================================================
  // Reset Demo Data
  // ==========================================================================
  function handleResetDemo() {
    if (confirm('Reset all food donations to the initial demo data?')) {
      window.foodStore.resetDemoData();
      currentSearchQuery = '';
      currentFoodTypeFilter = 'ALL';
      currentLocationFilter = 'ALL';
      currentAvailabilityFilter = 'ALL';
      showToast('Demo data has been reset.', 'info');
      handleRoute();
    }
  }

  const footerResetBtn = document.getElementById('footerResetBtn');
  if (footerResetBtn) footerResetBtn.addEventListener('click', handleResetDemo);

  const mResetBtn = document.getElementById('mResetBtn');
  if (mResetBtn) mResetBtn.addEventListener('click', handleResetDemo);

  // ==========================================================================
  // Initialization
  // ==========================================================================
  window.addEventListener('hashchange', handleRoute);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateUserSessionUI();
      handleRoute();
    });
  } else {
    updateUserSessionUI();
    handleRoute();
  }

})();
