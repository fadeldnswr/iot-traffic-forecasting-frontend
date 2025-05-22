// graphs.js with Axios and dynamic prediction
const GRAPH_API_URL_BASE = "http://127.0.0.1:8000";
let currentDevice = 'ESP32 - A';
let currentModel = 'ARIMA';
let currentHours = 1;

const GRAPH_COLUMNS = [
  { key: "humidity(%)", title: "Humidity" },
  { key: "temperature", title: "Temperature" },
  { key: "latency(ms)", title: "Latency" },
  { key: "rssi(dBm)", title: "RSSI" },
  { key: "packet_loss(%)", title: "Packet Loss" },
  { key: "throughput(bytes/sec)", title: "Throughput" },
];

function getDeviceSuffix() {
  if (currentDevice.toLowerCase().includes("b")) return "esp32-2";
  return "esp32-1";
}

function navigateTo(section, label) {
  if (label) currentDevice = label;
  document.querySelectorAll('.main-content').forEach(el => el.classList.remove('active'));
  document.getElementById(section).classList.add('active');

  const labelElem = document.getElementById('section-label-' + section);
  if (labelElem) labelElem.innerText = currentDevice;

  document.getElementById('home-fab').style.display = section === 'start' ? 'none' : 'flex';

  if (section === 'graphs') fetchAllGraphs();
  if (section === 'prediction') fetchPredictionData();
}

function navigateToGraphs(section, label) {
  if(label) currentDevice = label;
  navigateTo(section, label);
}

async function fetchAllGraphs() {
  try {
    const colQuery = GRAPH_COLUMNS.map(col => col.key).join(",");
    const deviceSuffix = getDeviceSuffix();
    const apiURL = `${GRAPH_API_URL_BASE}/graphs/all/${deviceSuffix}`;

    const response = await axios.get(apiURL, {
      params: { columns: colQuery }
    });

    const result = response.data;

    if (result.labels && result.data) {
      GRAPH_COLUMNS.forEach(col => {
        const container = Array.from(document.querySelectorAll("#graphs .graph-box")).find(box =>
          box.querySelector("h3")?.textContent?.toLowerCase().includes(col.title.toLowerCase())
        );
        if (container) {
          const content = container.querySelector(".graph-content");
          content.innerHTML = "";
          const canvas = document.createElement("canvas");
          content.appendChild(canvas);
          renderChart(canvas.getContext("2d"), result.labels, result.data[col.key], col.title);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching graphs:", error);
  }
}

async function fetchPredictionData() {
  try {
    const deviceSuffix = getDeviceSuffix();
    const apiURL = `${GRAPH_API_URL_BASE}/${deviceSuffix}-prediction/`;

    const resp = await axios.post(apiURL, null, {
      params: { hour: currentHours }
    });
    console.log("API response:", resp.data);

    const { labels, data, actual_length } = resp.data;

    if (!Array.isArray(labels) || typeof data !== "object" || typeof actual_length !== "number") {
      console.error("Bad prediction response format", resp.data);
      return;
    }

    GRAPH_COLUMNS.forEach(col => {
      const key = col.key;
      const series = data[key];

      if (!Array.isArray(series)) {
        console.warn(`No series for ${key}`);
        return;
      }

      const actualData = series.map((v, i) => i < actual_length ? v : null);
      const forecastData = series.map((v, i) => i >= actual_length ? v : null);

      // 📌 Cari container berdasarkan data-key, bukan h3.textContent
      const container = document.querySelector(`#prediction .graph-box[data-key="${key}"]`);
      if (!container) {
        console.warn(`No container found for key: ${key}`);
        return;
      }

      const content = container.querySelector(".graph-content");
      content.innerHTML = "";
      const canvas = document.createElement("canvas");
      content.appendChild(canvas);

      renderChartWithForecast(
        canvas.getContext("2d"),
        labels,
        actualData,
        forecastData,
        col.title
      );
    });

  } catch (error) {
    console.error("Error fetching predictions:", error);
  }
}


const yLabelMap = {
  "Humidity": "Humidity (%)",
  "Temperature": "Temperature (°C)",
  "Latency": "Latency (ms)",
  "RSSI": "RSSI (dBm)",
  "Packet Loss": "Packet Loss (%)",
  "Throughput": "Throughput (bytes/sec)"
};

function renderChartWithForecast(ctx, labels, actualData, forecastData, label) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Actual",
          data: actualData,
          fill: false,
          borderColor: "#007bff",
        },
        {
          label: "Forecast",
          data: forecastData,
          fill: false,
          borderColor: "#ff9800",
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        x: { display: false },
        y: { beginAtZero: false },
      },
    },
  });
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

