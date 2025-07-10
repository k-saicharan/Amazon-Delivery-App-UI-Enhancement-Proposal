// Dashboard Data
const dashboardData = {
  kpis: {
    timeReduction: {current: 15, proposed: 3, improvement: 80},
    costSavings: 168750000,
    roi: 8337,
    successRate: {current: 95, proposed: 97.9, improvement: 5}
  },
  financial: {
    investment: 2000000,
    annualReturn: 168750000,
    breakEven: 1.2,
    fiveYearTotal: 843800000,
    yearlyProgression: [168750000, 337500000, 506250000, 675000000, 843750000]
  },
  timeline: {
    phases: [
      {name: "Design & Prototyping", weeks: "1-4", cost: 300000, activities: ["UI/UX design", "User research", "Prototyping"]},
      {name: "Development & Integration", weeks: "5-10", cost: 800000, activities: ["Frontend development", "Backend integration", "System testing"]},
      {name: "Pilot Testing", weeks: "11-14", cost: 200000, activities: ["London/Birmingham/Manchester deployment", "Performance metrics", "User feedback"]},
      {name: "Full Rollout", weeks: "15-16", cost: 400000, activities: ["UK-wide deployment", "Training programs", "Live system"]},
      {name: "Optimization & Support", weeks: "17-20", cost: 300000, activities: ["Performance monitoring", "System refinements", "Support documentation"]}
    ]
  },
  operations: {
    totalDrivers: 25000,
    cities: 81,
    pilotRegions: ["London", "Birmingham", "Manchester"],
    deliveryVolume: 1000000000,
    networkCoverage: "UK-wide"
  },
  workflow: {
    current: {
      steps: 6,
      time: 15,
      process: ["Package Scan", "Menu Navigation", "Communication Selection", "Notification Feature", "Customer Selection", "Confirmation"]
    },
    proposed: {
      steps: 2,
      time: 3,
      process: ["Single-Tap Access", "Direct Notification"]
    }
  },
  competitive: {
    companies: [
      {name: "DPD", satisfaction: 61, marketShare: 12, position: 1},
      {name: "Amazon", satisfaction: 60, marketShare: 15, position: 3},
      {name: "Royal Mail", satisfaction: 55, marketShare: 34, position: 4},
      {name: "UPS", satisfaction: 58, marketShare: 8, position: 2},
      {name: "DHL", satisfaction: 57, marketShare: 6, position: 5}
    ]
  }
};

// Global variables
let roiChart, competitiveChart, ukMap;
let currentPhase = 0;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing dashboard...');
  
  // Add a small delay to ensure DOM is fully ready
  setTimeout(() => {
    initializeKPIPanel();
    initializeFinancialChart();
    initializeTimeline();
    initializePerformanceComparison();
    initializeCompetitiveChart();
    initializeFilters();
    initializeExport();
    
    // Initialize map with a longer delay to ensure container is ready
    setTimeout(() => {
      initializeMap();
    }, 500);
  }, 100);
});

// KPI Panel
function initializeKPIPanel() {
  const kpiContainer = document.querySelector('#kpiPanel .card__body');
  if (!kpiContainer) {
    console.error('KPI container not found');
    return;
  }
  
  const kpis = [
    {
      value: `${dashboardData.kpis.timeReduction.current}s → ${dashboardData.kpis.timeReduction.proposed}s`,
      label: 'Time Reduction',
      improvement: `${dashboardData.kpis.timeReduction.improvement}% faster`,
      class: 'kpi-card--blue'
    },
    {
      value: `£${(dashboardData.kpis.costSavings / 1000000).toFixed(1)}M`,
      label: 'Annual Cost Savings',
      improvement: 'First year projection',
      class: 'kpi-card'
    },
    {
      value: `${dashboardData.kpis.roi.toLocaleString()}%`,
      label: 'Return on Investment',
      improvement: 'Within 12 months',
      class: 'kpi-card--green'
    },
    {
      value: `${dashboardData.kpis.successRate.current}% → ${dashboardData.kpis.successRate.proposed}%`,
      label: 'Success Rate',
      improvement: `+${dashboardData.kpis.successRate.improvement}% improvement`,
      class: 'kpi-card--grey'
    }
  ];

  kpiContainer.innerHTML = kpis.map(kpi => `
    <div class="kpi-card ${kpi.class} scale-in">
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-label">${kpi.label}</div>
      <div class="kpi-improvement">${kpi.improvement}</div>
    </div>
  `).join('');
  
  console.log('KPI panel initialized');
}

