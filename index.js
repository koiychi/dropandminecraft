// Move custom content section JavaScript from index.html to this file

document.addEventListener('DOMContentLoaded', function() {
  // --- Tab Dropdown Logic (Mobile) ---
  var dropdown = document.getElementById('newsMomentsTabDropdown');
  if (dropdown) {
    dropdown.addEventListener('change', function() {
      var tabId = dropdown.value;
      var tabPanes = document.querySelectorAll('.tab-pane');
      tabPanes.forEach(function(pane) {
        pane.classList.remove('show', 'active');
      });
      var selectedPane = document.getElementById(tabId);
      if (selectedPane) {
        selectedPane.classList.add('show', 'active');
      }
    });
    // Set dropdown to match the active tab on load
    var activePane = document.querySelector('.tab-pane.show.active');
    if (activePane) {
      dropdown.value = activePane.id;
    }
  }

  // Hide the Create Content button by default
  var customContentBtnContainer = document.getElementById('customContentBtnContainer');
  if (customContentBtnContainer) {
    customContentBtnContainer.style.display = 'none';
  }

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
      const uploader = document.getElementById('customUploader').value.trim();
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
        card.innerHTML = `<div class='card-body'>${imageHTML}<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted by ${uploader}on ${postDate}</p></div>`;
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
              snippet += `<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted by ${uploader} on ${postDate}</p></div></div>`;
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
          snippet += `<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted by ${uploader} on ${postDate}</p></div></div>`;
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

  // Custom Content Modal logic
  const customContentModal = document.getElementById('customContentModal');
  const openCustomContentModalBtn = document.getElementById('openCustomContentModal');
  const closeCustomContentModalBtn = document.getElementById('closeCustomContentModal');
  const customContentForm = document.getElementById('customContentForm');
  const customContentList = document.getElementById('customContentList');
  const customMediaInput = document.getElementById('customMedia');

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
  if (closeCustomContentModalBtn) {
    closeCustomContentModalBtn.addEventListener('click', hideCustomContentModal);
  }
  // Optional: ESC key closes modal
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && customContentModal.classList.contains('show')) {
      hideCustomContentModal();
    }
  });

  // Show modal when admin clicks 'Create Content' button
  if (openCustomContentModalBtn) {
    openCustomContentModalBtn.addEventListener('click', showCustomContentModal);
  }

  // Custom content form submission logic
  customContentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('customTitle').value;
    const body = document.getElementById('customBody').value;
    const date = document.getElementById('customDate').value || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const uploader = document.getElementById('customUploader').value;
    const file = customMediaInput.files[0];

    let mediaHTML = '';
    if (file) {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        mediaHTML = `<img src="${url}" alt="User uploaded" class="img-fluid rounded mb-2 w-100 custom-media-thumb" style="cursor:pointer;max-height:350px;object-fit:contain;" onclick="showFullMedia('${url}','image')">`;
      } else if (file.type.startsWith('video/')) {
        mediaHTML = `<video src="${url}" controls class="img-fluid rounded mb-2 w-100 custom-media-thumb" style="cursor:pointer;max-height:350px;object-fit:contain;" onclick="showFullMedia('${url}','video')"></video>`;
      }
    }

    const snippet = `<div class='card mb-3'><div class='card-body'>${mediaHTML}<h5 class='card-title'>${title}</h5><p class='card-text'>${body}</p><p class='text-muted mb-0' style='font-size:0.95em;'>Posted on ${date} by ${uploader}</p></div></div>`;
    customContentList.insertAdjacentHTML('afterbegin', snippet);
    customContentForm.reset();
  });

  // Full-size media modal logic
  window.showFullMedia = function(url, type) {
    let modal = document.getElementById('fullMediaModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'fullMediaModal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.9)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '3000';
      modal.innerHTML = `<span id='closeFullMediaModal' style='position:absolute;top:20px;right:30px;font-size:2.5em;color:#fff;cursor:pointer;z-index:3100;'>&times;</span><div id='fullMediaContent'></div>`;
      document.body.appendChild(modal);
    }
    const content = document.getElementById('fullMediaContent');
    if (type === 'image') {
      content.innerHTML = `<img src='${url}' class='img-fluid' style='max-width:95vw;max-height:85vh;border-radius:8px;'>`;
    } else if (type === 'video') {
      content.innerHTML = `<video src='${url}' controls autoplay class='img-fluid' style='max-width:95vw;max-height:85vh;border-radius:8px;background:#000;'></video>`;
    }
    modal.style.display = 'flex';
    document.getElementById('closeFullMediaModal').onclick = function() {
      modal.style.display = 'none';
      content.innerHTML = '';
    };
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        content.innerHTML = '';
      }
    };
  };

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
