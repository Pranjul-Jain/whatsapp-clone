# whatsapp-clone

# Database Used

> *MONGODB*

> *REDDIS* (optional but necessary in production)

## React Frontend Setup

> change directory to frontend with command `cd frontend`

> now run `npm install` to install all the dependencies

> create *.env* file and set below environmental variables
>> 1. *VITE_SERVER_URL*
>> 2. *VITE_HOST*

> run `npm run build` to build your react application

> *all the build files will store in dist folder*

> Or you can ignore the above command and run `npm run dev` to start the developement server

## Django Backend Setup

> run `pip install -r requirements.txt` to install all the required modules and libraries necessary to run this project

> you can create superuser if you want with command `python manage.py createsuperuser` but its not necessary

> run `python manage.py makemigrations` to create a migration file for django models

> run `python manage.py migrate` to configure all your models

> create *.env* file and set below environmental variables

>> 1. *DJANGO_SECRET_KEY*
>> 2. *DATABASE_NAME*
>> 3. *DATABASE_HOST*
>> 4. *DATABASE_PORT*
>> 5. *DATABASE_PASSWORD*

## STEPS TO HOST REACT BUILD FOLDER WITH DJANGO

> run `python manage.py collectstatic` to copy all the static files in static folder of django backend

> cp `fontend/dist/index.html` file to `templates` folder 

> run `python manage.py runserver` to start asgi server

*-------------------------------------------------------------------------------------------------------*

# *Project Deployment files like DockerFile , .yaml file and nginx conf file will be updated soon*