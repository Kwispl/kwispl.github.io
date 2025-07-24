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
    const totaalDagen = data.klanten.reduce((sum, klant) => sum + klant.aantal_dagen, 0);

    const gemiddeld = (totaalDagen / totaalKeren).toFixed(0);

    document.getElementById('gemiddeld-tekst').textContent = `Gemiddeld word ik ${gemiddeld} dagen per boeking ingeschakeld.`;
  })
  .catch(error => {
    console.error("Fout bij laden van clients.json:", error);
  });

