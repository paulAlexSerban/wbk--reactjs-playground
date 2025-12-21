// Simple confetti animation for celebrations
const confetti = {
  fire: () => {
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        pointer-events: none;
        z-index: 9999;
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      
      document.body.appendChild(confettiPiece);
      
      setTimeout(() => {
        confettiPiece.remove();
      }, 4000);
    }
    
    // Add keyframes if not already present
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export default confetti;