// Financial Impact Chart
function initializeFinancialChart() {
  const ctx = document.getElementById('roiChart');
  if (!ctx) {
    console.error('ROI chart canvas not found');
    return;
  }
  
  roiChart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: [
        {
          label: 'Cumulative Returns (£M)',
          data: dashboardData.financial.yearlyProgression.map(val => val / 1000000),
          borderColor: '#FF9900',
          backgroundColor: 'rgba(255, 153, 0, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Investment (£M)',
          data: [2, 2, 2, 2, 2],
          borderColor: '#232F3E',
          backgroundColor: 'rgba(35, 47, 62, 0.1)',
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: £${context.parsed.y.toFixed(1)}M`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '£' + value + 'M';
            }
          }
        }
      }
    }
  });
  
  console.log('Financial chart initialized');
}

// Timeline
function initializeTimeline() {
  const timelineList = document.getElementById('timelinePhases');
  const phaseDetails = document.getElementById('phaseDetails');
  
  if (!timelineList || !phaseDetails) {
    console.error('Timeline elements not found');
    return;
  }
  
  timelineList.innerHTML = dashboardData.timeline.phases.map((phase, index) => `
    <li class="timeline-item" data-phase="${index}">
      <div class="timeline-phase">${phase.name}</div>
      <div class="timeline-weeks">Weeks ${phase.weeks}</div>
      <div class="timeline-cost">£${(phase.cost / 1000).toFixed(0)}k</div>
    </li>
  `).join('');
  
  // Add click handlers with proper event delegation
  timelineList.addEventListener('click', function(e) {
    const item = e.target.closest('.timeline-item');
    if (!item) return;
    
    console.log('Timeline item clicked:', item.dataset.phase);
    
    // Remove active class from all items
    document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
    
    // Add active class to clicked item
    item.classList.add('active');
    
    // Show phase details
    const phaseIndex = parseInt(item.dataset.phase);
    currentPhase = phaseIndex;
    showPhaseDetails(phaseIndex);
  });
  
  // Show first phase by default
  const firstItem = document.querySelector('.timeline-item');
  if (firstItem) {
    firstItem.classList.add('active');
    showPhaseDetails(0);
  }
  
  console.log('Timeline initialized');
}

function showPhaseDetails(index) {
  const phase = dashboardData.timeline.phases[index];
  const phaseDetails = document.getElementById('phaseDetails');
  
  if (!phaseDetails || !phase) {
    console.error('Phase details container or phase data not found');
    return;
  }
  
  phaseDetails.innerHTML = `
    <div class="fade-in">
      <h3>${phase.name}</h3>
      <p><strong>Duration:</strong> Weeks ${phase.weeks}</p>
      <p><strong>Budget:</strong> £${(phase.cost / 1000).toFixed(0)}k</p>
      <h4>Key Activities:</h4>
      <ul class="phase-activities">
        ${phase.activities.map(activity => `<li>${activity}</li>`).join('')}
      </ul>
    </div>
  `;
  
  console.log('Phase details updated for phase:', index);
}

// UK Operations Map
function initializeMap() {
  const mapContainer = document.getElementById('ukMap');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }
  
  try {
    ukMap = L.map('ukMap').setView([54.5, -2.5], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(ukMap);
    
    // Add pilot regions
    const pilotCities = [
      {name: 'London', lat: 51.5074, lng: -0.1278, drivers: 8500},
      {name: 'Birmingham', lat: 52.4862, lng: -1.8904, drivers: 3200},
      {name: 'Manchester', lat: 53.4808, lng: -2.2426, drivers: 2800}
    ];
    
    pilotCities.forEach(city => {
      const marker = L.marker([city.lat, city.lng]).addTo(ukMap);
      marker.bindPopup(`
        <div class="custom-popup">
          <h4>${city.name} <span class="status-pilot">PILOT</span></h4>
          <div class="stat"><span>Drivers:</span><span>${city.drivers.toLocaleString()}</span></div>
          <div class="stat"><span>Status:</span><span>Active</span></div>
        </div>
      `);
    });
    
    // Add other major cities
    const otherCities = [
      {name: 'Edinburgh', lat: 55.9533, lng: -3.1883, drivers: 1500},
      {name: 'Cardiff', lat: 51.4816, lng: -3.1791, drivers: 1200},
      {name: 'Belfast', lat: 54.5973, lng: -5.9301, drivers: 800},
      {name: 'Liverpool', lat: 53.4084, lng: -2.9916, drivers: 1900}
    ];
    
    otherCities.forEach(city => {
      const marker = L.marker([city.lat, city.lng]).addTo(ukMap);
      marker.bindPopup(`
        <div class="custom-popup">
          <h4>${city.name}</h4>
          <div class="stat"><span>Drivers:</span><span>${city.drivers.toLocaleString()}</span></div>
          <div class="stat"><span>Status:</span><span>Planned</span></div>
        </div>
      `);
    });
    
    // Force map to recalculate size
    setTimeout(() => {
      ukMap.invalidateSize();
    }, 100);
    
    console.log('Map initialized successfully');
  } catch (error) {
    console.error('Map initialization failed:', error);
  }
}

// Performance Comparison with animations
function initializePerformanceComparison() {
  const container = document.querySelector('#performanceSection .card__body');
  if (!container) {
    console.error('Performance container not found');
    return;
  }
  
  container.innerHTML = `
    <div class="workflow-section workflow-section--current">
      <h3>Current Workflow</h3>
      <div class="workflow-time workflow-time--current">${dashboardData.workflow.current.time}s</div>
      <p>${dashboardData.workflow.current.steps} steps</p>
      <ul class="workflow-steps" id="currentSteps">
        ${dashboardData.workflow.current.process.map((step, index) => `
          <li class="workflow-step" style="animation-delay: ${index * 0.1}s">${index + 1}. ${step}</li>
        `).join('')}
      </ul>
    </div>
    
    <div class="workflow-section workflow-section--proposed">
      <h3>Proposed Workflow</h3>
      <div class="workflow-time workflow-time--proposed">${dashboardData.workflow.proposed.time}s</div>
      <p>${dashboardData.workflow.proposed.steps} steps</p>
      <ul class="workflow-steps" id="proposedSteps">
        ${dashboardData.workflow.proposed.process.map((step, index) => `
          <li class="workflow-step" style="animation-delay: ${index * 0.1}s">${index + 1}. ${step}</li>
        `).join('')}
      </ul>
    </div>
  `;
  
  console.log('Performance comparison initialized');
}

// Competitive Analysis Chart
function initializeCompetitiveChart() {
  const ctx = document.getElementById('competitiveChart');
  if (!ctx) {
    console.error('Competitive chart canvas not found');
    return;
  }
  
  competitiveChart = new Chart(ctx.getContext('2d'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Market Position',
        data: dashboardData.competitive.companies.map(company => ({
          x: company.marketShare,
          y: company.satisfaction,
          company: company.name,
          position: company.position
        })),
        backgroundColor: function(context) {
          const company = context.raw.company;
          return company === 'Amazon' ? '#FF9900' : '#232F3E';
        },
        borderColor: function(context) {
          const company = context.raw.company;
          return company === 'Amazon' ? '#FF9900' : '#232F3E';
        },
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              return context[0].raw.company;
            },
            label: function(context) {
              return [
                `Market Share: ${context.parsed.x}%`,
                `Satisfaction: ${context.parsed.y}%`,
                `Position: #${context.raw.position}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Market Share (%)'
          },
          min: 0,
          max: 40
        },
        y: {
          title: {
            display: true,
            text: 'Customer Satisfaction (%)'
          },
          min: 50,
          max: 65
        }
      }
    }
  });
  
  console.log('Competitive chart initialized');
}

