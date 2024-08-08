const app = {

    /**
     * Point d'entrée de notre application.
     */
    init: function() {
        tasks.init();
    },

};

// Lancement de l'application
document.addEventListener('DOMContentLoaded', app.init);