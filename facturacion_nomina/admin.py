from django.contrib import admin
from .models import  FacturacionNomina
from .models import DetallesFactura

# Register your models here.
admin.site.register(FacturacionNomina)
admin.site.register(DetallesFactura)