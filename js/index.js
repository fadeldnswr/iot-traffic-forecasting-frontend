let currentDevice = 'ESP32 - A';
    let currentModel = 'ARIMA';
    let currentHours = 1;
    
    function navigateTo(section, label) {
      if (label) currentDevice = label;
      document.querySelectorAll('.main-content').forEach(el => el.classList.remove('active'));
      document.getElementById(section).classList.add('active');
      if (document.getElementById('section-label-' + section)) {
        document.getElementById('section-label-' + section).innerText = currentDevice;
      }
      
      // Show/hide floating home button
      if (section === 'start') {
        document.getElementById('home-fab').style.display = 'none';
      } else {
        document.getElementById('home-fab').style.display = 'flex';
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
    
    function toggleDropdown(type) {
      const dropdown = document.getElementById(type + '-dropdown');
      const chevron = document.getElementById(type + '-chevron');
      
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        chevron.classList.remove('up');
      } else {
        dropdown.style.display = 'block';
        chevron.classList.add('up');
      }
    }
    
    function selectModel(model) {
      currentModel = model;
      document.getElementById('selected-model').innerText = model;
      document.getElementById('prediction-model-title').innerText = model;
      document.getElementById('summary-model').innerText = model;
      
      // Update selected state in dropdown
      document.querySelectorAll('.model-option').forEach(option => {
        if (option.dataset.model === model) {
          option.classList.add('selected');
        } else {
          option.classList.remove('selected');
        }
      });
      
      // Close dropdown
      toggleDropdown('model');
    }
    
    function selectHours(hours) {
      currentHours = hours;
      document.getElementById('selected-hours').innerText = hours + ' Jam';
      document.getElementById('prediction-hours').innerText = hours;
      document.getElementById('summary-hours').innerText = hours;
      
      // Update selected state in dropdown
      document.querySelectorAll('.hours-option').forEach(option => {
        if (parseInt(option.dataset.hours) === hours) {
          option.classList.add('selected');
        } else {
          option.classList.remove('selected');
        }
      });
      
      // Close dropdown
      toggleDropdown('hours');
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
      // Handle model dropdown
      const modelToolbar = document.querySelector('.model-toolbar');
      const modelDropdown = document.getElementById('model-dropdown');
      
      if (modelDropdown.style.display === 'block' && 
          !modelToolbar.contains(event.target) && 
          !modelDropdown.contains(event.target)) {
        toggleDropdown('model');
      }
      
      // Handle hours dropdown
      const hoursToolbar = document.querySelector('.hours-toolbar');
      const hoursDropdown = document.getElementById('hours-dropdown');
      
      if (hoursDropdown.style.display === 'block' && 
          !hoursToolbar.contains(event.target) && 
          !hoursDropdown.contains(event.target)) {
        toggleDropdown('hours');
      }
    });
    
    // Add some animation to elements when they appear
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.graph-box, .esp-card, button').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'all 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      });
    });