import random
from datetime import datetime, timedelta, time
from datos.models import Registros, Usuarios, Vehiculos
import holidays

def generar_hora_aleatoria(hora_inicio, hora_fin):
    """Genera una hora aleatoria dentro del rango especificado."""
    inicio = datetime.combine(datetime.today(), hora_inicio)
    fin = datetime.combine(datetime.today(), hora_fin)
    delta = fin - inicio
    return inicio + timedelta(seconds=random.randint(0, int(delta.total_seconds())))

def insertar_registros(fecha_inicio='2025-05-18'):
    fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
    fecha_actual = datetime.now()

    usuarios = list(Usuarios.objects.all())
    vehiculos = list(Vehiculos.objects.all())

    if not usuarios or not vehiculos:
        print("No hay usuarios o vehículos registrados.")
        return

    # Aquí definimos IDs o alguna condición para excluir algunos usuarios/vehículos
    # Por ejemplo, excluimos usuarios con IDs 1 y 2 para simular faltas
    usuarios_excluidos = [1, 2]  # Modifica según tus IDs reales

    # Filtramos usuarios para que no incluyan los excluidos
    usuarios = [u for u in usuarios if u.id not in usuarios_excluidos]

    dias = (fecha_actual - fecha_inicio).days
    festivos_mx = holidays.Mexico(years=[2023, 2024, 2025])
    for dia in range(dias + 1):
        fecha_base = fecha_inicio + timedelta(days=dia)

        if fecha_base.weekday() == 7:
            continue

        registros_a_crear = []

        es_festivo = fecha_base.date() in festivos_mx
        limite_usuarios = 30 if es_festivo else 250

        usuarios_para_entrada = random.sample(usuarios, min(len(usuarios), limite_usuarios))

        entradas = {}
        for usuario in usuarios_para_entrada:
            vehiculos_usuario = Vehiculos.objects.filter(usuario=usuario)

            # Aquí también puedes excluir vehículos específicos si quieres
            # vehiculos_excluidos = [10, 20]
            # vehiculos_usuario = vehiculos_usuario.exclude(id__in=vehiculos_excluidos)

            if not vehiculos_usuario:
                continue

            vehiculo = random.choice(vehiculos_usuario)
            hora_entrada = generar_hora_aleatoria(time(6, 0), time(22, 0))

            fecha_hora_entrada = fecha_base.replace(
                hour=hora_entrada.hour,
                minute=hora_entrada.minute,
                second=hora_entrada.second,
                microsecond=random.randint(0, 999999)
            )

            registro_entrada = Registros(
                usuario=usuario,
                vehiculo=vehiculo,
                movimiento='entrada',
                fecha=fecha_hora_entrada
            )
            registros_a_crear.append(registro_entrada)
            entradas[usuario] = fecha_hora_entrada

        for usuario, hora_entrada in entradas.items():
            vehiculos_usuario = Vehiculos.objects.filter(usuario=usuario)
            if not vehiculos_usuario:
                continue

            vehiculo = random.choice(vehiculos_usuario)
            horas_despues = random.randint(4, 8)
            hora_salida = hora_entrada + timedelta(hours=horas_despues)

            hora_maxima_salida = fecha_base.replace(hour=23, minute=59, second=59)
            fecha_hora_salida = min(hora_salida, hora_maxima_salida)

            registro_salida = Registros(
                usuario=usuario,
                vehiculo=vehiculo,
                movimiento='salida',
                fecha=fecha_hora_salida
            )
            registros_a_crear.append(registro_salida)

        if registros_a_crear:
            Registros.objects.bulk_create(registros_a_crear)
            print(f"Registros creados para {fecha_base.date()} - Entradas: {len(entradas)}, Salidas: {len(registros_a_crear) - len(entradas)}")

    print("✅ Inserción finalizada con éxito.")

# Ejecutar la función
insertar_registros()
