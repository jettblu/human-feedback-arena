### Package Installations

If you don't have a virtual environment, set one up using the following command.

```bash
pip install pipenv
```

Next, install required packages.

```bash
pipenv install -r requirements.txt
```

### App Migrations

Make migrations with the following command.

```bash
python manage.py makemigrations human_prefs
```

Apply migrations with the following command.

```bash
python manage.py migrate human_prefs
```

# Asynchronous Task Execution Setup

This project **can** celery and redis for asynchronous task execution. This allows long running training calls to execute on the backend without delaying user requests. Follow the steps below for setup on MacOs.

```bash
brew install redis
```

```bash
brew services start redis
```

This command needs to execute before the django server begins running.

```bash
celery -A backend worker --loglevel=INFO
```

Note that the current implementation does not use celery do to issues when running pytorch backward in a celery task.

# Database

Your local deployment can use the local sqlite database option. However, your production environment will need a database run on a dedicated host. We are using postgres hosted by supabase. Regardless of the specific database provider you choose, be sure to update your _.env_ and _private_gae_env.yaml_ with your database acess variables.

# Deployment

You've set up your local environment. Now it's time to deploy! There are multiple hosting options, but we decided to use the google standard app engine. Steps are included below.

After installing the gcloud comman line tool, use the following commands.

```bash
gcloud init
gcloud app create
gcloud services enable sqladmin
```

Now, ensure that your are in the backend directory (same level as this file) and run the following:

```bash
gcloud app deploy
```

### Admin View

A super user can review API routes and make changes to the database through the convenient 'admin' view. To create a 'super user' run the following command.

```bash
python3 manage.py createsuperuser
```

After launching the server as described below you can view the admin page by visiting `localhost::8000//admin`.

### Launch Server

You can launch your django backend using the command below.

```bash
python manage.py runserver
```
