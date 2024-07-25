const tasks = {
  /**
   * Initialisation : on va charger la liste des tâches
   * et afficher la liste.
   */
  init: async function () {
    console.log("init OK");

    // Avant d'afficher dynamiquement les tâches,
    // on vide le conteneur
    document.querySelector(".tasklist").textContent = "";

    // récupération de la liste des tâches
    const dataTasksList = await tasks.getTasksFromApi();
    // console.table(dataTasksList);
    // console.log(dataTasksList);

    // affichage des tâches
    // on boucle sur le tableau pour afficher chaque tâche
    dataTasksList.forEach((id, task) => {
      // console.log(`ID: ${id}, Task: ${task}`);
      tasks.insertTaskInDom(task, id);
    });

    tasks.createDialog();

    tasks.creatTaskInDom();
  },

  /*************************************************************************************
   * Gestion de l'API
   *************************************************************************************/

  /**
   * Retourne la liste des tâches depuis l'API.
   */
  getTasksFromApi: async function () {
    // Requête vers la liste des tâches
    const response = await fetch("http://localhost:8080/api/home");

    // On a la réponse, mais on veut avoir les données au format JSON
    const tasksList = await response.json();

    // console.table(tasksList);

    return tasksList;
  },

  /*************************************************************************************
   * Gestion du DOM
   *************************************************************************************/

  /**
   * Insert une tâche dans le DOM.
   * @param {Task} task
   */
  insertTaskInDom: function (id, task) {
    // <li>
    const taskElement = document.createElement("li");
    // <li data-id="0">
    taskElement.dataset.id = id +1;

    // <p>sortir les poubelles</p>
    const taskTitleElement = document.createElement("p");
    taskTitleElement.textContent = task;

    // <div class="delete"></div>
    const deleteElement = document.createElement("div");
    deleteElement.classList.add("delete");
    // on place l'écouteur sur cette même div
    deleteElement.addEventListener("click", tasks.handleDeleteTask);

    // <div class="edit"></div>
    const editElement = document.createElement("div");
    editElement.classList.add("edit");
    // on place l'écouteur sur cette même div
    editElement.addEventListener("click", tasks.handleEditTask);

    // On a créé les éléments, on les ajoute au LI
    taskElement.append(taskTitleElement, deleteElement, editElement);

    // On ajoute le LI qui représente un tâche à la liste des tâches
    const taskListElement = document.querySelector(".tasklist");
    taskListElement.append(taskElement);
  },

  /**
   * Créer une tâche dans le DOM
   */
  createDialog: function () {
    const parentNewTaskBtn = document.querySelector(".create-task-container");
    const newTaskBtn = parentNewTaskBtn.lastElementChild;
    newTaskBtn.addEventListener("click", tasks.handleCreateDialog);
  },

  creatTaskInDom: function () {
    const dialogDiv = document.querySelector(".modal-dialog form");
    dialogDiv.addEventListener("submit", tasks.handleCreateTask);
  },

  /*************************************************************************************
   * Gestion des événements
   *************************************************************************************/

  /**
   * Suppression d'une tâche lors du clic sur un bouton de suppression.
   * @param {Event} event
   */
  handleDeleteTask: async function (event) {
    // On récupère la bonne valeur de notre div dans une const
    const deletElement = event.currentTarget;

    // On récupère le parent de notre div dans une const
    // const liElement = deletElement.parentNode;
    // Deuxième méthode qui permet de récupérer le li le plus proche
    const liElement = deletElement.closest("li");

    // On récupère le data-id de notre li
    const liId = liElement.dataset.id;

    // on remove notre li ainsi que le contenu de la BDD grâce au data-id
    liElement.remove();

    if (liElement.remove) {
      const response = await fetch("http://127.0.0.1:8000/api/remove/" + liId, {
        method: "DELETE",
      });
    }
  },

  handleEditTask: function (event) {
    // on récupère notre classe pour ouvrir le volet
    const classDialog = document.querySelector(".modal-dialog");
    classDialog.classList.add("show");

    // on récupère le contenu de notre "p" puis on l'affiche en valeur de notre input
    const dataId = event.currentTarget.closest("li").firstChild.firstChild;
    const inputText = document.querySelector("#task-title");
    inputText.value = dataId.data;

    // on récupère et modifie l'id de l'input id
    const inputId = document.querySelector("#task-id");
    inputId.id = event.currentTarget.closest("li").dataset.id;

    // on récupère le contenu de notre titre et on change son contenu
    const classDialogTitle = classDialog.lastElementChild.firstElementChild;
    classDialogTitle.textContent = "modification tâche";

    // on récupère le contenu de notre bouton et on change son contenu
    const classDialogButton = classDialog.lastElementChild.lastElementChild;
    classDialogButton.textContent = "modifier";
    // console.log(inputId);
  },

  /**
   * ajout d'une tâche lors du clic sur un bouton de nouvelle tâche.
   */
  handleCreateDialog: function (id) {
    const classDialog = document.querySelector(".modal-dialog");
    // console.log(classDialog);
    classDialog.classList.add("show");
  },

  handleCreateTask: async function (event) {
    // on stop l'envoi du formulaire
    event.preventDefault();

    // on récupère notre class de formulaire pour pouvoir enlever la class
    const classDialog = document.querySelector(".modal-dialog");
    classDialog.classList.remove("show");

    // on récupère la valeur de notre champ pour pouvoir l'envoyer
    inputDialog = document.querySelector("#task-title").value;
    console.log(inputDialog);

    // on récupère le button pour la comparaison
    const classDialogButton =
      classDialog.lastElementChild.lastElementChild.textContent;
    // console.log(event.currentTarget[0].id);

    // on récupère notre id par rapport au evant
    const taskDataId = event.currentTarget[0].id;

    const taskData = {
      description: inputDialog,
      id: event.currentTarget[0].id,
    };

    if (classDialogButton === "modifier") {
      {
        // ci-dessous le fetch vers l'url
        const datas = await fetch(
          "http://localhost:8080/api/update/" + taskDataId,
          {
            // la méthode http -> PUT
            method: "PUT",
            // le header pour dire qu'on veut envoyer des données au format json
            headers: {
              "Content-Type": "application/json",
            },
            // corps de la requête au format json
            body: JSON.stringify(taskData),
          }
        );
        // on stock le résultat de la requête dans une variable datajson
        // const datajson = datas.json();
        // return datajson;
      }
      tasks.init();
    } else {
      const response = await fetch(
        "http://localhost:8080/api/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(taskData),
        },
        console.log(taskData)
      );
      if (response.ok) {
        tasks.init();
      } else {
        console.error("Failed to create task");
      }
    }
  },
};