// Filters
function initializeFilters() {
  const timeframeSelect = document.getElementById('timeframeSelect');
  const regionSelect = document.getElementById('regionSelect');
  const metricSelect = document.getElementById('metricSelect');
  
  if (timeframeSelect) {
    timeframeSelect.addEventListener('change', updateFinancialChart);
  }
  
  if (regionSelect) {
    regionSelect.addEventListener('change', updateMapView);
  }
  
  if (metricSelect) {
    metricSelect.addEventListener('change', updateKPIHighlight);
  }
  
  console.log('Filters initialized');
}

function updateFinancialChart() {
  const timeframe = parseInt(document.getElementById('timeframeSelect').value);
  const data = dashboardData.financial.yearlyProgression.slice(0, timeframe);
  const labels = Array.from({length: timeframe}, (_, i) => `Year ${i + 1}`);
  
  if (roiChart) {
    roiChart.data.labels = labels;
    roiChart.data.datasets[0].data = data.map(val => val / 1000000);
    roiChart.data.datasets[1].data = Array(timeframe).fill(2);
    roiChart.update();
    console.log('Financial chart updated for timeframe:', timeframe);
  }
}

function updateMapView() {
  const region = document.getElementById('regionSelect').value;
  
  if (ukMap) {
    if (region === 'pilot') {
      ukMap.setView([52.5, -1.5], 7);
    } else {
      ukMap.setView([54.5, -2.5], 6);
    }
    console.log('Map view updated for region:', region);
  }
}

