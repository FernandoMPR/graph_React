from django.shortcuts import render
from rest_framework import viewsets
from .serializer import FacturacionSerializer
from .models import FacturacionNomina
from .serializer import DetallesSerializer
from .models import DetallesFactura


# Create your views here.

class FacturacionView(viewsets.ModelViewSet):
    serializer_class = FacturacionSerializer
    queryset = FacturacionNomina.objects.all()


class DetallesView(viewsets.ModelViewSet):
    serializer_class = DetallesSerializer
    queryset = DetallesFactura.objects.all()    

