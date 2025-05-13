 let currentDevice = 'ESP32 - A';
    function navigateTo(section, label) {
      if (label) currentDevice = label;
      document.querySelectorAll('.main-content').forEach(el => el.classList.remove('active'));
      document.getElementById(section).classList.add('active');
      if (document.getElementById('section-label-' + section)) {
        document.getElementById('section-label-' + section).innerText = currentDevice;
      }
    }
    function showPopup(title) {
      document.getElementById('popupTitle').innerText = title;
      document.getElementById('popupContent').innerText = title;
      document.getElementById('popup').style.display = 'block';
    }
    function closePopup() {
      document.getElementById('popup').style.display = 'none';
    }