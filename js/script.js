/* ========================
   PRELOADER
======================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 700);
});

/* ========================
   VALIDATION HELPERS
======================== */
function setError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errorId);
  group.classList.remove('is-valid');
  group.classList.add('is-error');
  err.textContent = message;
  err.classList.add('visible');
}

function setValid(groupId, errorId) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errorId);
  group.classList.remove('is-error');
  group.classList.add('is-valid');
  err.textContent = '';
  err.classList.remove('visible');
}

function clearState(groupId, errorId) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errorId);
  group.classList.remove('is-error', 'is-valid');
  err.textContent = '';
  err.classList.remove('visible');
}

/* ========================
   INDIVIDUAL VALIDATORS
======================== */
function validateName() {
  const val = document.getElementById('full-name').value.trim();
  if (!val) {
    setError('group-full-name', 'err-full-name', '⚠ Full name is required.');
    return false;
  }
  if (val.length < 2) {
    setError('group-full-name', 'err-full-name', '⚠ Name must be at least 2 characters.');
    return false;
  }
  if (!/^[a-zA-Z\s'-]+$/.test(val)) {
    setError('group-full-name', 'err-full-name', '⚠ Name should only contain letters.');
    return false;
  }
  setValid('group-full-name', 'err-full-name');
  return true;
}

function validateEmail() {
  const val = document.getElementById('email-address').value.trim();
  if (!val) {
    // Optional — blank is fine
    clearState('group-email-address', 'err-email-address');
    return true;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val)) {
    setError('group-email-address', 'err-email-address', '⚠ Enter a valid email address.');
    return false;
  }
  setValid('group-email-address', 'err-email-address');
  return true;
}

function validatePhone() {
  const val = document.getElementById('phone-number').value.trim();
  if (!val) {
    setError('group-phone-number', 'err-phone-number', '⚠ Phone number is required.');
    return false;
  }
  const digits = val.replace(/[\s\-().]/g, '');
  if (!/^\d{7,15}$/.test(digits)) {
    setError('group-phone-number', 'err-phone-number', '⚠ Enter a valid phone number (7–15 digits).');
    return false;
  }
  setValid('group-phone-number', 'err-phone-number');
  return true;
}

function validateAppType() {
  const val = document.getElementById('app-type').value;
  if (!val) {
    setError('group-app-type', 'err-app-type', '⚠ Please select what you want to build.');
    return false;
  }
  setValid('group-app-type', 'err-app-type');
  return true;
}

/* ========================
   REAL-TIME (on blur)
======================== */
document.getElementById('full-name')   .addEventListener('blur', validateName);
document.getElementById('email-address').addEventListener('blur', validateEmail);
document.getElementById('phone-number') .addEventListener('blur', validatePhone);
document.getElementById('app-type')    .addEventListener('change', validateAppType);

// Also validate while typing after first error
document.getElementById('full-name')   .addEventListener('input', function() {
  if (document.getElementById('group-full-name').classList.contains('is-error')) validateName();
});
document.getElementById('phone-number').addEventListener('input', function() {
  if (document.getElementById('group-phone-number').classList.contains('is-error')) validatePhone();
});
document.getElementById('email-address').addEventListener('input', function() {
  if (document.getElementById('group-email-address').classList.contains('is-error')) validateEmail();
});

/* ========================
   FORM SUBMIT
======================== */
document.getElementById('estimateForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const isNameOk  = validateName();
  const isEmailOk = validateEmail();
  const isPhoneOk = validatePhone();
  const isTypeOk  = validateAppType();

  const btn     = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');

  if (!isNameOk || !isEmailOk || !isPhoneOk || !isTypeOk) {
    // Shake + red state
    btn.classList.add('btn-error', 'shake');
    btnText.textContent = 'Fix errors above';
    btnIcon.style.display = 'none';

    setTimeout(() => {
      btn.classList.remove('shake', 'btn-error');
      btnText.textContent = 'Get a Free Estimate';
      btnIcon.style.display = '';
    }, 2500);

    // Scroll to first error
    const firstError = document.querySelector('.field-group.is-error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // All valid — loading state
  btn.disabled = true;
  btn.style.opacity = '0.75';
  btn.style.pointerEvents = 'none';
  btnText.textContent = 'Sending...';
  btnIcon.style.display = 'none';

  setTimeout(() => {
    btn.classList.add('btn-success');
    btn.style.opacity = '1';
    btnText.textContent = '✓ Estimate Requested!';
    btn.disabled = false;
  }, 1600);
});

/* ========================
   COUNTER ANIMATION
======================== */
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // lower is faster

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
      const count = +counter.innerText;
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };
    
    updateCount();
  });
}

