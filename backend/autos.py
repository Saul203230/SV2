import os
import django
import random
import string

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dashboard.settings')  # Ajusta según el nombre real de tu proyecto
django.setup()

from datos.models import Vehiculos, Usuarios  # Cambia 'tu_app' por el nombre correcto

# Valores en español
colores = ['rojo', 'azul', 'verde', 'blanco', 'negro', 'gris', 'amarillo', 'morado']
tipos = ['automóvil', 'motocicleta', 'camioneta', 'pickup', 'sedán', 'SUV']
modelos = ['Nissan Versa', 'Honda Civic', 'Chevrolet Aveo', 'Toyota Corolla', 'Kia Río', 'Mazda 3']

# Generar una placa tipo ABC-1234
def generar_placa():
    letras = ''.join(random.choices(string.ascii_uppercase, k=3))
    numeros = ''.join(random.choices(string.digits, k=4))
    return f"{letras}-{numeros}"

## Supón que ya hiciste django.setup() y las importaciones necesarias...

usuarios = list(Usuarios.objects.all())

if not usuarios:
    print("⚠️ No hay usuarios en la base de datos.")
else:
    for i, usuario in enumerate(usuarios):
        Vehiculos.objects.create(
            usuario=usuario,
            placa=generar_placa(),
            modelo=random.choice(modelos),
            color=random.choice(colores),
            tipo=random.choice(tipos),
            estado= 1
        )

    print(f"Se agregaron autos correctamente")

