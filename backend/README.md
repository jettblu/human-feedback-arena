### Package Installations

```bash
pip install -r requirements.txt
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