// Intersection Observer to trigger animation when visible
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  observer.observe(statsSection);
}

/* ========================
   STAGE TABS LOGIC
======================== */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.stage-tab');
  const panes = document.querySelectorAll('.stage-pane');
  const progressFill = document.querySelector('.stepper-progress-fill');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panes
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Update vertical progress line fill height
      if (progressFill) {
        const percent = (index / (tabs.length - 1)) * 100;
        progressFill.style.height = `${percent}%`;
      }

      // Show corresponding pane
      const targetId = tab.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Update browser address path dynamically
      const pathSpan = document.getElementById('active-stage-path');
      if (pathSpan) {
        const cleanPath = targetId.replace('stage-', '') + '-stage';
        pathSpan.textContent = cleanPath;
      }
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item if it wasn't already active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Portfolio Filter Tabs
  const portFilters = document.querySelectorAll('.port-filter');
  const portCards   = document.querySelectorAll('.port-card');

  portFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      portFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      portCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  // Reviews Slider Data & Logic
  const reviewsData = [
    {
      name: "Jack Preddy",
      title: "CEO, Optimize Mind Performance",
      quote: `"They've been really helpful throughout the process."`,
      image: "images/review_bg.png",
      avatar: "images/review_avatar.png"
    },
    {
      name: "Sarah Jenkins",
      title: "Founder, HealthTech Solutions",
      quote: `"Incredible attention to detail. Our app launched flawlessly."`,
      image: "images/portfolio_health.png", // Reusing some generated images for variety
      avatar: "images/review_avatar.png"
    },
    {
      name: "Marcus Thorne",
      title: "CTO, Finova Global",
      quote: `"The most transparent and professional team I've ever worked with."`,
      image: "images/portfolio_fintech.png",
      avatar: "images/review_avatar.png"
    }
  ];

  let currentReviewIndex = 0;
  
  const revPrevBtn = document.getElementById('reviewPrevBtn');
  const revNextBtn = document.getElementById('reviewNextBtn');
  const revCounter = document.getElementById('reviewCounter');
  const revBgImage = document.getElementById('reviewBgImage');
  const revAvatarImage = document.getElementById('reviewAvatarImage');
  const revNameText = document.getElementById('reviewNameText');
  const revTitleText = document.getElementById('reviewTitleText');
  const revQuoteText = document.getElementById('reviewQuoteText');

  function updateReview(index) {
    const data = reviewsData[index];
    
    // Simple fade animation
    const reviewCard = document.querySelector('.reviews-card');
    const imageWrapper = document.querySelector('.reviews-image-wrapper img');
    
    if (reviewCard) reviewCard.style.opacity = '0.5';
    if (imageWrapper) imageWrapper.style.opacity = '0.5';
    
    setTimeout(() => {
      if (revNameText) revNameText.textContent = data.name;
      if (revTitleText) revTitleText.textContent = data.title;
      if (revQuoteText) revQuoteText.textContent = data.quote;
      if (revBgImage) revBgImage.src = data.image;
      if (revAvatarImage) revAvatarImage.src = data.avatar;
      
      const countDisplay = (index + 1).toString().padStart(2, '0');
      const totalDisplay = reviewsData.length.toString().padStart(2, '0');
      if (revCounter) revCounter.textContent = `${countDisplay} / ${totalDisplay}`;
      
      if (reviewCard) reviewCard.style.opacity = '1';
      if (imageWrapper) imageWrapper.style.opacity = '1';
    }, 200);
  }

  if (revPrevBtn && revNextBtn) {
    // Initialize fade transition styles
    const reviewCard = document.querySelector('.reviews-card');
    const imageWrapper = document.querySelector('.reviews-image-wrapper img');
    if (reviewCard) reviewCard.style.transition = 'opacity 0.2s ease';
    if (imageWrapper) imageWrapper.style.transition = 'opacity 0.2s ease';

    revPrevBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
      updateReview(currentReviewIndex);
    });

    revNextBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex + 1) % reviewsData.length;
      updateReview(currentReviewIndex);
    });
  }

  // ========================
  // PORTFOLIO SLIDER LOGIC
  // ========================
  const portTrack = document.getElementById('portSliderTrack');
  const portCsCards = document.querySelectorAll('.port-cs-card');
  const portPrevBtn = document.getElementById('portPrevBtn');
  const portNextBtn = document.getElementById('portNextBtn');
  
  if (portTrack && portCsCards.length > 0 && portPrevBtn && portNextBtn) {
    let currentPortIndex = 0;
    const totalPortCards = portCsCards.length;
    
    function updatePortSlider() {
      portTrack.style.transform = `translateX(-${currentPortIndex * 100}%)`;
    }
    
    portPrevBtn.addEventListener('click', () => {
      currentPortIndex = (currentPortIndex - 1 + totalPortCards) % totalPortCards;
      updatePortSlider();
    });
    
    portNextBtn.addEventListener('click', () => {
      currentPortIndex = (currentPortIndex + 1) % totalPortCards;
      updatePortSlider();
    });
    
    // Optional: Add keyboard navigation for the slider
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        currentPortIndex = (currentPortIndex - 1 + totalPortCards) % totalPortCards;
        updatePortSlider();
      } else if (e.key === 'ArrowRight') {
        currentPortIndex = (currentPortIndex + 1) % totalPortCards;
        updatePortSlider();
      }
    });
  }

  // ========================
  // DISCOVERY MODAL LOGIC
  // ========================
  const getEstimateBtn = document.getElementById('get-estimate-btn');
  const discoveryModal = document.getElementById('discovery-modal');
  const discoveryModalClose = document.getElementById('discovery-modal-close');
  const discoveryModalBackdrop = document.getElementById('discovery-modal-backdrop');
  const discoveryForm = document.getElementById('discoveryForm');

  function openModal() {
    if (discoveryModal) {
      discoveryModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (discoveryModal) {
      discoveryModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Clear validation states
      clearState('group-disc-first-name', 'err-disc-first-name');
      clearState('group-disc-work-email', 'err-disc-work-email');
      clearState('group-disc-phone-number', 'err-disc-phone-number');
      clearState('group-disc-need', 'err-disc-need');
      clearState('group-disc-help', 'err-disc-help');
      clearState('group-disc-details', 'err-disc-details');
      
      if (discoveryForm) {
        discoveryForm.reset();
      }
    }
  }

  if (getEstimateBtn) {
    getEstimateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  const openDiscoveryBtns = document.querySelectorAll('.open-discovery-btn');
  openDiscoveryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (discoveryModalClose) {
    discoveryModalClose.addEventListener('click', closeModal);
  }

  if (discoveryModalBackdrop) {
    discoveryModalBackdrop.addEventListener('click', closeModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && discoveryModal && discoveryModal.classList.contains('active')) {
      closeModal();
    }
  });

  // DISCOVERY FORM VALIDATION
  function validateDiscFirstName() {
    const input = document.getElementById('disc-first-name');
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      setError('group-disc-first-name', 'err-disc-first-name', '⚠ First name is required.');
      return false;
    }
    if (val.length < 2) {
      setError('group-disc-first-name', 'err-disc-first-name', '⚠ Name must be at least 2 characters.');
      return false;
    }
    setValid('group-disc-first-name', 'err-disc-first-name');
    return true;
  }

  function validateDiscWorkEmail() {
    const input = document.getElementById('disc-work-email');
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      setError('group-disc-work-email', 'err-disc-work-email', '⚠ Work email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setError('group-disc-work-email', 'err-disc-work-email', '⚠ Enter a valid email address.');
      return false;
    }
    setValid('group-disc-work-email', 'err-disc-work-email');
    return true;
  }

  function validateDiscPhone() {
    const input = document.getElementById('disc-phone-number');
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      setError('group-disc-phone-number', 'err-disc-phone-number', '⚠ Phone number is required.');
      return false;
    }
    const digits = val.replace(/[\s\-().]/g, '');
    if (!/^\d{7,15}$/.test(digits)) {
      setError('group-disc-phone-number', 'err-disc-phone-number', '⚠ Enter a valid phone number (7–15 digits).');
      return false;
    }
    setValid('group-disc-phone-number', 'err-disc-phone-number');
    return true;
  }

  function validateDiscNeed() {
    const selected = document.querySelector('input[name="what-need"]:checked');
    if (!selected) {
      setError('group-disc-need', 'err-disc-need', '⚠ Please select what best describes what you need.');
      return false;
    }
    setValid('group-disc-need', 'err-disc-need');
    return true;
  }

  function validateDiscHelp() {
    const checked = document.querySelectorAll('input[name="help-with"]:checked');
    if (checked.length === 0) {
      setError('group-disc-help', 'err-disc-help', '⚠ Please select what you need help with.');
      return false;
    }
    setValid('group-disc-help', 'err-disc-help');
    return true;
  }

  function validateDiscDetails() {
    const input = document.getElementById('disc-project-details');
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      setError('group-disc-details', 'err-disc-details', '⚠ Project details are required.');
      return false;
    }
    if (val.length < 10) {
      setError('group-disc-details', 'err-disc-details', '⚠ Please share a bit more detail (min 10 characters).');
      return false;
    }
    setValid('group-disc-details', 'err-disc-details');
    return true;
  }

  // Real-time (blur & input)
  const discFirstNameInput = document.getElementById('disc-first-name');
  const discWorkEmailInput = document.getElementById('disc-work-email');
  const discPhoneInput = document.getElementById('disc-phone-number');
  const discDetailsInput = document.getElementById('disc-project-details');
  const discNeedRadios = document.querySelectorAll('input[name="what-need"]');
  const discHelpCheckboxes = document.querySelectorAll('input[name="help-with"]');

  if (discFirstNameInput) {
    discFirstNameInput.addEventListener('blur', validateDiscFirstName);
    discFirstNameInput.addEventListener('input', () => {
      const grp = document.getElementById('group-disc-first-name');
      if (grp && grp.classList.contains('is-error')) validateDiscFirstName();
    });
  }

  if (discWorkEmailInput) {
    discWorkEmailInput.addEventListener('blur', validateDiscWorkEmail);
    discWorkEmailInput.addEventListener('input', () => {
      const grp = document.getElementById('group-disc-work-email');
      if (grp && grp.classList.contains('is-error')) validateDiscWorkEmail();
    });
  }

  if (discPhoneInput) {
    discPhoneInput.addEventListener('blur', validateDiscPhone);
    discPhoneInput.addEventListener('input', () => {
      const grp = document.getElementById('group-disc-phone-number');
      if (grp && grp.classList.contains('is-error')) validateDiscPhone();
    });
  }

  if (discDetailsInput) {
    discDetailsInput.addEventListener('blur', validateDiscDetails);
    discDetailsInput.addEventListener('input', () => {
      const grp = document.getElementById('group-disc-details');
      if (grp && grp.classList.contains('is-error')) validateDiscDetails();
    });
  }

  discNeedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const grp = document.getElementById('group-disc-need');
      if (grp && grp.classList.contains('is-error')) validateDiscNeed();
    });
  });

  discHelpCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const grp = document.getElementById('group-disc-help');
      if (grp && grp.classList.contains('is-error')) validateDiscHelp();
    });
  });

  // Discovery Form Submit
  if (discoveryForm) {
    discoveryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameOk = validateDiscFirstName();
      const isEmailOk = validateDiscWorkEmail();
      const isPhoneOk = validateDiscPhone();
      const isNeedOk = validateDiscNeed();
      const isHelpOk = validateDiscHelp();
      const isDetailsOk = validateDiscDetails();

      const submitBtn = document.getElementById('disc-submit-btn');
      const btnText = submitBtn ? submitBtn.querySelector('span') : null;

      if (!isNameOk || !isEmailOk || !isPhoneOk || !isNeedOk || !isHelpOk || !isDetailsOk) {
        if (submitBtn && btnText) {
          submitBtn.classList.add('btn-error', 'shake');
          const originalTxt = btnText.textContent;
          btnText.textContent = 'Fix errors above';

          setTimeout(() => {
            submitBtn.classList.remove('shake', 'btn-error');
            btnText.textContent = originalTxt;
          }, 2500);
        }

        // Scroll to first error inside modal content
        if (discoveryModal) {
          const firstError = discoveryModal.querySelector('.field-group.is-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return;
      }

      // Valid form submission simulation
      if (submitBtn && btnText) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.style.pointerEvents = 'none';
        const originalTxt = btnText.textContent;
        btnText.textContent = 'Sending...';

        setTimeout(() => {
          submitBtn.classList.add('btn-success');
          submitBtn.style.opacity = '1';
          btnText.textContent = '✓ Discovery Session Booked!';

          setTimeout(() => {
            closeModal();
            // Reset button
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.pointerEvents = '';
            submitBtn.classList.remove('btn-success');
            btnText.textContent = originalTxt;
          }, 2000);
        }, 1600);
      }
    });
  }
});
