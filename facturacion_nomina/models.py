from django.db import models

class FacturacionNomina(models.Model):
    CATEGORIA_CHOICES = [
        ("PDD", "PDD"),
        ("PUE", "PUE"),
    ]
    
    fecha = models.DateField() 
    precio_mxn = models.DecimalField(max_digits=10, decimal_places=2) 
    categoria = models.CharField(max_length=3, choices=CATEGORIA_CHOICES, blank=True)
    
    def __str__(self):
        return f"{self.fecha} - {self.get_categoria_display()}"

class DetallesFactura(models.Model):
    rfc = models.TextField(max_length=100)
    razon_social = models.TextField(max_length=100)
    facturas = models.CharField(max_length=10)
    pdd = models.IntegerField()
    pue = models.IntegerField()
    nomina = models.IntegerField()
    all = models.IntegerField(blank=True)

    def save(self, *args, **kwargs):
        self.all = self.nomina + self.pdd + self.pue
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.rfc} - {self.all}"
    


    
    