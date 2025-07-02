const ctx = document.getElementById('cpuChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Загруженность процессора (%)',
            data: [],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            tension: 0.1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});


let totalRequests = 0;
let errorRequests = 0;
let lastValidValue = 0;


function updateStats() {
    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('errorRequests').textContent = errorRequests;
    document.getElementById('errorPercentage').textContent = 
        totalRequests > 0 ? Math.round((errorRequests / totalRequests) * 100) : 0;
}

function addDataToChart(value) {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(value);
    
    const maxPoints = 20;
    if (chart.data.labels.length > maxPoints) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    
    chart.update();
}

function updateCpuUsage() {
    fetch('http://exercise.develop.maximaster.ru/service/cpu/', {
        headers: {'Authorization': 'Basic ' + btoa('cli:12344321')}
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка сети');
        return response.text();
    })
    .then(data => {
        totalRequests++;
        const cpuUsage = parseInt(data);
        
        if (isNaN(cpuUsage)) {
            throw new Error('Некорректные данные');
        }
        
        if (cpuUsage === 0) {
            errorRequests++;
            updateStats();
            addDataToChart(lastValidValue);
        } else {
            lastValidValue = cpuUsage;
            updateStats();
            addDataToChart(cpuUsage);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        totalRequests++;
        errorRequests++;
        updateStats();
        addDataToChart(lastValidValue);
    });
}


updateCpuUsage();
setInterval(updateCpuUsage, 5000);