async function showPopup(columnTitle) {
  const columnKey = GRAPH_COLUMNS.find(col => col.title === columnTitle)?.key;
  if (!columnKey) return alert("Kolom tidak ditemukan");

  const isPredictionPage = document.getElementById("prediction").classList.contains("active");
  const deviceSuffix = getDeviceSuffix();

  try {
    let result;
    if (isPredictionPage) {
      const apiURL = `${GRAPH_API_URL_BASE}/${deviceSuffix}-prediction/`;
      const response = await axios.post(apiURL, null, {
        params: { hour: currentHours }
      });
      result = response.data;
    } else {
      const apiURL = `${GRAPH_API_URL_BASE}/graphs/all/${deviceSuffix}`;
      const response = await axios.get(apiURL, {
        params: { columns: columnKey }
      });
      result = response.data;
    }

    if (result.labels && result.data && result.data[columnKey]) {
      document.getElementById("popupTitle").textContent = columnTitle;
      document.getElementById("popupContent").textContent = columnTitle;

      const content = document.querySelector("#popup .modal-content");
      const oldCanvas = content.querySelector("canvas");
      if (oldCanvas) oldCanvas.remove();

      const canvas = document.createElement("canvas");
      canvas.id = `popup-canvas-${columnKey}`;
      content.appendChild(canvas);

      if (isPredictionPage && typeof result.actual_length === "number") {
        const series = result.data[columnKey];
        const actual_length = result.actual_length;

        const actualData = series.map((v, i) => i < actual_length ? v : null);
        const forecastData = series.map((v, i) => i >= actual_length ? v : null);
        renderChartWithForecast(canvas.getContext("2d"), result.labels, actualData, forecastData, columnTitle);
      } else {
        renderChart(canvas.getContext("2d"), result.labels, result.data[columnKey], columnTitle);
      }

      document.getElementById("popup").style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching popup graph:", error);
  }
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

  const selectedHoursElem = document.getElementById('selected-hours');
  const predictionHoursElem = document.getElementById('prediction-hours');
  const summaryHoursElem = document.getElementById('summary-hours');

  if (selectedHoursElem) selectedHoursElem.innerText = `${hours} Hours`;
  if (predictionHoursElem) predictionHoursElem.innerText = hours;
  if (summaryHoursElem) summaryHoursElem.innerText = hours;

  document.querySelectorAll('.hours-option').forEach(option => {
    option.classList.remove('selected');
    option.querySelector('.checkmark').style.opacity = 0;
  });

  const selectedOption = document.querySelector(`.hours-option[data-hours="${hours}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    selectedOption.querySelector('.checkmark').style.opacity = 1;
  }

  const dropdown = document.getElementById('hours-dropdown');
  const chevron = document.getElementById('hours-chevron');
  if (dropdown) dropdown.style.display = 'none';
  if (chevron) chevron.classList.remove('up');

  // Trigger prediction fetch after selecting hours
  fetchPredictionData();
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

function renderChart(ctx, labels, data, label) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          fill: false,
          borderColor: "#007bff",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: { beginAtZero: false },
      },
    },
  });
}

window.navigateToGraphs = navigateToGraphs;
window.navigateToPrediction = () => navigateTo('prediction');
window.showPopup = showPopup;


