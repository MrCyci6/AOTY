document.addEventListener("DOMContentLoaded", function() {
    const background = document.querySelector('.background');

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 50 + 10;
        bubble.style.width = `${size%4}px`;
        bubble.style.height = `${size%4}px`;
        bubble.style.left = `${Math.random() * 100}vw`;        
        
        bubble.style.animationDuration = `${Math.random() * 30 + 15}s`;
        background.appendChild(bubble);

        bubble.addEventListener('animationend', () => {
            bubble.remove();
        });
    }

    setInterval(createBubble, 200);
});