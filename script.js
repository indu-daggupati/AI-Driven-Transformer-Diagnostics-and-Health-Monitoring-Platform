// AI-Driven Transformer Diagnostics Application
// Global Variables
let currentUser = null;
let transformers = [];
let notifications = [];
let fraChart = null;

// Sample transformer data
const sampleTransformers = [
    {
        id: 'T001',
        name: 'Main Power Transformer',
        location: 'Substation A',
        voltage: '220kV',
        status: 'healthy',
        lastTest: '2024-01-15',
        temperature: 65,
        load: 85
    },
    {
        id: 'T002',
        name: 'Distribution Transformer',
        location: 'Substation B',
        voltage: '33kV',
        status: 'warning',
        lastTest: '2024-01-10',
        temperature: 78,
        load: 92
    },
    {
        id: 'T003',
        name: 'Step-up Transformer',
        location: 'Power Plant',
        voltage: '400kV',
        status: 'fault',
        lastTest: '2024-01-08',
        temperature: 85,
        load: 95
    },
    {
        id: 'T004',
        name: 'Auxiliary Transformer',
        location: 'Substation C',
        voltage: '11kV',
        status: 'healthy',
        lastTest: '2024-01-12',
        temperature: 62,
        load: 70
    },
    {
        id: 'T005',
        name: 'Generator Transformer',
        location: 'Power Plant',
        voltage: '500kV',
        status: 'warning',
        lastTest: '2024-01-09',
        temperature: 75,
        load: 88
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLoginPage();
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.closest('.nav-btn').dataset.page;
            navigateToPage(page);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // File upload
    setupFileUpload();

    // Analysis
    const runAnalysisBtn = document.getElementById('runAnalysis');
    if (runAnalysisBtn) {
        runAnalysisBtn.addEventListener('click', runAIAnalysis);
    }

    // Notifications
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotifications);
    }

    const closeNotifications = document.getElementById('closeNotifications');
    if (closeNotifications) {
        closeNotifications.addEventListener('click', () => {
            document.getElementById('notificationPanel').classList.remove('active');
        });
    }

    // Reports
    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }

    // Refresh dashboard
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }

    // Simulate data feed
    const simulateFeedBtn = document.getElementById('simulateFeed');
    if (simulateFeedBtn) {
        simulateFeedBtn.addEventListener('click', simulateDataFeed);
    }

    // Chart controls
    setupChartControls();
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (in real app, this would be server-side)
    if (username && password) {
        currentUser = {
            username: username,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
        showAlert('success', 'Login Successful', `Welcome back, ${username}!`);
    } else {
        showAlert('error', 'Login Failed', 'Please enter valid credentials.');
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginPage();
    showAlert('success', 'Logged Out', 'You have been successfully logged out.');
}

function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('mainApp').classList.remove('active');
}

function showMainApp() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('mainApp').classList.add('active');
    if (currentUser) {
        document.getElementById('userDisplay').textContent = currentUser.username;
    }
    updateDashboard();
}

function navigateToPage(page) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Show page
    document.querySelectorAll('.content-page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}Page`).classList.add('active');

    // Page-specific actions
    if (page === 'visualization') {
        initializeChart();
    }
}

function loadSampleData() {
    transformers = [...sampleTransformers];
    updateTransformerSelects();
    generateSampleNotifications();
}

function updateDashboard() {
    const stats = calculateStats();
    document.getElementById('healthyCount').textContent = stats.healthy;
    document.getElementById('warningCount').textContent = stats.warning;
    document.getElementById('faultCount').textContent = stats.fault;
    document.getElementById('totalCount').textContent = stats.total;

    renderTransformerList();
}

function calculateStats() {
    const stats = {
        healthy: 0,
        warning: 0,
        fault: 0,
        total: transformers.length
    };

    transformers.forEach(t => {
        stats[t.status]++;
    });

    return stats;
}

function renderTransformerList() {
    const container = document.getElementById('transformerList');
    container.innerHTML = '';

    transformers.forEach(transformer => {
        const card = createTransformerCard(transformer);
        container.appendChild(card);
    });
}

function createTransformerCard(transformer) {
    const card = document.createElement('div');
    card.className = `transformer-card ${transformer.status}`;
    card.innerHTML = `
        <div class="transformer-header">
            <div class="transformer-id">${transformer.id}</div>
            <div class="status-badge ${transformer.status}">${transformer.status}</div>
        </div>
        <h4>${transformer.name}</h4>
        <div class="transformer-info">
            <div><strong>Location:</strong> ${transformer.location}</div>
            <div><strong>Voltage:</strong> ${transformer.voltage}</div>
            <div><strong>Temperature:</strong> ${transformer.temperature}°C</div>
            <div><strong>Load:</strong> ${transformer.load}%</div>
            <div><strong>Last Test:</strong> ${transformer.lastTest}</div>
        </div>
    `;

    card.addEventListener('click', () => {
        showTransformerDetails(transformer);
    });

    return card;
}

