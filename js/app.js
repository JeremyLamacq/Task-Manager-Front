const app = {

    /**
     * Point d'entrée de notre application.
     */
    init: function() {
        // on lance la gestion des tâches
        tasks.init();
    },

};

// Lancement de l'application
document.addEventListener('DOMContentLoaded', app.init);