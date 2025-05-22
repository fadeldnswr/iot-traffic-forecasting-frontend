// // graphs.js with Axios and dynamic prediction
// const PREDICT_API_URL_BASE = "http://127.0.0.1:8000";

// const GRAPH_COLUMNS = [
//   { key: "humidity(%)", title: "Humidity" },
//   { key: "temperature", title: "Temperature" },
//   { key: "latency(ms)", title: "Latency" },
//   { key: "rssi(dBm)", title: "RSSI" },
//   { key: "packet_loss(%)", title: "Packet Loss" },
//   { key: "throughput(bytes/sec)", title: "Throughput" },
// ];

// // function getDeviceSuffix() {
// //   if (currentDevice.toLowerCase().includes("b")) return "esp32-2";
// //   return "esp32-1";
// // }

// // function navigateTo(section, label) {
// //   if (label) currentDevice = label;
// //   document.querySelectorAll('.main-content').forEach(el => el.classList.remove('active'));
// //   document.getElementById(section).classList.add('active');

// //   const labelElem = document.getElementById('section-label-' + section);
// //   if (labelElem) labelElem.innerText = currentDevice;

// //   document.getElementById('home-fab').style.display = section === 'start' ? 'none' : 'flex';

// //   if (section === 'graphs') fetchAllGraphs();
// //   if (section === 'prediction') fetchPredictionData();
// // }

// async function fetchAllGraphs() {
//   try {
//     const colQuery = GRAPH_COLUMNS.map(col => col.key).join(",");
//     const deviceSuffix = getDeviceSuffix();
//     const apiURL = `${PREDICT_API_URL_BASE}/graphs/all/${deviceSuffix}`;

//     const response = await axios.get(apiURL, { params: { columns: colQuery } });
//     const result = response.data;

//     if (result.labels && result.data) {
//       GRAPH_COLUMNS.forEach(col => {
//         const container = Array.from(document.querySelectorAll("#graphs .graph-box")).find(box =>
//           box.querySelector("h3")?.textContent?.toLowerCase().includes(col.title.toLowerCase())
//         );
//         if (container) {
//           const content = container.querySelector(".graph-content");
//           content.innerHTML = "";
//           const canvas = document.createElement("canvas");
//           content.appendChild(canvas);
//           renderChart(canvas.getContext("2d"), result.labels, result.data[col.key], col.title);
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching graphs:", error);
//   }
// }

// async function fetchPredictionData() {
//   try {
//     const deviceSuffix = getDeviceSuffix();
//     const apiURL = `${PREDICT_API_URL_BASE}/${deviceSuffix}-prediction/`;

//     const response = await axios.post(apiURL, null, {
//       params: {
//         hour: currentHours
//       }
//     });

//     const result = response.data;

//     if (result.labels && result.data) {
//       GRAPH_COLUMNS.forEach(col => {
//         const container = Array.from(document.querySelectorAll("#prediction .graph-box")).find(box =>
//           box.querySelector("h3")?.textContent?.toLowerCase().includes(col.title.toLowerCase())
//         );
//         if (container) {
//           const content = container.querySelector(".graph-content");
//           content.innerHTML = "";
//           const canvas = document.createElement("canvas");
//           content.appendChild(canvas);
//           renderChart(canvas.getContext("2d"), result.labels, result.data[col.key], col.title);
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching predictions:", error);
//   }
// }

// function navigateToPrediction() {
//   navigateTo("prediction");
// }


// // function renderChart(ctx, labels, data, label) {
// //   new Chart(ctx, {
// //     type: "line",
// //     data: {
// //       labels: labels,
// //       datasets: [
// //         {
// //           label: label,
// //           data: data,
// //           fill: false,
// //           borderColor: "#007bff",
// //           tension: 0.2,
// //         },
// //       ],
// //     },
// //     options: {
// //       responsive: true,
// //       plugins: {
// //         legend: { display: true },
// //       },
// //       scales: {
// //         x: {
// //           title: {
// //             display: true,
// //             text: 'Waktu'
// //           }
// //         },
// //         y: {
// //           title: {
// //             display: true,
// //             text: label
// //           }
// //         }
// //       },
// //     },
// //   });
// // }

// // function closePopup() {
// //   document.getElementById('popup').style.display = 'none';
// // }

// // async function showPopup(columnTitle) {
// //   const columnKey = GRAPH_COLUMNS.find(col => col.title === columnTitle)?.key;
// //   if (!columnKey) return alert("Kolom tidak ditemukan");

// //   try {
// //     const deviceSuffix = getDeviceSuffix();
// //     const apiURL = `${GRAPH_API_URL_BASE}/graphs/all/${deviceSuffix}`;
// //     const response = await axios.get(apiURL, {
// //       params: {
// //         columns: columnKey
// //       }
// //     });

// //     const result = response.data;

// //     if (result.labels && result.data && result.data[columnKey]) {
// //       document.getElementById("popupTitle").textContent = columnTitle;
// //       document.getElementById("popupContent").textContent = columnTitle;

// //       const content = document.querySelector("#popup .modal-content");
// //       const oldCanvas = content.querySelector("canvas");
// //       if (oldCanvas) oldCanvas.remove();

// //       const canvas = document.createElement("canvas");
// //       canvas.id = `popup-canvas-${columnKey}`;
// //       content.appendChild(canvas);

// //       renderChart(canvas.getContext("2d"), result.labels, result.data[columnKey], columnTitle);
// //       document.getElementById("popup").style.display = "block";
// //     }
// //   } catch (error) {
// //     console.error("Error fetching popup graph:", error);
// //   }
// // };

// window.navigateToPrediction = navigateToPrediction;
// window.showPopup = showPopup;