function showTransformerDetails(transformer) {
    showAlert('info', `Transformer ${transformer.id}`, `
        <strong>${transformer.name}</strong><br>
        Location: ${transformer.location}<br>
        Status: ${transformer.status.toUpperCase()}<br>
        Voltage: ${transformer.voltage}<br>
        Temperature: ${transformer.temperature}°C<br>
        Load: ${transformer.load}%<br>
        Last Test: ${transformer.lastTest}
    `);
}

function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const processBtn = document.getElementById('processFiles');

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        processFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        processFiles(files);
    }

    function processFiles(files) {
        fileList.innerHTML = '';
        Array.from(files).forEach(file => {
            const fileItem = createFileItem(file);
            fileList.appendChild(fileItem);
        });
        processBtn.disabled = files.length === 0;
    }

    function createFileItem(file) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>
            </div>
            <button class="remove-file" onclick="this.parentElement.remove()">×</button>
        `;
        return item;
    }

    if (processBtn) {
        processBtn.addEventListener('click', () => {
            showAlert('success', 'Files Processed', 'FRA files have been successfully processed and data extracted.');
            setTimeout(() => {
                addNotification('info', 'Data Processing Complete', 'New FRA data available for analysis');
            }, 1000);
        });
    }
}

function runAIAnalysis() {
    const selectedTransformer = document.getElementById('transformerSelect').value;
    if (!selectedTransformer) {
        showAlert('warning', 'No Selection', 'Please select a transformer for analysis.');
        return;
    }

    // Simulate AI analysis
    showAlert('info', 'Analysis Running', 'AI analysis in progress...');
    
    setTimeout(() => {
        displayAnalysisResults(selectedTransformer);
        showAlert('success', 'Analysis Complete', 'AI analysis has been completed successfully.');
    }, 3000);
}

function displayAnalysisResults(transformerId) {
    const transformer = transformers.find(t => t.id === transformerId);
    if (!transformer) return;

    // Simulate analysis results based on status
    let faultType, severity, recommendations;

    switch (transformer.status) {
        case 'fault':
            faultType = 'Winding Deformation Detected';
            severity = 'severe';
            recommendations = 'Immediate shutdown recommended. Schedule detailed inspection and repair.';
            break;
        case 'warning':
            faultType = 'Insulation Degradation';
            severity = 'moderate';
            recommendations = 'Monitor closely. Schedule maintenance within 30 days.';
            break;
        default:
            faultType = 'No significant faults detected';
            severity = 'minor';
            recommendations = 'Continue normal operation. Next scheduled maintenance in 6 months.';
    }

    document.getElementById('faultClassification').innerHTML = `
        <div class="classification-result">
            <h4>${faultType}</h4>
            <p>Analysis confidence: 94.2%</p>
            <p>Based on FRA frequency response patterns and historical data comparison.</p>
        </div>
    `;

    document.getElementById('severityAssessment').innerHTML = `
        <div class="severity-result">
            <span class="severity-level severity-${severity}">${severity.toUpperCase()}</span>
            <p>Risk assessment based on current operating conditions and fault progression models.</p>
        </div>
    `;

    document.getElementById('recommendations').innerHTML = `
        <div class="recommendations-result">
            <p>${recommendations}</p>
            <ul>
                <li>Monitor temperature and load patterns</li>
                <li>Schedule follow-up FRA testing</li>
                <li>Review maintenance history</li>
            </ul>
        </div>
    `;

    if (transformer.status === 'fault') {
        addNotification('error', 'Critical Fault Detected', `Transformer ${transformerId} requires immediate attention`);
    }
}

function initializeChart() {
    const ctx = document.getElementById('fraChart');
    if (!ctx || fraChart) return;

    fraChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    },
                    type: 'logarithmic'
                },
                y: {
                    title: {
                        display: true,
                        text: 'Magnitude (dB)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Frequency Response Analysis (FRA)'
                },
                legend: {
                    display: true
                }
            }
        }
    });
}

function setupChartControls() {
    const transformerSelect = document.getElementById('chartTransformerSelect');
    const showHealthy = document.getElementById('showHealthy');
    const showCurrent = document.getElementById('showCurrent');
    const highlightAnomalies = document.getElementById('highlightAnomalies');

    if (transformerSelect) {
        transformerSelect.addEventListener('change', updateChart);
    }

    [showHealthy, showCurrent, highlightAnomalies].forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', updateChart);
        }
    });
}

function updateChart() {
    if (!fraChart) return;

    const selectedTransformer = document.getElementById('chartTransformerSelect').value;
    if (!selectedTransformer) {
        fraChart.data.datasets = [];
        fraChart.update();
        return;
    }

    // Generate sample FRA data
    const frequencies = [];
    const healthyData = [];
    const currentData = [];

    for (let i = 1; i <= 1000; i *= 1.1) {
        frequencies.push(i.toFixed(1));
        // Simulate healthy response
        const healthyMag = -20 * Math.log10(i/100) + Math.random() * 2;
        healthyData.push(healthyMag);
        
        // Simulate current response with potential anomalies
        let currentMag = healthyMag;
        const transformer = transformers.find(t => t.id === selectedTransformer);
        if (transformer && transformer.status !== 'healthy') {
            // Add anomalies for faulty transformers
            if (i > 100 && i < 500) {
                currentMag += Math.sin(i/50) * 5;
            }
        }
        currentData.push(currentMag + Math.random() * 1);
    }

    fraChart.data.labels = frequencies;
    fraChart.data.datasets = [];

    if (document.getElementById('showHealthy').checked) {
        fraChart.data.datasets.push({
            label: 'Healthy Response',
            data: healthyData,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            fill: false
        });
    }

    if (document.getElementById('showCurrent').checked) {
        fraChart.data.datasets.push({
            label: 'Current Response',
            data: currentData,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: false
        });
    }

    fraChart.update();

    // Update chart summary
    const transformer = transformers.find(t => t.id === selectedTransformer);
    if (transformer) {
        document.getElementById('chartSummary').innerHTML = `
            <p><strong>Transformer:</strong> ${transformer.name}</p>
            <p><strong>Status:</strong> ${transformer.status.toUpperCase()}</p>
            <p><strong>Analysis:</strong> ${transformer.status === 'healthy' ? 'Normal frequency response patterns detected.' : 'Anomalies detected in frequency response.'}</p>
        `;
    }
}

function updateTransformerSelects() {
    const selects = [
        'transformerSelect',
        'chartTransformerSelect',
        'reportTransformer'
    ];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Transformer</option>';
            transformers.forEach(transformer => {
                const option = document.createElement('option');
                option.value = transformer.id;
                option.textContent = `${transformer.id} - ${transformer.name}`;
                select.appendChild(option);
            });
        }
    });
}

function generateReport() {
    const transformerId = document.getElementById('reportTransformer').value;
    const reportType = document.getElementById('reportType').value;
    const reportFormat = document.getElementById('reportFormat').value;

    if (!transformerId) {
        showAlert('warning', 'No Selection', 'Please select a transformer for the report.');
        return;
    }

    const transformer = transformers.find(t => t.id === transformerId);
    if (!transformer) return;

    showAlert('info', 'Generating Report', 'Report generation in progress...');

    setTimeout(() => {
        if (reportFormat === 'pdf') {
            generatePDFReport(transformer, reportType);
        } else {
            generateExcelReport(transformer, reportType);
        }
    }, 2000);
}

function generatePDFReport(transformer, reportType) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add content to PDF
    doc.setFontSize(20);
    doc.text('Transformer Diagnostic Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportType}`, 20, 50);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Transformer ID: ${transformer.id}`, 20, 80);
    doc.text(`Name: ${transformer.name}`, 20, 90);
    doc.text(`Location: ${transformer.location}`, 20, 100);
    doc.text(`Status: ${transformer.status.toUpperCase()}`, 20, 110);
    doc.text(`Voltage Rating: ${transformer.voltage}`, 20, 120);
    doc.text(`Current Temperature: ${transformer.temperature}°C`, 20, 130);
    doc.text(`Load: ${transformer.load}%`, 20, 140);
    doc.text(`Last Test Date: ${transformer.lastTest}`, 20, 150);

    // Save the PDF
    doc.save(`${transformer.id}_diagnostic_report.pdf`);
    
    showAlert('success', 'Report Generated', 'PDF report has been downloaded successfully.');
    addReportToHistory(transformer, reportType, 'PDF');
}

function generateExcelReport(transformer, reportType) {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ['Transformer Diagnostic Report'],
        [''],
        ['Report Type', reportType],
        ['Generated', new Date().toLocaleDateString()],
        [''],
        ['Transformer Details'],
        ['ID', transformer.id],
        ['Name', transformer.name],
        ['Location', transformer.location],
        ['Status', transformer.status.toUpperCase()],
        ['Voltage Rating', transformer.voltage],
        ['Temperature', `${transformer.temperature}°C`],
        ['Load', `${transformer.load}%`],
        ['Last Test', transformer.lastTest]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${transformer.id}_diagnostic_report.xlsx`);
    
    showAlert('success', 'Report Generated', 'Excel report has been downloaded successfully.');
    addReportToHistory(transformer, reportType, 'Excel');
}

