import config from "../conf/index.js";

// ✅ Fetch reservations
async function fetchReservations() {
  try {
    const res = await fetch(`${config.backendEndpoint}/reservations`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return null;
  }
}

// ✅ Add reservations to table
function addReservationToTable(reservations) {
  const tableParent = document.getElementById("reservation-table-parent");
  const noReservationBanner = document.getElementById("no-reservation-banner");
  const tableBody = document.getElementById("reservation-table-body");

  if (!reservations || reservations.length === 0) {
    noReservationBanner.style.display = "block";
    tableParent.style.display = "none";
    return;
  }

  noReservationBanner.style.display = "none";
  tableParent.style.display = "block";

  reservations.forEach((ele) => {
    const row = document.createElement("tr");
    row.id = ele.id;

    // ✅ Format date (dd/mm/yyyy)
    const formattedDate = new Date(ele.date).toLocaleDateString("en-IN");

    // ✅ Format booking time (remove “at” → replace with comma)
    const formattedTime = new Date(ele.time)
      .toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
      .replace(" at", ",");

    row.innerHTML = `
      <td><a href="../detail/?adventure=${ele.adventure}" target="_blank">${ele.id}</a></td>
      <td>${ele.name}</td>
      <td>${ele.adventureName}</td>
      <td>${ele.person}</td>
      <td>${formattedDate}</td>
      <td>${ele.price}</td>
      <td>${formattedTime}</td>
      <td><button id="${ele.id}" class="reservation-visit-button">Visit Adventure</button></td>
    `;

    tableBody.appendChild(row);
  });
}

export { fetchReservations, addReservationToTable };
