// Move custom content section JavaScript from index.html to this file

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('customContentForm');
  const list = document.getElementById('customContentList');
  const formSection = form ? form.closest('.card-body') : null;

  // Hide form by default
  if (formSection) {
    formSection.style.display = 'none';
  }

  // Dev Login Modal logic
  const devLoginNav = document.getElementById('devLoginNav');
  const devLoginModal = document.getElementById('devLoginModal');
  const closeDevLoginModal = document.getElementById('closeDevLoginModal');
  let devLoginForm = null;

  function showDevLoginModal() {
    if (devLoginModal) {
      devLoginModal.classList.remove('d-none');
      devLoginForm = document.getElementById('devLoginForm');
      devLoginForm.reset();
      document.getElementById('devLoginError').style.display = 'none';
    }
  }
  function hideDevLoginModal() {
    if (devLoginModal) {
      devLoginModal.classList.add('d-none');
    }
  }
  if (devLoginNav) {
    devLoginNav.addEventListener('click', function(e) {
      e.preventDefault();
      showDevLoginModal();
    });
  }
  if (closeDevLoginModal) {
    closeDevLoginModal.addEventListener('click', function() {
      hideDevLoginModal();
    });
  }
  if (devLoginModal) {
    devLoginModal.addEventListener('click', function(e) {
      if (e.target === devLoginModal) hideDevLoginModal();
    });
  }

  // Dev Login form logic
  if (devLoginModal) {
    devLoginModal.addEventListener('submit', function(e) {
      if (e.target && e.target.id === 'devLoginForm') {
        e.preventDefault();
        const username = document.getElementById('devUsername').value;
        const password = document.getElementById('devPassword').value;
        if (username === 'admin' && password === 'dropandminecraft') {
          hideDevLoginModal();
          if (formSection) formSection.style.display = '';
          if (customContentBtnContainer) customContentBtnContainer.style.display = '';
        } else {
          const errorDiv = document.getElementById('devLoginError');
          errorDiv.textContent = 'Invalid credentials.';
          errorDiv.style.display = 'block';
        }
      }
    });
  }

  // Load saved custom contents from localStorage
  function renderSavedContents() {
    const saved = localStorage.getItem('customContents');
    if (saved && list) {
      const entries = JSON.parse(saved);
      entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        let imageHTML = '';
        if (entry.image) {
          imageHTML = `<img src='${entry.image}' alt='User uploaded' class='img-fluid rounded mb-2 w-100' style='max-height:300px;object-fit:contain;'>`;
        }
        card.innerHTML = `<div class='card-body'>${imageHTML}<h5 class='card-title'>${entry.title}</h5><p class='card-text'>${entry.body}</p></div>`;
        list.appendChild(card);
      });
    }
  }
  renderSavedContents();

  // Save new content to localStorage
  function saveContent(title, body, image) {
    const saved = localStorage.getItem('customContents');
    const entries = saved ? JSON.parse(saved) : [];
    entries.unshift({ title, body, image });
    localStorage.setItem('customContents', JSON.stringify(entries));
  }

  if (form && list) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('customTitle').value.trim();
      const body = document.getElementById('customBody').value.trim();
      const imageInput = document.getElementById('customImage');
      const dateInput = document.getElementById('customDate');
      let postDate = dateInput && dateInput.value.trim() ? dateInput.value.trim() : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      let imageHTML = '';
      let imageData = '';
      if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const fileName = file.name;
        // Try to use a relative path if the file exists in images/ or uploaded_images/
        const tryPaths = [
          `images/${fileName}`,
          `uploaded_images/${fileName}`
        ];
        let foundPath = null;
        let checkCount = 0;
        function checkNextPath() {
          if (checkCount >= tryPaths.length) {
            // Fallback to base64 if not found
            const reader = new FileReader();
            reader.onload = function(event) {
              imageData = event.target.result;
              imageHTML = `<img src='${imageData}' alt='User uploaded' class='img-fluid rounded mb-2 w-100' style='max-height:300px;object-fit:contain;'>`;
              addCardAndSave();
            };
            reader.readAsDataURL(file);
            return;
          }
          const testImg = new window.Image();
          testImg.onload = function() {
            foundPath = tryPaths[checkCount];
            imageHTML = `<img src='${foundPath}' alt='User uploaded' class='img-fluid rounded mb-2 w-100' style='max-height:300px;object-fit:contain;'>`;
            addCardAndSave();
          };
          testImg.onerror = function() {
            checkCount++;
            checkNextPath();
          };
          testImg.src = tryPaths[checkCount];
        }
        checkNextPath();
        return; // Prevent addCardAndSave from running twice
      } else {
        addCardAndSave();
      }
      function addCardAndSave() {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `<div class='card-body'>${imageHTML}<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted on ${postDate}</p></div>`;
        list.prepend(card);
        form.reset();
        // --- Export HTML snippet for admin ---
        if (formSection && formSection.style.display !== 'none') {
          let exportDiv = document.getElementById('customContentExport');
          if (!exportDiv) {
            exportDiv = document.createElement('div');
            exportDiv.id = 'customContentExport';
            exportDiv.style = 'background:#f8f9fa; border:1px solid #ccc; padding:1em; margin-top:1em; overflow:auto; position:relative;';
            // Copy button
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy HTML';
            copyBtn.className = 'btn btn-sm btn-outline-primary position-absolute';
            copyBtn.style = 'top:8px; right:8px;';
            copyBtn.onclick = function() {
              let snippet = `<div class='card mb-3'><div class='card-body'>`;
              if (imageHTML) {
                let img = document.createElement('div');
                img.innerHTML = imageHTML;
                let imgTag = img.querySelector('img');
                if (imgTag) imgTag.removeAttribute('style');
                snippet += img.innerHTML;
              }
              snippet += `<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted on ${postDate}</p></div></div>`;
              navigator.clipboard.writeText(snippet);
              copyBtn.textContent = 'Copied!';
              setTimeout(() => copyBtn.textContent = 'Copy HTML', 1200);
            };
            exportDiv.appendChild(copyBtn);
            // Snippet
            var snippetPre = document.createElement('pre');
            snippetPre.tabIndex = 0; // Make focusable for keyboard selection
            snippetPre.setAttribute('title', 'Click to select all');
            snippetPre.style = 'margin-top:2.5em; background:transparent; border:none; padding:0; white-space:pre-wrap; word-break:break-all;';
            snippetPre.addEventListener('click', function() {
              // Select all text in the <pre> on click
              const range = document.createRange();
              range.selectNodeContents(snippetPre);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            });
            exportDiv.appendChild(snippetPre);
            form.parentNode.appendChild(exportDiv);
          } else {
            var snippetPre = exportDiv.querySelector('pre');
          }
          // Use innerHTML for a cleaner snippet, and remove inline styles
          let snippet = `<div class='card mb-3'><div class='card-body'>`;
          if (imageHTML) {
            let img = document.createElement('div');
            img.innerHTML = imageHTML;
            let imgTag = img.querySelector('img');
            if (imgTag) imgTag.removeAttribute('style');
            snippet += img.innerHTML;
          }
          snippet += `<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted on ${postDate}</p></div></div>`;
          snippetPre.textContent = snippet;
        }
      }
    });
  }

  // Google Form toggle logic for "Submit a post" button
  const showGoogleFormBtn = document.getElementById('showGoogleFormBtn');
  const googleFormContainer = document.getElementById('googleFormContainer');
  if (showGoogleFormBtn && googleFormContainer) {
    showGoogleFormBtn.addEventListener('click', function() {
      if (googleFormContainer.style.display === 'none' || !googleFormContainer.style.display) {
        // Insert your Google Form embed code here
        googleFormContainer.innerHTML = `<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfDUMMYFORMURL/viewform?embedded=true" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        googleFormContainer.style.display = 'block';
        showGoogleFormBtn.textContent = 'Hide form';
      } else {
        googleFormContainer.innerHTML = '';
        googleFormContainer.style.display = 'none';
        showGoogleFormBtn.textContent = 'Submit a post.';
      }
    });
  }

  // Floating Custom Content Modal logic
  const customContentModal = document.getElementById('customContentModal');
  const closeCustomContentModal = document.getElementById('closeCustomContentModal');

  function showCustomContentModal() {
    customContentModal.classList.add('show');
    customContentModal.classList.remove('d-none');
    // Reset form fields
    const form = document.getElementById('customContentForm');
    if (form) form.reset();
    // Clear snippet area
    const snippetArea = document.getElementById('customContentList');
    if (snippetArea) snippetArea.innerHTML = '<!-- Snippet preview and export area only -->';
  }
  function hideCustomContentModal() {
    customContentModal.classList.remove('show');
    customContentModal.classList.add('d-none');
  }
  if (closeCustomContentModal) {
    closeCustomContentModal.addEventListener('click', hideCustomContentModal);
  }
  // Optional: ESC key closes modal
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && customContentModal.classList.contains('show')) {
      hideCustomContentModal();
    }
  });

  // Show modal when admin clicks 'Create Content' button
  const openCustomContentModalBtn = document.getElementById('openCustomContentModal');
  if (openCustomContentModalBtn) {
    openCustomContentModalBtn.addEventListener('click', showCustomContentModal);
  }

  // When generating the snippet, include the Uploaded by field
  function generateCustomContentSnippet(title, body, imageUrl, date, uploader) {
    let imgHtml = imageUrl ? `<img src="${imageUrl}" alt="User uploaded" class="img-fluid rounded mb-2 w-100">` : '';
    let byline = `<p class='text-muted mb-0' style='font-size:0.95em;'>Posted by ${uploader} on ${date}</p>`;
    return `<div class='card mb-3'><div class='card-body'>${imgHtml}<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p>${byline}</div></div>`;
  }

  // Ensure the custom content modal is hidden on page load
  window.addEventListener('DOMContentLoaded', function() {
    var customContentModal = document.getElementById('customContentModal');
    if (customContentModal) {
      customContentModal.classList.remove('show');
      customContentModal.classList.add('d-none');
      customContentModal.style.display = '';
    }
  });
});
