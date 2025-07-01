
let map, placemark;

ymaps.ready(initMap);

function initMap() {
    map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
    });
    
    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            map.balloon.open(coords, {
                contentBody:
                    '<p>Координаты : ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                    ].join(', ') 
            });
        }
        else {
            map.balloon.close();
        }
    });

}


document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = '';
    resultMessage.className = '';
    
    let isValid = true;
    const errors = [];
    
    if (!document.getElementById('fullname').value.trim()) {
        isValid = false;
        errors.push('Не заполнено поле ФИО');
    }
    
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
        isValid = false;
        errors.push('Не заполнено поле Телефон');
    } else if (!/^\d+$/.test(phone)) {
        isValid = false;
        errors.push('Телефон должен содержать только цифры');
    }
    
    const email = document.getElementById('email').value.trim();
    if (email && !email.includes('@')) {
        isValid = false;
        errors.push('Email должен содержать символ @');
    }
    
    if (!document.getElementById('coordinates').value) {
        isValid = false;
        errors.push('Не отмечен адрес доставки на карте');
    }
    
    if (isValid) {
        resultMessage.textContent = 'Заказ оформлен!';
        resultMessage.className = 'success';
    } else {
        resultMessage.textContent = errors.join(', ');
        resultMessage.className = 'error';
    }
});