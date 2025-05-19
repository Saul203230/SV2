# mi_proyecto/celery.py

import os
from celery import Celery

# Establece el módulo de configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dashboard.settings')

app = Celery('dashboard')

# Carga configuración desde Django settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover para que encuentre tus tareas automáticamente
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
