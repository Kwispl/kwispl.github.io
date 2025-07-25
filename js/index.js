fetch('clients.json')
  .then(response => response.json())
  .then(data => {
    // 1. Alle soorten verzamelen
    const soorten = [];
    data.klanten.forEach(k => {
      k.soort_beestje.forEach(s => {
        soorten.push(s.trim().toLowerCase());
      });
    });

    // 2. Tellen
    const tellingen = {};
    soorten.forEach(soort => {
      tellingen[soort] = (tellingen[soort] || 0) + 1;
    });

    const labels = Object.keys(tellingen).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    const aantallen = Object.values(tellingen);

    const kleuren = [
      '#81b29a', '#f7c59f', '#e07a5f', '#3d405b', '#f2cc8f', '#6d9d88', '#b8c1ec'
    ];

    const ctx = document.getElementById('grafiek').getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: aantallen,
          backgroundColor: kleuren.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 0,
          hoverBackgroundColor: kleuren.slice(0, labels.length),
          hoverBorderColor: kleuren.slice(0, labels.length)
        }]
      },
      options: {
        plugins: {
          tooltip: {
            enabled: false
          },
          datalabels: {
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = (value / total * 100).toFixed(1) + '%';
              return percentage;
            },
            color: '#fff',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });

    const totaalKeren = data.klanten.reduce((sum, klant) => sum + klant.aantal_keren, 0);
    let totaalDagen = 0;

    data.klanten.forEach(klant => {
      const dagen = klant.aantal_dagen;

      if (Array.isArray(dagen)) {
        // Verwijder komma’s en spaties, en tel elk item op
        dagen.forEach(dag => {
          const nummer = parseInt(dag.toString().replace(/[^0-9]/g, ''), 10);
          if (!isNaN(nummer)) {
            totaalDagen += nummer;
          }
        });
      } else {
        // Enkel getal
        const nummer = parseInt(dagen, 10);
        if (!isNaN(nummer)) {
          totaalDagen += nummer;
        }
      }
    });

    const gemiddeld = (totaalDagen / totaalKeren).toFixed(0);

    // Extra weetjes
    const klantenMetHerhaling = data.klanten.filter(k => k.aantal_keren > 1).length;

    let totaalBeestjes = 0;
    data.klanten.forEach(klant => {
    const b = klant.beestjes;
    if (Array.isArray(b)) {
        totaalBeestjes += b.length;
    } else if (typeof b === "string") {
        totaalBeestjes += 1;
    }
    });

    // Tekst genereren
    const weetjeEl = document.getElementById("gemiddeld-tekst");
    weetjeEl.innerHTML = `
        <p><strong>Weetjes! 🐾</strong></p>
        <ul class="weetje-lijst">
            <li>📆 <span class="accent">${data.klanten.length}</span> baasjes boekten me al <span class="accent">${totaalKeren}</span> keer, telkens gemiddeld voor <span class="accent">${gemiddeld}</span> dagen.</li>
            <li>🔁 <span class="accent">${klantenMetHerhaling}</span> baasje${klantenMetHerhaling === 1 ? '' : 's'} boekte${klantenMetHerhaling === 1 ? '' : 'n'} mij meerdere keren.</li>
            <li>🐶 In totaal zorgde ik al voor <span class="accent">${totaalBeestjes}</span> dieren.</li>
        </ul>
        `;
  })
  .catch(error => {
    console.error("Fout bij laden van clients.json:", error);
  });


  // Scroll to block
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });


// COOKIES 


  document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const button = document.getElementById("cookie-accept");
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const acceptedAt = localStorage.getItem("cookieAcceptedAt");

    const isAcceptedRecently = acceptedAt && (Date.now() - Number(acceptedAt)) < THIRTY_DAYS;

    if (!isAcceptedRecently) {
      banner.style.display = "flex";
    } else {
      banner.style.display = "none";
    }

    button.addEventListener("click", () => {
      localStorage.setItem("cookieAcceptedAt", Date.now().toString());
      banner.style.display = "none";
    });
  });


// Show current year in footer

document.getElementById("copyright-year").innerHTML = `&copy; ${new Date().getFullYear()}`;