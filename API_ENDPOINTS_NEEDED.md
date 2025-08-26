# Endpoints Necesarios para PagosYA Mobile App

## Endpoints Actualmente Implementados

### ✅ Autenticación
- `POST /api/login` - Login de empleado
- `POST /api/logout` - Logout de empleado

### ✅ Dashboard
- `GET /api/empleado/dashboard` - Datos del dashboard

### ✅ Adelantos
- `GET /api/empleado/adelantos` - Lista de adelantos del empleado

## Endpoints que Necesitan Implementarse

### 🔴 Historial de Adelantos
```
GET /api/empleado/historial-adelantos
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Historial de adelantos obtenido exitosamente",
  "data": [
    {
      "id": 1,
      "descripcion": "Adelanto para gastos médicos",
      "monto": 50000,
      "fecha": "2024-01-15",
      "estado": "aprobado",
      "meses": 6,
      "montoMensual": 8500,
      "interes": 7,
      "montoTotal": 53500,
      "observacion": "Emergencia médica familiar"
    }
  ]
}
```

### 🔴 Historial de Pagos
```
GET /api/empleado/historial-pagos
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Historial de pagos obtenido exitosamente",
  "data": [
    {
      "id": 1,
      "descripcion": "Pago parcial - Gastos médicos",
      "monto": 8500,
      "fecha": "2024-02-15",
      "tipo": "pago",
      "adelantoId": 1
    },
    {
      "id": 2,
      "descripcion": "Descuento nómina - Gastos médicos",
      "monto": 8500,
      "fecha": "2024-02-01",
      "tipo": "descuento",
      "adelantoId": 1
    }
  ]
}
```

### 🔴 Crear Adelanto
```
POST /api/empleado/adelantos
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "descripcion": "Adelanto para gastos médicos",
  "monto": 50000,
  "meses": 6,
  "observacion": "Emergencia médica familiar"
}
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Adelanto creado exitosamente",
  "data": {
    "id": 1,
    "descripcion": "Adelanto para gastos médicos",
    "monto": 50000,
    "fecha": "2024-01-15",
    "estado": "pendiente",
    "meses": 6,
    "montoMensual": 8500,
    "interes": 7,
    "montoTotal": 53500,
    "observacion": "Emergencia médica familiar"
  }
}
```

### 🔴 Obtener Perfil
```
GET /api/empleado/perfil
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@empresa.com",
    "telefono": "809-123-4567",
    "empresa": {
      "id": 1,
      "nombre": "Empresa ABC"
    }
  }
}
```

## Notas Importantes

1. **Autenticación**: Todos los endpoints requieren el header `Authorization: Bearer {token}`
2. **Formato de Fechas**: Usar formato ISO 8601 (YYYY-MM-DD)
3. **Montos**: Los montos se manejan en centavos (multiplicar por 100 para pesos)
4. **Estados de Adelantos**: `pendiente`, `aprobado`, `rechazado`
5. **Tipos de Pago**: `pago`, `descuento`

## Implementación Prioritaria

1. **Alta Prioridad**: `/api/empleado/historial-adelantos`
2. **Alta Prioridad**: `/api/empleado/historial-pagos`
3. **Media Prioridad**: `/api/empleado/adelantos` (POST)
4. **Baja Prioridad**: `/api/empleado/perfil`
