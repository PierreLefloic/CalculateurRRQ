Auteur du code : Pierre Lefloïc
Date de création : 2025-09-29
Date de dernière modification : 2025-09-29

Note pour la maintenance future :
- Le fichier MGA.csv doit être mis à jour à chaque année. Les années futures contenant des NaN doivent être remplacées par les vrais valeurs. Attention à ne pas modifier la structure du fichier.
- L'année courante par défaut doit être changée dans le code si nécessaire (ctl+f "tagAnnéeCourante")
- Les paramètres économiques par défaut peuvent être mis à jour dans le code si nécessaire (ctl+f "TagParamEco")
- Pour modifier le texte, il faut le changer ici ainsi que dans le fichier i18n.js (ne pas oublier fr/en)

Structure de la page : 
- index.html : structure HTML principale de la page
- style.css : styles CSS pour la mise en page et le design
- MGA.csv : fichier de données devant être mis à jour annuellement
- i18n.js : gestion de la traduction et du changement de langue
- animations.js : animations pour les sections déroulantes et autres interactions
- form-management.js : gestion des entrées de l'utilisateur, validation des entrées, activation/désactivation du bouton de simulation
- pension-calculator_V12.js : logique de calcul des prestations RRQ (tel que codé dans la version V12 de l'outil Excel original)
- pension-integration.js : intégration de la logique de calcul avec l'interface utilisateur et gestion des interactions en lien avec le calcul
- favicon-32x32.png : icône du site web (pour onglet du navigateur et favoris)
- logo_CFFP.png : logo affiché en haut de la page