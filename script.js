document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  let currentSection = 0;

  // Initialize GSAP and section visibility
  gsap.config({ nullTargetWarn: false });
  gsap.set(sections, { opacity: 0, x: 20, display: 'none' });
  gsap.set(sections[0], { opacity: 1, x: 0, display: 'flex' });
  gsap.set(sections[0].querySelector('.btn'), { opacity: 0 });

  // Section transitions
  function transitionToSection(nextSectionIndex) {
    if (nextSectionIndex >= sections.length) return;

    const current = sections[currentSection];
    const next = sections[nextSectionIndex];

    const tl = gsap.timeline({
      onStart: () => {
        gsap.to(current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(current.querySelectorAll('.btn'), { opacity: 0, duration: 0.3, ease: 'power2.out' });
        gsap.set(next, { display: 'flex', opacity: 0, x: 20 });
        gsap.set(next.querySelectorAll('.btn'), { opacity: 0 });
        next.classList.add('active');
        current.classList.remove('active');
      }
    });

    tl.set(current, { display: 'none' })
      .fromTo(next, 
        { opacity: 0, x: 20 }, 
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          ease: 'power3.out', 
          onStart: () => runSectionAnimations(nextSectionIndex),
          onComplete: () => { currentSection = nextSectionIndex; }
        }
      )
      .fromTo(next.querySelectorAll('.btn'), 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.5');
  }

  // Section-specific animations
  function runSectionAnimations(sectionIndex) {
    if (sectionIndex === 1) {
      const chatBubbles = document.querySelectorAll('.chat-bubble');
      const chatButtonContainer = document.querySelector('#chat-button-container');
      gsap.set(chatBubbles, { opacity: 0, y: 20 });
      gsap.set(chatButtonContainer, { opacity: 0 });
      const tl = gsap.timeline();
      chatBubbles.forEach((bubble, index) => {
        tl.to(bubble, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, index * 1);
      });
      tl.to(chatButtonContainer, { opacity: 1, duration: 0.5, ease: 'power3.out' });
    } else if (sectionIndex === 2) {
      gsap.timeline()
        .fromTo('.sec3-img', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })
        .fromTo('#event-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.7')
        .fromTo('#event-subtitle', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6');
    } else if (sectionIndex === 3) {
      gsap.timeline()
        .fromTo('.seminar-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('.detail-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out' }, '-=0.5');
    } else if (sectionIndex === 4) {
      gsap.timeline()
        .fromTo('.certificate-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.certificate-text', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('.certificate-question', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=0.5');
    } else if (sectionIndex === 5) {
      gsap.timeline()
        .fromTo('.form-title', { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.form-text', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('.form-input', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, '-=0.5');
    } else if (sectionIndex === 6) {
      gsap.timeline({
        onStart: () => {
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#029f06', '#3b82f6', '#ef4444']
            });
          }
        }
      })
      .fromTo('.confirmation-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.confirmation-text', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo('.confirmation-note', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=0.5');
    }
  }

  // Button click handlers
  document.getElementById('btn-excite').addEventListener('click', () => transitionToSection(1));
  document.getElementById('btn-know-how').addEventListener('click', () => {
    const chatContainer = document.querySelector('.chat-container');
    const chatButtonContainer = document.querySelector('#chat-button-container');
    const replyBubble = document.createElement('div');
    replyBubble.className = 'chat-bubble right';
    replyBubble.innerHTML = '<p>Tell Me How!</p>';
    chatContainer.insertBefore(replyBubble, chatButtonContainer);
    gsap.fromTo(replyBubble, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    gsap.to(chatButtonContainer, { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: () => transitionToSection(2) });
  });
  document.getElementById('btn-details').addEventListener('click', () => transitionToSection(3));
  document.getElementById('btn-one-more-thing').addEventListener('click', () => transitionToSection(4));
  document.getElementById('btn-yes-coming').addEventListener('click', () => transitionToSection(5));

  // Final form submission handler
  document.getElementById('btn-done-coming').addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const form = document.getElementById('registration-form');
    const formData = {
       Name: form.querySelector('input[placeholder="Full Name"]').value,
  Email: form.querySelector('input[placeholder="Email Address"]').value,
  Phone: form.querySelector('input[placeholder="Phone Number"]').value,
  Year: form.querySelector('input[placeholder="Year (e.g., FE, SE)"]').value,
  Division: form.querySelector('input[placeholder="Division"]').value

    };

    if (!formData.Name || !formData.Email || !formData.Phone || !formData.Year || !formData.Division) {
      alert('Please fill in all fields!');      return;
    }

    // Clear the form visually (optional)
    form.reset();

    // Transition immediately for smooth user experience
    console.log('Transitioning to section 7...');
    transitionToSection(6);

    // Background submission to Google Apps Script
    setTimeout(async () => {
      try {
        const response = await fetch('https://sheetdb.io/api/v1/t0rk7z0wb48ou', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: formData })
        });

        if (response.ok) {
          console.log('Data saved successfully to Google Sheet');
        } else {
          console.warn('Sheet responded with error — user already transitioned');
        }
      } catch (err) {
        console.error('Network/server error:', err);
      }
    }, 100);
  });

  // Extra protection against unwanted reloads
  document.getElementById('registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  });

  // Initial animation for intro section
  gsap.fromTo('#section-1 h1',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
  );
  gsap.fromTo('#btn-excite',
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.5 }
  );
});