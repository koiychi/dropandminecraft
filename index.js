// Move custom content section JavaScript from index.html to this file

document.addEventListener('DOMContentLoaded', function() {
  // --- Tab Dropdown Logic (Mobile) ---
  var dropdown = document.getElementById('newsMomentsTabDropdown');
  if (dropdown) {
    // Always set to Server News on load
    dropdown.value = 'newsTabPane';
    var tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(function(pane) {
      pane.classList.remove('show', 'active');
    });
    var selectedPane = document.getElementById('newsTabPane');
    if (selectedPane) {
      selectedPane.classList.add('show', 'active');
    }
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

  // --- Tab system for media input (image or YouTube) ---
  const imageTab = document.getElementById('image-tab');
  const youtubeTab = document.getElementById('youtube-tab');
  const imageTabPane = document.getElementById('imageTabPane');
  const youtubeTabPane = document.getElementById('youtubeTabPane');
  const imageInput = document.getElementById('customImage');
  const youtubeInput = document.getElementById('customYoutube');

  function setMediaTab(tab) {
    if (tab === 'image') {
      imageTab.classList.add('active');
      youtubeTab.classList.remove('active');
      imageTabPane.classList.add('show', 'active');
      youtubeTabPane.classList.remove('show', 'active');
      imageInput.disabled = false;
      youtubeInput.disabled = true;
      youtubeInput.value = '';
    } else {
      youtubeTab.classList.add('active');
      imageTab.classList.remove('active');
      youtubeTabPane.classList.add('show', 'active');
      imageTabPane.classList.remove('show', 'active');
      youtubeInput.disabled = false;
      imageInput.disabled = true;
      imageInput.value = '';
    }
  }
  if (imageTab && youtubeTab) {
    imageTab.addEventListener('click', function() { setMediaTab('image'); });
    youtubeTab.addEventListener('click', function() { setMediaTab('youtube'); });
    // Default to image tab
    setMediaTab('image');
  }

  if (form && list) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('customTitle').value.trim();
      const body = document.getElementById('customBody').value.trim();
      const dateInput = document.getElementById('customDate');
      const uploader = document.getElementById('customUploader').value.trim();
      let postDate = dateInput && dateInput.value.trim() ? dateInput.value.trim() : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      let imageHTML = '';
      let youtubeEmbed = '';
      let imageData = '';

      // Only allow one media type
      const isImageTab = imageTab.classList.contains('active');
      const isYoutubeTab = youtubeTab.classList.contains('active');

      function addCardAndSave() {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        let exportSnippet = `<div class='card mb-3><div class='card-body'>\n`;
        if (isImageTab && imageHTML) {
          exportSnippet += `${imageHTML.replace(/ style=\"[^\"]*\"/g, '')}\n`;
        }
        exportSnippet += `<h5 class='card-title'>${title}</h5>\n<p class='card-text'>${body}</p>\n`;
        if (isYoutubeTab && youtubeEmbed) {
          exportSnippet += `${youtubeEmbed}\n`;
        }
        exportSnippet += `<p class='text-muted mb-0' style='font-size:0.95em;'>Posted by ${uploader} on ${postDate}</p>\n</div></div>`;

        const fullHTML = `
          <div class='card-body'>
            ${isImageTab && imageHTML ? imageHTML : ''}
            <h5 class='card-title'>${title}</h5>
            <p class='card-text'>${body}</p>
            ${isYoutubeTab && youtubeEmbed ? youtubeEmbed : ''}
            <p class='text-muted mb-0' style='font-size:0.95em;'>Posted by ${uploader} on ${postDate}</p>
          </div>
        `;
        card.innerHTML = fullHTML;
        list.prepend(card);
        form.reset();
        setMediaTab('image');

        if (formSection && formSection.style.display !== 'none') {
          let exportDiv = document.getElementById('customContentExport');
          if (!exportDiv) {
            exportDiv = document.createElement('div');
            exportDiv.id = 'customContentExport';
            exportDiv.style = 'background:#f8f9fa; border:1px solid #ccc; padding:1em; margin-top:1em; overflow:auto; position:relative;';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy HTML';
            copyBtn.className = 'btn btn-sm btn-outline-primary position-absolute';
            copyBtn.style = 'top:8px; right:8px;';
            exportDiv.appendChild(copyBtn);

            const snippetPre = document.createElement('pre');
            snippetPre.tabIndex = 0;
            snippetPre.setAttribute('title', 'Click to select all');
            snippetPre.style = 'margin-top:2.5em; background:transparent; border:none; padding:0; white-space:pre-wrap; word-break:break-word;';
            snippetPre.addEventListener('click', function () {
              const range = document.createRange();
              range.selectNodeContents(snippetPre);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            });

            exportDiv.appendChild(snippetPre);
            form.parentNode.appendChild(exportDiv);

            copyBtn.onclick = function () {
              navigator.clipboard.writeText(snippetPre.textContent);
              copyBtn.textContent = 'Copied!';
              setTimeout(() => copyBtn.textContent = 'Copy HTML', 1200);
            };
          }

          exportDiv.querySelector('pre').textContent = exportSnippet.trim();
        }
      }

      // --- Decide what the user submitted and build the snippet ---
      if (isYoutubeTab) {
        const youtubeURL = youtubeInput.value.trim();
        const match = youtubeURL.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w\-]{11})/);
        if (match) {
          const videoId = match[1];
          youtubeEmbed = `<div class='ratio ratio-16x9 mb-2'><iframe src='https://www.youtube.com/embed/${videoId}' frameborder='0' allowfullscreen></iframe></div>`;
        }
        addCardAndSave();
        return;
      }
      if (isImageTab && imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const fileName = file.name;
        const tryPaths = [`images/${fileName}`, `uploaded_images/${fileName}`];
        let foundPath = null;
        let checkCount = 0;
        function checkNextPath() {
          if (checkCount >= tryPaths.length) {
            // Not found: remind user to upload the file
            imageHTML = `<div class='alert alert-warning'>Image file not found in <code>images/</code> or <code>uploaded_images/</code>. Please add <strong>${fileName}</strong> to the site files and try again.</div>`;
            addCardAndSave();
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
        return;
      }
      // If neither, just render text
      addCardAndSave();
    });
  }

  // Google Form toggle logic for "Submit a post" button
  /*
  const showGoogleFormBtn = document.getElementById('showGoogleFormBtn');
  const googleFormContainer = document.getElementById('googleFormContainer');
  if (showGoogleFormBtn && googleFormContainer) {
    showGoogleFormBtn.addEventListener('click', function() {
      if (googleFormContainer.style.display === 'none' || !googleFormContainer.style.display) {
        googleFormContainer.innerHTML = `<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfDUMMYFORMURL/viewform?embedded=true" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        googleFormContainer.style.display = 'block';
      } else {
        googleFormContainer.style.display = 'none';
        googleFormContainer.innerHTML = '';
      }
    });
  } */

  // Custom Content Modal logic
  const customContentModal = document.getElementById('customContentModal');
  const openCustomContentModalBtn = document.getElementById('openCustomContentModal');
  const closeCustomContentModalBtn = document.getElementById('closeCustomContentModal');

  function showCustomContentModal() {
    if (customContentModal) {
      customContentModal.classList.add('show');
      customContentModal.classList.remove('d-none');
      // Reset form fields
      const form = document.getElementById('customContentForm');
      if (form) form.reset();
      // Clear snippet area
      const snippetArea = document.getElementById('customContentList');
      if (snippetArea) snippetArea.innerHTML = '<!-- Snippet preview and export area only -->';
    }
  }
  function hideCustomContentModal() {
    if (customContentModal) {
      customContentModal.classList.remove('show');
      customContentModal.classList.add('d-none');
    }
  }
  if (openCustomContentModalBtn) {
    openCustomContentModalBtn.addEventListener('click', showCustomContentModal);
  }
  if (closeCustomContentModalBtn) {
    closeCustomContentModalBtn.addEventListener('click', hideCustomContentModal);
  }
  // Optional: ESC key closes modal
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && customContentModal && customContentModal.classList.contains('show')) {
      hideCustomContentModal();
    }
  });
});
