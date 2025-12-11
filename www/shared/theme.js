// Theme management for Math Quest
// Applies retro mode if saved in localStorage

(function() {
    // Check for saved retro mode preference
    const isRetro = localStorage.getItem('math_quest_retro_mode') === 'true';

    if (isRetro) {
        document.body.classList.add('retro-mode');
    }

    // Export function to toggle retro mode
    window.toggleRetroMode = function(enabled) {
        document.body.classList.toggle('retro-mode', enabled);
        localStorage.setItem('math_quest_retro_mode', enabled);
    };
})();
