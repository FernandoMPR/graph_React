from django.urls import path, include
from rest_framework import routers
from facturacion_nomina import views 
from rest_framework.documentation import include_docs_urls

router = routers.DefaultRouter()
router.register(r"FacturacionNomina", views.FacturacionView, "FacturacionNomina")
router.register(r"DetallesFactura", views.DetallesView,"DetallesFactura")

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title="FacturacionNomina API")),
]