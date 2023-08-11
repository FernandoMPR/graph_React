from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from .serializer import FacturacionSerializer
from django.views import View
from .models import FacturacionNomina
from .serializer import DetallesSerializer
from .models import DetallesFactura
from django.http import JsonResponse


# Create your views here.

class FacturacionView(viewsets.ModelViewSet):
    serializer_class = FacturacionSerializer
    queryset = FacturacionNomina.objects.all()


class DetallesView(viewsets.ModelViewSet):
    serializer_class = DetallesSerializer
    queryset = DetallesFactura.objects.all()    

class FacturacionNominaApi(View):
    def get(self, request, facturacion_id):
        detalles =get_object_or_404(FacturacionNomina, id=facturacion_id)

        response_data = {
            "fecha": detalles.fecha,
            "precio_mxn": str(detalles.precio_mxn),
            "categoria": detalles.get_categoria_display(),
        }

        return JsonResponse(response_data)
