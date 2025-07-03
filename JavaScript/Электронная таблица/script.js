const STORAGE_KEY = 'spreadsheetData';
let spreadsheetData = [];
let rows = 1;
let cols = 1;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-col-btn').addEventListener('click', addColumn);
    document.getElementById('remove-col-btn').addEventListener('click', removeColumn);
    document.getElementById('add-row-btn').addEventListener('click', addRow);
    document.getElementById('remove-row-btn').addEventListener('click', removeRow);
    
    loadFromStorage();
    renderTable();
    setupEventListeners();
});

function loadFromStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        spreadsheetData = parsedData.data || [];
        rows = parsedData.rows || 1;
        cols = parsedData.cols || 1;
    } else {
        spreadsheetData = [];
        rows = 1;
        cols = 1;
    }
}

function saveToStorage() {
    const dataToSave = {
        data: spreadsheetData,
        rows: rows,
        cols: cols
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

function renderTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            const cellId = `${i}-${j}`;
            cell.setAttribute('data-id', cellId);
            
            const cellData = spreadsheetData.find(item => item.id === cellId);
            cell.textContent = cellData ? cellData.value : '';
            
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    document.querySelectorAll('#table-body td').forEach(cell => {
        cell.addEventListener('dblclick', function() {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = this.textContent;
            
            this.innerHTML = '';
            this.appendChild(input);
            input.focus();
            
            input.addEventListener('blur', function() {
                const td = this.parentNode;
                const newValue = this.value;
                const cellId = td.getAttribute('data-id');
                
                td.textContent = newValue;
                
                const existingDataIndex = spreadsheetData.findIndex(item => item.id === cellId);
                if (newValue.trim() !== '') {
                    if (existingDataIndex !== -1) {
                        spreadsheetData[existingDataIndex].value = newValue;
                    } else {
                        spreadsheetData.push({ id: cellId, value: newValue });
                    }
                } else if (existingDataIndex !== -1) {
                    spreadsheetData.splice(existingDataIndex, 1);
                }
                
                saveToStorage();
            });
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    });
}

function addColumn() {
    cols++;
    renderTable();
    saveToStorage();
}

function removeColumn() {
    if (cols <= 1) return;
    
    const hasDataInLastColumn = spreadsheetData.some(item => {
        const col = parseInt(item.id.split('-')[1]);
        return col === cols - 1;
    });
    
    if (hasDataInLastColumn) {
        if (!confirm('В удаляемом столбце есть данные. Удалить его?')) {
            return;
        }
    }

    spreadsheetData = spreadsheetData.filter(item => {
        const col = parseInt(item.id.split('-')[1]);
        return col !== cols - 1;
    });
    
    cols--;
    renderTable();
    saveToStorage();
}

function addRow() {
    rows++;
    renderTable();
    saveToStorage();
}

function removeRow() {
    if (rows <= 1) return;

    const hasDataInLastRow = spreadsheetData.some(item => {
        const row = parseInt(item.id.split('-')[0]);
        return row === rows - 1;
    });
    
    if (hasDataInLastRow) {
        if (!confirm('В удаляемой строке есть данные. Удалить её?')) {
            return;
        }
    }

    spreadsheetData = spreadsheetData.filter(item => {
        const row = parseInt(item.id.split('-')[0]);
        return row !== rows - 1;
    });
    
    rows--;
    renderTable();
    saveToStorage();
}