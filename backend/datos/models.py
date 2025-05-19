from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class Usuarios(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=10)
    rol = models.CharField(max_length=20, null=True, blank=True)
    matricula = models.CharField(max_length=9)

class Vehiculos(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    placa = models.CharField(max_length=10)
    modelo = models.CharField(max_length=50)
    color = models.CharField(max_length=30)
    tipo = models.CharField(max_length=30)
    estado = models.BooleanField(default=True)
    faltas = models.IntegerField(default=0)  # para contar días sin registro
    
class Registros(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    vehiculo = models.ForeignKey(Vehiculos, on_delete=models.CASCADE)
    movimiento = models.CharField(max_length=30)
    fecha = models.DateTimeField()


class Incidencia(models.Model):
    TIPOS_INCIDENCIA = [
        ('actividad_ilicita', 'Actividad ilícita'),
        ('falta_identificacion', 'Falta de identificación'),
        ('otro', 'Otro')
    ]

    nombre_usuario = models.CharField(max_length=100)  # Nombre de quien reporta la incidencia
    fecha = models.DateTimeField(auto_now_add=True)  # Fecha y hora en que se crea la incidencia
    tipo = models.CharField(max_length=50, choices=TIPOS_INCIDENCIA)  # Tipo de incidencia
    motivo = models.TextField()  # Descripción detallada de la incidencia
    respuesta = models.TextField(blank=True, null=True)  # <- NUEVO CAMPO

    def __str__(self):
        return f"Incidencia de {self.nombre_usuario} - {self.tipo}"   

# PRUEBA CON DJANGO WEBSOCKETS
class Mensaje(models.Model):
    texto = models.CharField(max_length=255)
    creado = models.DateTimeField(auto_now_add=True)

class CustomUser(AbstractUser):
    ROLES = (
        ('administrativo', 'Administrativo'),
        ('guardia', 'Guardia'),
    )
    rol = models.CharField(max_length=20, choices=ROLES)
