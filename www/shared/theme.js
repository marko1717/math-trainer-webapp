// Theme management for Math Quest
// Applies retro mode and light mode if saved in localStorage

(function() {
    // Check for saved retro mode preference
    const isRetro = localStorage.getItem('math_quest_retro_mode') === 'true';
    const isLight = localStorage.getItem('math_quest_light_mode') === 'true';

    if (isRetro) {
        document.body.classList.add('retro-mode');
    }

    if (isLight) {
        document.body.classList.add('light-mode');
    }

    // Export function to toggle retro mode
    window.toggleRetroMode = function(enabled) {
        document.body.classList.toggle('retro-mode', enabled);
        localStorage.setItem('math_quest_retro_mode', enabled);
    };

    // Export function to toggle light mode
    window.toggleLightMode = function(enabled) {
        document.body.classList.toggle('light-mode', enabled);
        localStorage.setItem('math_quest_light_mode', enabled);
    };
})();
