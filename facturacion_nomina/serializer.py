from rest_framework import serializers
from .models import FacturacionNomina
from .models import DetallesFactura


class FacturacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacturacionNomina
        fields = ("id", "fecha", "precio_mxn", "categoria")

class DetallesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallesFactura
        fields = "__all__"         