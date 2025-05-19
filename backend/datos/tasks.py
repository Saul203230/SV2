from celery import shared_task
import time

@shared_task
def tarea_prueba():
    time.sleep(5)
    resultado = "¡Tarea completada con éxito!"
    print(resultado)  # Esto sí aparecerá en la consola del worker
    return resultado

