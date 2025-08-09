document.addEventListener('DOMContentLoaded', function() {
  // DOM!
  const fileInput = document.getElementById('video-upload');
  const dropContainer = document.getElementById('dropcontainer');
  const videoPlayer = document.getElementById('video-player');
  const storieToggle = document.getElementById('storie-toggle');
  const darkModeToggle = document.querySelector('.theme-switch input[type="checkbox"]');
  const topOverlay = document.getElementById('top');
  const bottomOverlay = document.getElementById('bottom');
  const videoWrapper = document.getElementById('video-wrapper');

  // Actualizar metadata del video
  function updateMetadata(file) {
    if (file) {
      const {
        name: fileName,
        size
      } = file;
      const fileSize = (size / 1000).toFixed(2);
      document.querySelector('.file-name').textContent = `${fileName} - ${fileSize}KB`;
    } else {
      document.querySelector('.file-name').textContent = 'No file selected';
    }
  }

  // Muestra un mensaje de error
  function showError(message) {
    document.querySelector('.file-name').textContent = message;
  }

  // Maneja la selección de archivos
  function handleFileSelection(file) {
    if (!file) return;

    // Verificamos el tipo de archivo…
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      showError('Solo acepto videos :)');
      return;
    }

    const source = document.createElement('source');
    source.src = URL.createObjectURL(file);
    source.type = file.type;

    videoPlayer.innerHTML = '';
    videoPlayer.appendChild(source);
    videoPlayer.load();
    updateMetadata(file);
  }

  // Actualizamos el input de carga
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    handleFileSelection(file);
  });

  // Funcionalidad de arrastrar y soltar
  dropContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropContainer.classList.add('drag-active');
  });

  dropContainer.addEventListener('dragleave', () => {
    dropContainer.classList.remove('drag-active');
  });

  dropContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    dropContainer.classList.remove('drag-active');
    fileInput.files = e.dataTransfer.files;
    if (fileInput.files.length > 0) {
      handleFileSelection(fileInput.files[0]);
    }
  });


  // Muestra un mensaje de carga...
  function showLoading() {
    document.querySelector('.file-name').textContent = 'Cargando...';
  }

  // Desactiva el mensaje de carga
  function hideLoading() {
  }

  // Actualiza la funcion handleFileSelection para verificar que es un video
  function handleFileSelection(file) {
    if (!file) return;

    // Check file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      showError('Solo acepto videos ahora :)');
      return;
    }

    // Muestra el mensaje de carga...
    showLoading();

    setTimeout(() => {
      const source = document.createElement('source');
      source.src = URL.createObjectURL(file);
      source.type = file.type;

      videoPlayer.innerHTML = '';
      videoPlayer.appendChild(source);

      videoPlayer.onloadeddata = function() {
        hideLoading();
        updateMetadata(file);
      };

      videoPlayer.onerror = function() {
        hideLoading();
        showError('Error! Intenta con otro video.');
      };

      videoPlayer.load();
    }, 0); // Ligero delay para simular carga
  }

  // Cambiar formato de Reels a Storie y viceversa
  storieToggle.addEventListener('change', function() {
    if (this.checked) {
      topOverlay.src = 'assets/storie_top.png';
      topOverlay.alt = 'Storie Overlay';
      bottomOverlay.src = 'assets/storie_bottom.png';
      bottomOverlay.alt = 'Storie Overlay';
      videoWrapper.classList.add('is-storie');
    } else {
      topOverlay.src = 'assets/reel_top.png';
      topOverlay.alt = 'Reel Overlay';
      bottomOverlay.src = 'assets/reel_bottom.png';
      bottomOverlay.alt = 'Reel Overlay';
      videoWrapper.classList.remove('is-storie');
    }
  });

  // Cambiar tema oscuro/claro
  function switchTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Iniciar el tema basado en la preferencia del usuario
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    darkModeToggle.checked = currentTheme === 'dark';
  }

  darkModeToggle.addEventListener('change', switchTheme);
});