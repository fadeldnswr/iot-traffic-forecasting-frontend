// Define global variables
let currentDevice = 'ESP32 - A';
  let currentModel = 'ARIMA';
  let currentHours = 1;

  function navigateTo(section, label) {
    if (label) currentDevice = label;
    document.querySelectorAll('.main-content').forEach(el => el.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    const labelElem = document.getElementById('section-label-' + section);
    if (labelElem) labelElem.innerText = currentDevice;
    document.getElementById('home-fab').style.display = section === 'start' ? 'none' : 'flex';
  }

  function showPopup(title) {
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupContent').innerText = title;
    document.getElementById('popup').style.display = 'block';
  }

  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }

  function toggleDropdown(type) {
    const dropdown = document.getElementById(`${type}-dropdown`);
    const chevron = document.getElementById(`${type}-chevron`);
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    chevron.classList.toggle('up', !isOpen);
  }

  function selectModel(model) {
    currentModel = model;
    document.getElementById('selected-model').innerText = model;
    document.getElementById('prediction-model-title').innerText = model;
    document.getElementById('summary-model').innerText = model;

    document.querySelectorAll('.model-option').forEach(option => {
      option.classList.remove('selected');
      option.querySelector('.checkmark').style.opacity = 0;
    });

    const selectedOption = document.querySelector(`.model-option[data-model="${model}"]`);
    selectedOption.classList.add('selected');
    selectedOption.querySelector('.checkmark').style.opacity = 1;

    document.getElementById('model-dropdown').style.display = 'none';
    document.getElementById('model-chevron').classList.remove('up');
  }

  function selectHours(hours) {
    currentHours = hours;
    document.getElementById('selected-hours').innerText = `${hours} Jam`;
    document.getElementById('prediction-hours').innerText = hours;
    document.getElementById('summary-hours').innerText = hours;

    document.querySelectorAll('.hours-option').forEach(option => {
      option.classList.remove('selected');
      option.querySelector('.checkmark').style.opacity = 0;
    });

    const selectedOption = document.querySelector(`.hours-option[data-hours="${hours}"]`);
    selectedOption.classList.add('selected');
    selectedOption.querySelector('.checkmark').style.opacity = 1;

    document.getElementById('hours-dropdown').style.display = 'none';
    document.getElementById('hours-chevron').classList.remove('up');
  }

  document.addEventListener('click', function(event) {
    const modelToolbar = document.querySelector('.model-toolbar');
    const modelDropdown = document.getElementById('model-dropdown');
    if (modelDropdown.style.display === 'block' && !modelToolbar.contains(event.target) && !modelDropdown.contains(event.target)) {
      modelDropdown.style.display = 'none';
      document.getElementById('model-chevron').classList.remove('up');
    }

    const hoursToolbar = document.querySelector('.hours-toolbar');
    const hoursDropdown = document.getElementById('hours-dropdown');
    if (hoursDropdown.style.display === 'block' && !hoursToolbar.contains(event.target) && !hoursDropdown.contains(event.target)) {
      hoursDropdown.style.display = 'none';
      document.getElementById('hours-chevron').classList.remove('up');
    }
  });
