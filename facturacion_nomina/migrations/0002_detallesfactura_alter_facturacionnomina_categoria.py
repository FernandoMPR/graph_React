# Generated by Django 4.2.4 on 2023-08-10 21:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facturacion_nomina', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DetallesFactura',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rfc', models.TextField(max_length=100)),
                ('razon_social', models.TextField(max_length=100)),
                ('facturas', models.CharField(max_length=10)),
                ('pdd', models.DecimalField(decimal_places=2, max_digits=10)),
                ('pue', models.DecimalField(decimal_places=2, max_digits=10)),
                ('nomina', models.CharField(max_length=10)),
                ('all', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.AlterField(
            model_name='facturacionnomina',
            name='categoria',
            field=models.CharField(blank=True, choices=[('PDD', 'PDD'), ('PUE', 'PUE')], max_length=3),
        ),
    ]
