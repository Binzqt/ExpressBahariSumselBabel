const tickets = [];
const classPrice = {
  Ekonomi: 208000,
  Eksekutif: 258000,
  VIP: 308000,
};

document
  .getElementById("ticketForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const loadingContainer = document.getElementById("loadingContainer");
    const loadingBar = document.getElementById("loadingBar");
    const successMessage = document.getElementById("successMessage");
    const submitButton = this.querySelector('button[type="submit"]');

    loadingContainer.style.display = "block";
    successMessage.style.display = "none";

    setTimeout(() => {
      loadingBar.style.width = "100%";
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const ticket = {
      title: document.getElementById("title").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      departureDay: document.getElementById("departureDay").value,
      departureDate: document.getElementById("departureDate").value,
      route: document.getElementById("route").value,
      travelClass: document.getElementById("travelClass").value,
      needsCar: document.getElementById("needsCar").checked,
      departureTime: "07:30",
      arrivalTime: "10:30",
      price: calculatePrice(
        document.getElementById("travelClass").value,
        document.getElementById("needsCar").checked
      ),
    };

    tickets.push(ticket);

    loadingContainer.style.display = "none";
    window.alert("E-tiket berhasil diterbitkan!");
    successMessage.style.display = "block";
    submitButton.textContent = "Pesan Tiket Lagi";

    setTimeout(() => {
      updateTicketDisplay();
    }, 500);

    this.reset();

    setTimeout(() => {
      loadingBar.style.width = "0%";
    }, 3500);
  });

function calculatePrice(travelClass, needsCar) {
  let price = classPrice[travelClass] || 0;
  if (needsCar) price += 100000;
  return price;
}

function updateTicketDisplay() {
  const container = document.getElementById("ticketContainer");
  const ticketList = document.getElementById("ticketList");
  container.style.display = "block";

  ticketList.innerHTML = tickets
    .map(
      (ticket, index) => `
                <div class="ticket">
                    <h3 class="ticket-header">Tiket ${index + 1}</h3>
                    <div class="ticket-details">
                        <div class="ticket-detail-item">
                            <strong>Nama:</strong> ${ticket.title} ${
        ticket.firstName
      } ${ticket.lastName}
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Hari:</strong> ${ticket.departureDay}
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Tanggal:</strong> ${ticket.departureDate}
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Kelas:</strong> ${ticket.travelClass}
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Rute:</strong> ${ticket.route}
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Jam Keberangkatan:</strong> ${
                              ticket.departureTime
                            }
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Mobil Travel:</strong> ${
                              ticket.needsCar ? "Ya" : "Tidak"
                            }
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Total Harga:</strong> Rp ${ticket.price.toLocaleString()}
                        </div>
                    </div>
                </div>
            `
    )
    .join("");
}

function downloadTickets() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Detail Tiket Pemesanan Express Bahari", 20, 20);

  let yPosition = 40;

  tickets.forEach((ticket, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text(`Tiket ${index + 1}`, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const details = [
      `Nama: ${ticket.title} ${ticket.firstName} ${ticket.lastName}`,
      `Hari: ${ticket.departureDay}`,
      `Tanggal: ${ticket.departureDate}`,
      `Kelas: ${ticket.travelClass}`,
      `Rute: ${ticket.route}`,
      `Jam Keberangkatan: ${ticket.departureTime}`,
      `Mobil Travel: ${ticket.needsCar ? "Ya" : "Tidak"}`,
      `Total Harga: Rp ${ticket.price.toLocaleString()}`,
    ];

    details.forEach((detail) => {
      doc.text(detail, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;
  });

  doc.save("tiket-express-bahari.pdf");
}
