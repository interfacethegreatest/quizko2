# Generated by Django 5.0.1 on 2024-02-13 16:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("item2", "0004_quiz"),
    ]

    operations = [
        migrations.AddField(
            model_name="quiz",
            name="status",
            field=models.CharField(
                choices=[
                    ("ready", "Ready to use"),
                    ("testing", "Needs testing"),
                    ("draft", "Draft"),
                ],
                default="draft",
                max_length=20,
            ),
        ),
    ]