function addReportToHistory(transformer, reportType, format) {
    const reportHistory = document.getElementById('reportHistory');
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    reportItem.innerHTML = `
        <div class="report-info">
            <h4>${transformer.id} - ${reportType} Report</h4>
            <div class="report-meta">
                Generated: ${new Date().toLocaleDateString()} | Format: ${format}
            </div>
        </div>
        <button class="btn btn-outline btn-sm">Download</button>
    `;
    
    if (reportHistory.querySelector('p')) {
        reportHistory.innerHTML = '';
    }
    reportHistory.insertBefore(reportItem, reportHistory.firstChild);
}

function simulateDataFeed() {
    const feedStatus = document.getElementById('feedStatus');
    const feedLog = document.querySelector('.log-content');
    
    // Simulate connecting to data feed
    feedStatus.innerHTML = '<span class="status-dot online"></span><span>Online</span>';
    
    // Add log entries
    const logEntries = [
        'Data feed connection established',
        'Receiving FRA data from Transformer T001',
        'Data validation completed',
        'New measurement data processed',
        'Alert: Temperature spike detected on T003'
    ];
    
    feedLog.innerHTML = '';
    logEntries.forEach((entry, index) => {
        setTimeout(() => {
            const logEntry = document.createElement('p');
            logEntry.textContent = `${new Date().toLocaleTimeString()}: ${entry}`;
            feedLog.appendChild(logEntry);
        }, index * 1000);
    });

    setTimeout(() => {
        addNotification('info', 'Data Feed Active', 'Automatic data collection is now active');
    }, 2000);
}

