from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Vehiculos, Registros

@shared_task
def actualizar_faltas_diarias():
    # Fecha de "ayer" (el día que termina)
    hoy = timezone.now().date()
    ayer = hoy - timedelta(days=1)

    vehiculos_activos = Vehiculos.objects.filter(estado=1)

    for vehiculo in vehiculos_activos:
        # Buscar registros para ese vehículo en el día de ayer
        hubo_registro = Registros.objects.filter(
            vehiculo_id=vehiculo.id,
            fecha__date=ayer
        ).exists()

        if not hubo_registro:
            # No hubo movimiento ayer → sumar una falta
            vehiculo.faltas = (vehiculo.faltas or 0) + 1
            
            # Si faltas alcanzan 30, cambiar estado a 0
            if vehiculo.faltas >= 30:
                vehiculo.estado = 0
            
            vehiculo.save()
