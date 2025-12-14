// Theme management for Math Quest
// Light mode is default, dark mode is optional

(function() {
    function applyTheme() {
        // Check for saved preferences
        const isRetro = localStorage.getItem('math_quest_retro_mode') === 'true';
        // Light mode is default (true), only disable if explicitly set to false
        const isLight = localStorage.getItem('math_quest_light_mode') !== 'false';

        if (isRetro) {
            document.body.classList.add('retro-mode');
        }

        // Apply light mode by default
        if (isLight) {
            document.body.classList.add('light-mode');
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    // Apply theme when DOM is ready
    if (document.body) {
        applyTheme();
    } else {
        document.addEventListener('DOMContentLoaded', applyTheme);
    }

    // Export function to toggle retro mode
    window.toggleRetroMode = function(enabled) {
        document.body.classList.toggle('retro-mode', enabled);
        localStorage.setItem('math_quest_retro_mode', enabled);
    };

    // Export function to toggle light mode
    window.toggleLightMode = function(enabled) {
        document.body.classList.toggle('light-mode', enabled);
        document.documentElement.setAttribute('data-theme', enabled ? 'light' : 'dark');
        localStorage.setItem('math_quest_light_mode', enabled);
    };
})();
