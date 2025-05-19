from celery import shared_task
import time

@shared_task
def tarea_prueba():
    time.sleep(5)  # Simula una tarea que tarda 5 segundos
    return "¡Tarea completada con éxito!"