function updateKPIHighlight() {
  const metric = document.getElementById('metricSelect').value;
  const kpiCards = document.querySelectorAll('.kpi-card');
  
  kpiCards.forEach(card => card.classList.remove('highlighted'));
  
  let targetIndex = 0;
  switch(metric) {
    case 'roi': targetIndex = 2; break;
    case 'costSavings': targetIndex = 1; break;
    case 'timeReduction': targetIndex = 0; break;
  }
  
  if (kpiCards[targetIndex]) {
    kpiCards[targetIndex].classList.add('highlighted');
    console.log('KPI highlighted:', metric);
  }
}

// Export functionality
function initializeExport() {
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Export button clicked');
      window.print();
    });
    console.log('Export functionality initialized');
  }
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function animateValue(element, start, end, duration = 2000) {
  const startTimestamp = performance.now();
  const step = (timestamp) => {
    const elapsed = timestamp - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    const current = start + (end - start) * progress;
    element.textContent = Math.floor(current).toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

// Add highlighted class to CSS
const style = document.createElement('style');
style.textContent = `
  .kpi-card.highlighted {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(255, 153, 0, 0.3);
    border: 2px solid #FF9900;
  }
  
  .workflow-step {
    animation: slideIn 0.3s ease-out forwards;
    opacity: 0;
    transform: translateX(-20px);
  }
  
  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

// Responsive chart resize
window.addEventListener('resize', function() {
  setTimeout(() => {
    if (roiChart) roiChart.resize();
    if (competitiveChart) competitiveChart.resize();
    if (ukMap) ukMap.invalidateSize();
  }, 100);
});

// Performance monitoring
console.log('Amazon Delivery Dashboard loaded successfully');
console.log('Total investment:', formatCurrency(dashboardData.financial.investment));
console.log('Expected 5-year return:', formatCurrency(dashboardData.financial.fiveYearTotal));