/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT LOGIC
 * Mohammed Huzaif - Software Engineer Portfolio
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. NIGHT MODE / THEME TOGGLE LOGIC (CSS MEDIA QUERY POWERED)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggleBtn = document.getElementById('hero-theme-toggle');
  const systemThemeBadge = document.getElementById('system-theme-badge');
  const htmlElement = document.documentElement;

  // Media query matcher for detecting default browser theme
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // Detect user's default browser theme via CSS media queries
  const getSystemTheme = () => {
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  };

  // Determine active theme: stored preference if present, otherwise detected browser theme
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return getSystemTheme();
  };

  // Update hero HUD system status badge
  const updateSystemThemeBadge = (theme, isManual) => {
    if (systemThemeBadge) {
      const sysTheme = getSystemTheme().toUpperCase();
      if (isManual) {
        systemThemeBadge.textContent = `MODE: ${theme.toUpperCase()} (MANUAL)`;
      } else {
        systemThemeBadge.textContent = `MEDIA_QUERY: ${sysTheme} (AUTO)`;
      }
    }
  };

  // Apply theme to DOM and sync all buttons/indicators
  const applyTheme = (theme, isManual = false) => {
    htmlElement.setAttribute('data-theme', theme);
    const isLight = theme === 'light';

    // Update Header button
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      themeToggleBtn.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }

    // Update Hero HUD toggle button
    if (heroThemeToggleBtn) {
      heroThemeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      const dayEl = heroThemeToggleBtn.querySelector('.pixel-mode-day');
      const nightEl = heroThemeToggleBtn.querySelector('.pixel-mode-night');
      if (dayEl && nightEl) {
        if (isLight) {
          dayEl.style.color = 'var(--accent-primary)';
          dayEl.style.fontWeight = 'bold';
          nightEl.style.color = 'var(--text-muted)';
          nightEl.style.fontWeight = 'normal';
        } else {
          nightEl.style.color = '#38bdf8';
          nightEl.style.fontWeight = 'bold';
          dayEl.style.color = 'var(--text-muted)';
          dayEl.style.fontWeight = 'normal';
        }
      }
    }

    // Update system badge
    updateSystemThemeBadge(theme, isManual);

    if (isManual) {
      localStorage.setItem('portfolio-theme', theme);
    }
  };

  // Initial theme detection and application
  const savedTheme = localStorage.getItem('portfolio-theme');
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme, Boolean(savedTheme));

  // Toggle function
  const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  };

  // Attach click listener to Header toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Attach click listener to Sidebar theme toggle
  const sidebarThemeToggleBtn = document.getElementById('sidebar-theme-toggle');
  if (sidebarThemeToggleBtn) {
    sidebarThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. VERTICAL SIDEBAR NAVIGATION & MOBILE DRAWER LOGIC
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarNav = document.getElementById('sidebar-navigation');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Open Drawer
  const openSidebarDrawer = () => {
    if (sidebarNav) {
      sidebarNav.classList.add('is-open');
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.add('is-open');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    // Trap/focus close button for accessibility
    if (sidebarCloseBtn) {
      sidebarCloseBtn.focus();
    }
  };

  // Close Drawer
  const closeSidebarDrawer = () => {
    if (sidebarNav) {
      sidebarNav.classList.remove('is-open');
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove('is-open');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = sidebarNav && sidebarNav.classList.contains('is-open');
      if (isOpen) {
        closeSidebarDrawer();
      } else {
        openSidebarDrawer();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebarDrawer);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebarDrawer);
  }

  // Close drawer on Escape key for keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarNav && sidebarNav.classList.contains('is-open')) {
      closeSidebarDrawer();
    }
  });

  // Close mobile drawer when clicking any sidebar link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebarDrawer();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. SCROLL SPY - ACTIVE NAVIGATION HIGHLIGHTING (VERTICAL & HEADER)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('main > section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;
    const headerOffset = 140;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerOffset;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Update Vertical Sidebar Links
        sidebarLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });

        // Update Top Nav Links if present
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 4. RETRO TERMINAL CHAT ASSISTANT INTERACTION
  // --------------------------------------------------------------------------
  const terminalForm = document.getElementById('terminal-chat-form');
  const terminalInput = document.getElementById('terminal-chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const hintButtons = document.querySelectorAll('.btn-hint');

  // API integration point: replace this local matcher with a request to a server-side AI endpoint.
  // Keep provider credentials on the server; never expose API keys in this client-side file.
  const getBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('who') || q.includes('about') || q.includes('huzaif')) {
      return "Mohammed Huzaif is a Software Engineer and Bachelor of Engineering (B.E.) graduate from Adichunchanagiri Institute of Technology with a 7.0 CGPA, specializing in Java, Python, and frontend web systems.";
    } else if (q.includes('skill') || q.includes('language') || q.includes('tech')) {
      return "Huzaif's core competencies include Java (Core & OOP), Python, C, HTML5, CSS3, JavaScript, Data Structures & Algorithms, and Git version control.";
    } else if (q.includes('project') || q.includes('inventory')) {
      return "He developed the Digital Inventory and Sales Management System using Java and Python, streamlining item tracking, automated sales logging, and real-time inventory balances.";
    } else if (q.includes('hire') || q.includes('contact') || q.includes('email') || q.includes('phone')) {
      return "You can reach Mohammed directly at mohammedhuzaif589@gmail.com or by phone at +91 6363111822. He is available for engineering roles and collaborations!";
    } else if (q.includes('resume') || q.includes('cv')) {
      return "You can download Huzaif's official CV using the 'Inventory (CV)' button in the Hero section, or inspect his education & timeline section.";
    } else {
      return `Message received: "${query}". I am programmed to assist with Mohammed Huzaif's technical background, projects, or contact channels. Feel free to use the Contact form below!`;
    }
  };

  const appendChatMessage = (sender, text, isBot = false) => {
    if (!chatMessages) return;

    const row = document.createElement('div');
    row.className = `chat-row ${isBot ? 'bot-row' : 'user-row'}`;

    const tag = document.createElement('span');
    tag.className = 'chat-avatar-tag';
    tag.textContent = sender;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    row.appendChild(tag);
    row.appendChild(bubble);
    chatMessages.appendChild(row);

    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const handleUserMessage = (userQuery) => {
    if (!userQuery.trim()) return;

    appendChatMessage('[VISITOR]:', userQuery, false);

    if (terminalInput) {
      terminalInput.value = '';
    }

    setTimeout(() => {
      const response = getBotResponse(userQuery);
      appendChatMessage('[HUZAIF_BOT]:', response, true);
    }, 350);
  };

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserMessage(terminalInput.value);
    });
  }

  hintButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      if (query) {
        handleUserMessage(query);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. CONTACT FORM CLIENT-SIDE VALIDATION & HANDLING
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');

      // Reset error messages
      [nameError, emailError, messageError].forEach(el => { if (el) el.textContent = ''; });
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        if (nameError) nameError.textContent = 'Please enter your full name.';
        isValid = false;
      }

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        if (emailError) emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        if (messageError) messageError.textContent = 'Please write a brief message.';
        isValid = false;
      }

      if (isValid) {
        // Resend integration point: POST validated data to a server endpoint here; keep the API key server-side.
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${nameInput.value.trim()}! Your message passed validation. Email delivery is not connected in this demo yet.`;
        contactForm.reset();

        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className = 'form-feedback';
        }, 6000);
      } else {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please correct the highlighted fields above.';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. PROJECT FILTERS & DETAIL MODALS
  // --------------------------------------------------------------------------
  const projectFilterButtons = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-thumb-card[data-category]');
  const projectModals = document.querySelectorAll('.proj-modal-backdrop');
  let activeProjectModal = null;
  let modalReturnFocus = null;

  projectFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      projectFilterButtons.forEach(filterButton => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle('active', isSelected);
        filterButton.setAttribute('aria-selected', String(isSelected));
      });

      projectCards.forEach(card => {
        card.hidden = filterValue !== 'all' && card.dataset.category !== filterValue;
      });
    });
  });

  const closeProjectModal = () => {
    if (!activeProjectModal) return;

    activeProjectModal.hidden = true;
    document.body.classList.remove('project-modal-open');
    if (modalReturnFocus && modalReturnFocus.isConnected) {
      modalReturnFocus.setAttribute('aria-expanded', 'false');
      modalReturnFocus.focus();
    }
    activeProjectModal = null;
    modalReturnFocus = null;
  };

  const openProjectModal = (projectId, trigger) => {
    const modal = document.getElementById(`modal-${projectId}`);
    if (!modal) return;
    if (activeProjectModal) closeProjectModal();

    activeProjectModal = modal;
    modalReturnFocus = trigger || document.activeElement;
    modalReturnFocus.setAttribute('aria-expanded', 'true');
    modal.hidden = false;
    document.body.classList.add('project-modal-open');
    modal.querySelector('[data-close-modal]')?.focus();
  };

  projectCards.forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openProjectModal(card.dataset.project, card);
    });

    card.addEventListener('keydown', event => {
      if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openProjectModal(card.dataset.project, card);
    });
  });

  projectModals.forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-close-modal]')) {
        closeProjectModal();
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (!activeProjectModal) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeProjectModal();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusableElements = [...activeProjectModal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(element => element.getClientRects().length > 0);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || !activeProjectModal.contains(document.activeElement))) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && (document.activeElement === lastElement || !activeProjectModal.contains(document.activeElement))) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  // --------------------------------------------------------------------------
  // 6. SKILLS FILTER — Category tab interactivity
  // --------------------------------------------------------------------------
  // Selects all filter buttons and skill station cards for toggling visibility.
  const filterBtns   = document.querySelectorAll('.skill-filter-btn');
  const stationCards = document.querySelectorAll('.skill-station-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Read the requested filter category from the button's data-filter attribute
      const filterValue = btn.getAttribute('data-filter');

      // --- Update active state on all tab buttons ---
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // --- Show / hide station cards based on matching category ---
      stationCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          // Show: restore flex layout with a short fade-in step
          card.style.display = 'flex';
          // Trigger re-paint before adding opacity so transition plays
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          // Hide: collapse visually but keep layout flow stable
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          // After CSS transition completes (~120ms stepped), fully hide
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 160);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. SKILLS PROGRESS BAR ANIMATION — Animate fills on section enter
  // --------------------------------------------------------------------------
  // Observes the #skills section; once visible, sets each bar's actual width
  // so the CSS transition (steps(20)) creates a retro stepped fill effect.
  const skillsSection = document.getElementById('skills');
  let skillsAnimated  = false; // prevent re-running on re-scroll

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;

          // Each fill bar has its target width in the inline style attribute
          // e.g. style="width: 90%;" — we reset to 0 first, then animate
          const fills = skillsSection.querySelectorAll('.pixel-meter-fill');
          fills.forEach((fill, idx) => {
            const targetWidth = fill.style.width || '0%';
            fill.style.width  = '0%'; // reset so transition plays

            // Stagger each bar slightly for a cascading 8-bit effect
            setTimeout(() => {
              fill.style.width = targetWidth;
            }, 100 + idx * 80);
          });
        }
      });
    }, { threshold: 0.15 }); // trigger when 15% of section is visible

    skillsObserver.observe(skillsSection);
  }

  // --------------------------------------------------------------------------
  // 7. TIMELINE SCROLL REVEAL — Animate items as they enter the viewport
  // --------------------------------------------------------------------------
  // Uses IntersectionObserver to add .is-visible to each .timeline-item when
  // it scrolls into view. CSS handles the translateX fade-in + staggered delay.
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineItems.length > 0 && 'IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Adding .is-visible triggers the CSS opacity + translate transition
          entry.target.classList.add('is-visible');
          // Unobserve after reveal — items stay visible once shown
          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,       // reveal when 12% of item is visible
      rootMargin: '0px 0px -40px 0px' // slight bottom offset for feel
    });

    timelineItems.forEach(item => timelineObserver.observe(item));
  } else {
    // Fallback for browsers without IntersectionObserver: show all immediately
    timelineItems.forEach(item => item.classList.add('is-visible'));
  }

});

