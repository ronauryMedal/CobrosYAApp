# API Dashboard Structure - PagosYA

## Endpoint: GET /api/empleado/dashboard

### Headers requeridos:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### Respuesta esperada:

```json
{
  "success": true,
  "message": "Dashboard cargado exitosamente",
  "data": {
    "resumen": {
      "adelantosPendientes": 2,
      "montoTotalAdelantos": 150000,
      "montoDisponible": 50000,
      "proximoPago": 25000
    },
    "adelantosRecientes": [
      {
        "id": 1,
        "monto": 50000,
        "fecha": "2024-01-15",
        "estado": "aprobado",
        "descripcion": "Adelanto para gastos médicos"
      },
      {
        "id": 2,
        "monto": 30000,
        "fecha": "2024-01-10",
        "estado": "pendiente",
        "descripcion": "Adelanto para reparación de vehículo"
      },
      {
        "id": 3,
        "monto": 25000,
        "fecha": "2024-01-05",
        "estado": "rechazado",
        "descripcion": "Adelanto para estudios"
      }
    ],
    "ultimosPagos": [
      {
        "id": 1,
        "monto": 15000,
        "fecha": "2024-01-20",
        "tipo": "descuento",
        "descripcion": "Descuento mensual adelanto #1"
      },
      {
        "id": 2,
        "monto": 12000,
        "fecha": "2024-01-15",
        "tipo": "pago",
        "descripcion": "Pago adelanto #2"
      },
      {
        "id": 3,
        "monto": 8000,
        "fecha": "2024-01-10",
        "tipo": "descuento",
        "descripcion": "Descuento mensual adelanto #3"
      }
    ]
  }
}
```

### Estructura de datos:

#### Resumen:
- `adelantosPendientes`: Número de adelantos en estado pendiente
- `montoTotalAdelantos`: Suma total de todos los adelantos del empleado
- `montoDisponible`: Monto disponible para nuevos adelantos
- `proximoPago`: Monto del próximo pago/descuento

#### Adelantos Recientes:
- `id`: ID único del adelanto
- `monto`: Monto del adelanto
- `fecha`: Fecha de solicitud (formato: YYYY-MM-DD)
- `estado`: Estado del adelanto ("aprobado", "pendiente", "rechazado")
- `descripcion`: Descripción del adelanto

#### Últimos Pagos:
- `id`: ID único del pago
- `monto`: Monto del pago/descuento
- `fecha`: Fecha del pago (formato: YYYY-MM-DD)
- `tipo`: Tipo de pago ("pago", "descuento")
- `descripcion`: Descripción del pago

### Estados de respuesta:

#### Éxito (200):
```json
{
  "success": true,
  "message": "Dashboard cargado exitosamente",
  "data": { ... }
}
```

#### Error de autenticación (401):
```json
{
  "success": false,
  "message": "No autorizado"
}
```

#### Error del servidor (500):
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

### Notas:
- Todos los montos deben ser números enteros (sin decimales)
- Las fechas deben estar en formato ISO (YYYY-MM-DD)
- Los arrays pueden estar vacíos si no hay datos
- El endpoint requiere autenticación con token Bearer
