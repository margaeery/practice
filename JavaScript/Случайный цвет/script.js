document.addEventListener('DOMContentLoaded', function() {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const randomColorBtn = document.getElementById('randomColor');
    const square = document.getElementById('square');
    

    updateSquare();
    

    widthInput.addEventListener('input', updateSquare);
    heightInput.addEventListener('input', updateSquare);
    

    randomColorBtn.addEventListener('click', setRandomColor);
    

    widthInput.addEventListener('focus', function() {
        this.select();
    });
    
    heightInput.addEventListener('focus', function() {
        this.select();
    });
    
    function updateSquare() {
        const width = widthInput.value || 100;
        const height = heightInput.value || 100;
        
        square.style.width = `${width}px`;
        square.style.height = `${height}px`;
    }
    function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}
    function setRandomColor() {
        const randomColor = getRandomColor() ;
        square.style.backgroundColor = randomColor;
    }
});