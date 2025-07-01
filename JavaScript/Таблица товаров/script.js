document.addEventListener('DOMContentLoaded', function() {
    const updateBtn = document.getElementById('updateBtn');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const errorMessage = document.getElementById('errorMessage');
    const tableContainer = document.getElementById('tableContainer');
    
    let productsData = [];

    fetch('http://exercise.develop.maximaster.ru/service/products/', {
        headers: {'Authorization': 'Basic ' + btoa('cli:12344321')}
    })
    .then(response => response.json())
    .then(data => {
        productsData = data;
        validateAndFilter();
    })
    .catch(error => {
        console.error('Ошибка загрузки:', error);
        showError('Не удалось загрузить данные');
    });

    function validateAndFilter() {
        errorMessage.textContent = '';
        const minPrice = Number(minPriceInput.value) || 0;
        const maxPrice = Number(maxPriceInput.value) || 0;

        if (minPrice < 0 || maxPrice < 0) {
            showError('Цена не может быть отрицательной');
            return;
        }
        if (minPrice > maxPrice && maxPrice !== 0) {
            showError('Минимальная цена не может быть больше максимальной');
            return;
        }

        const filteredData = productsData.filter(product => 
            (minPrice === 0 || product.price >= minPrice) && 
            (maxPrice === 0 || product.price <= maxPrice)
        );
        
        displayProducts(filteredData);
    }

    function displayProducts(products) {
        if (!products || !products.length) {
            tableContainer.innerHTML = '<div class="no-data">Нет данных, попадающих под условие фильтра</div>';
            return;
        }

        const tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Сумма</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map((product, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${product.name}</td>
                            <td>${product.quantity}</td>
                            <td>${product.price}</td>
                            <td>${product.price * product.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
    }

    function showError(message) {
        errorMessage.textContent = message;
        tableContainer.innerHTML = '';
    }

    updateBtn.addEventListener('click', validateAndFilter);
});