function generateSampleNotifications() {
    const sampleNotifications = [
        {
            type: 'error',
            title: 'Critical Alert',
            message: 'Transformer T003 showing severe winding deformation',
            time: new Date(Date.now() - 30 * 60000).toLocaleTimeString()
        },
        {
            type: 'warning',
            title: 'Temperature Warning',
            message: 'Transformer T002 temperature above normal range',
            time: new Date(Date.now() - 60 * 60000).toLocaleTimeString()
        },
        {
            type: 'info',
            title: 'Maintenance Reminder',
            message: 'Scheduled maintenance due for Transformer T001',
            time: new Date(Date.now() - 120 * 60000).toLocaleTimeString()
        }
    ];

    notifications = [...sampleNotifications];
    updateNotificationDisplay();
}

function addNotification(type, title, message) {
    const notification = {
        type,
        title,
        message,
        time: new Date().toLocaleTimeString()
    };
    
    notifications.unshift(notification);
    updateNotificationDisplay();
    
    // Show alert for critical notifications
    if (type === 'error') {
        showAlert('error', title, message);
    }
}

function updateNotificationDisplay() {
    const notificationList = document.getElementById('notificationList');
    const notificationCount = document.getElementById('notificationCount');
    
    if (notificationCount) {
        notificationCount.textContent = notifications.length;
    }
    
    if (notificationList) {
        notificationList.innerHTML = '';
        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.type}`;
            item.innerHTML = `
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            `;
            notificationList.appendChild(item);
        });
    }
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('active');
}

function refreshDashboard() {
    showAlert('info', 'Refreshing', 'Dashboard data is being updated...');
    
    // Simulate data refresh
    setTimeout(() => {
        // Randomly update some transformer statuses
        transformers.forEach(transformer => {
            if (Math.random() < 0.1) { // 10% chance of status change
                const statuses = ['healthy', 'warning', 'fault'];
                transformer.status = statuses[Math.floor(Math.random() * statuses.length)];
                transformer.temperature += (Math.random() - 0.5) * 10;
                transformer.load += (Math.random() - 0.5) * 20;
                transformer.temperature = Math.max(50, Math.min(100, transformer.temperature));
                transformer.load = Math.max(0, Math.min(100, transformer.load));
            }
        });
        
        updateDashboard();
        showAlert('success', 'Dashboard Updated', 'All data has been refreshed successfully.');
    }, 1500);
}

function showAlert(type, title, message) {
    const modal = document.getElementById('alertModal');
    const alertTitle = document.getElementById('alertTitle');
    const alertIcon = document.getElementById('alertIcon');
    const alertMessage = document.getElementById('alertMessage');
    
    alertTitle.textContent = title;
    alertMessage.innerHTML = message;
    
    // Set icon based on type
    alertIcon.className = `alert-icon ${type}`;
    switch (type) {
        case 'success':
            alertIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            break;
        case 'warning':
            alertIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'error':
            alertIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            break;
        default:
            alertIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
    }
    
    modal.classList.add('active');
}

function closeAlert() {
    document.getElementById('alertModal').classList.remove('active');
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString();
}

// Auto-refresh dashboard every 30 seconds
setInterval(() => {
    if (currentUser && document.getElementById('dashboardPage').classList.contains('active')) {
        refreshDashboard();
    }
}, 30000);