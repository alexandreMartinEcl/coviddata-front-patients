# Covid-data, section gestion de lits
Cette app a pour but de permettre la gestion des lits de réanimation de certaines unités dans un hôpital.

Produite sous les demandes d'Adrien Parrot, .

Par Alexandre Martin et l'équipe de magic-lemp.com


## Installation

### Première mise en place
Téléchargez dans un dossier les deux Git repository correspondant au Frontend et Backend

`git clone https://git.magic-lemp.com/thomas/coviddata-front-patients.git`

`git clone https://git.magic-lemp.com/thomas/covid-data-patients-local.git`

#### Frontend

Entrez dans le dossier frontend et installez les librairies. (Installez npm si besoin)

```
cd coviddata-front-patients
npm install
```

Lancez la construction static de l'application web, et copiez-collez le dossier `build` dans le 
backend à `server/web/templates/beds_frontend/`

```
npm run build
cp -r build ../covid-data-patients-local/server/web/templates/beds_frontend/
```

#### Backend
Depuis, le dossier original, allez dans le dossier du _Backend_ et créez votre _virtual environment_

```
cd covid-data-patients-local
virtualenv venv -p python3.6
```

Activez le nouvel _virtual environment_ et installez les modules python

```
source ./venv/bin/activate
pip install -r server/requirements.txt
```

Puis lancez les migrations pour la création de la base de données et ajoutez le superuser

```
cd server
python manage.py makemigrations
python manage.py sqlmigrate beds 001
python manage.py sqlmigrate maj 001
python manage.py sqlmigrate patients 001
python manage.py sqlmigrate users 001
python manage.py sqlmigrate web 001
python manage.py migrate
python manage.py createsuperuser
```

Copiez collez et renommer le fichier _.env.example_ et ajustez les paramètres.

Pour enfin lancer le serveur:
`python manage.py runserver`


#### Base de données

Pour le bon déroulement de l'application, il sera nécessaire d'entrer quelques objets de base dans les tables.
Une fois le serveur lancé, allez à l'url `.../admin`, connectez vous comme superuser.
- Entrez au moins un Hopital (_Hospitals_)
- Créez ensuite les Services de réanimation (_ReanimationService_) de cet hôpital
- Puis créez des Unités (_Units_) que vous lierez aux services de réanimation
- Enfin, ajoutez les lits (_Beds_), que vous assignerez aux Unités

### Mise à jour

#### Frontend

Entrez dans le dossier frontend, mettez à jour la branche, installez les librairies, générez le build et copiez collez le où nécessaire

```
cd coviddata-front-patients
git pull
npm install
npm run build
cp -r build ../covid-data-patients-local/server/web/templates/beds_frontend/
```
#### Backend

Entrez dans le dossier backend, mettez à jour la branche, installez les librairies après activation du _virtual environment_

```
cd covid-data-patients-local
git pull
source ./venv/bin/activate
pip install -r server/requirements.txt
```

Et enfin relancez les migrations avant de lancer le serveur

```
cd server
python manage.py makemigrations
python manage.py sqlmigrate beds 00x
python manage.py sqlmigrate maj 00x
python manage.py sqlmigrate patients 00x
python manage.py sqlmigrate users 00x
python manage.py sqlmigrate web 00x
```

`python manage.py runserver`

## Notes pour le développeur

Pour lancer un mode sans authentification, dé-commentarisez cette ligne du fichier settings, au niveau du paramètre `REST_FRAMEWORK`
```
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'users.AuthMiddleware.FreeAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
```
Et modifiez le fichier `server/users/AuthMiddleware` afin que le middleware renvoie un User présent dans la base

Aussi, pour bypasser la vérification par un serveur central, on peut modifier _users/auth.py_ afin que la fonction qui s'y trouve retourne un user existant.