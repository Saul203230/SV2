from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegistrosSerializer(serializers.ModelSerializer):
    usuario = serializers.SlugRelatedField(
        queryset=Usuarios.objects.all(),
        slug_field='nombre'
    )
    
    vehiculo = serializers.SlugRelatedField(
        queryset=Vehiculos.objects.all(),
        slug_field='placa'
    )

    rol = serializers.CharField(source="usuario.rol", read_only=True)

    class Meta:
        model = Registros
        fields = ('id','usuario','vehiculo','movimiento','fecha', 'rol')


class RolCountSerializer(serializers.Serializer):
    rol = serializers.CharField()
    count = serializers.IntegerField()
    


class OcupacionSerializer(serializers.ModelSerializer):
    rol = serializers.SerializerMethodField()

    class Meta:
        model = Registros
        fields = ['id', 'movimiento', 'fecha', 'usuario_id', 'vehiculo_id', 'rol']

    def get_rol(self, obj):
        # Verifica si el registro es una entrada y obtiene el rol del usuario
        if obj.movimiento == 'entrada':
            return obj.usuario.rol  # Suponiendo que en el modelo Registro hay un ForeignKey a Usuario
        return None  # Si el movimiento no es entrada, no retorna rol
    
class PromedioEstanciaSerializer(serializers.Serializer):
    intervalo = serializers.CharField()
    tiempo_estancia_promedio = serializers.FloatField()

#-----------------------------------------------Serializadores para el historial-------------------------------------------#
class VehiculoSerializer(serializers.ModelSerializer):
    usuario = serializers.SlugRelatedField(slug_field='nombre', queryset=Usuarios.objects.all())
    class Meta:
        model = Vehiculos
        fields = ['id','placa','modelo', 'color', 'tipo', 'usuario']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class RegistroSerializer(serializers.ModelSerializer):
    vehiculo = serializers.StringRelatedField()
    usuario = serializers.StringRelatedField()

    class Meta:
        model = Registros
        fields = '__all__'
#-----------------------------------------------Serializadores para el historial-------------------------------------------#

    # usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    # vehiculo = models.ForeignKey(Vehiculos, on_delete=models.CASCADE)
    # movimiento = models.CharField(max_length=30)
    # fecha = models.DateTimeField(auto_now_add=True)

class AutoSerializer(serializers.ModelSerializer):
    usuario = serializers.SlugRelatedField(
        queryset=Usuarios.objects.all(),
        slug_field='nombre'
        )
    class Meta:
        model = Vehiculos
        fields = ['placa', 'modelo', 'color', 'tipo', 'usuario']  # Agrega los campos que quieres enviar

class IncidenciaSerializer(serializers.ModelSerializer):
        class Meta:
            model = Incidencia
            fields = ['id', 'nombre_usuario', 'fecha', 'tipo', 'motivo']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.rol  # Incluye el rol en el token
        return token
    
class IncidenciaRespoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidencia
        fields = '__all__'  # Asegúrate que incluye 'respuesta'