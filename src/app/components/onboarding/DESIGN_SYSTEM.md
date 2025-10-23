# Sistema de Diseño - Onboarding

## Paleta de Colores

### Colores Primarios
- `--primary-50` a `--primary-900`: Escala de azules profesionales
- `--primary-500`: Color principal (#0ea5e9)
- `--primary-600`: Color principal oscuro (#0284c7)

### Colores Secundarios
- `--secondary-50` a `--secondary-900`: Escala de grises neutros
- `--secondary-50`: Texto claro (#f8fafc)
- `--secondary-900`: Fondo oscuro (#0f172a)

### Colores de Acento
- `--accent-50` a `--accent-900`: Escala de púrpuras
- `--accent-500`: Color de acento (#d946ef)

### Colores de Éxito
- `--success-50` a `--success-900`: Escala de verdes
- `--success-500`: Verde de éxito (#22c55e)

## Tipografía

### Fuentes
- **Títulos**: 'SF Pro Display' (fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif)
- **Texto**: 'SF Pro Text' (fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif)

### Escalas
- **Título principal**: 2rem (32px), font-weight: 700
- **Descripción**: 1rem (16px), font-weight: 400
- **Botones**: 1rem (16px), font-weight: 600

## Espaciado

### Variables de Espaciado
- `--space-xs`: 0.25rem (4px)
- `--space-sm`: 0.5rem (8px)
- `--space-md`: 1rem (16px)
- `--space-lg`: 1.5rem (24px)
- `--space-xl`: 2rem (32px)
- `--space-2xl`: 3rem (48px)
- `--space-3xl`: 4rem (64px)

## Sombras

### Sistema de Sombras
- `--shadow-sm`: Sombra pequeña
- `--shadow-md`: Sombra media
- `--shadow-lg`: Sombra grande
- `--shadow-xl`: Sombra extra grande
- `--shadow-2xl`: Sombra máxima

## Radios de Borde

### Sistema de Radios
- `--radius-sm`: 0.375rem (6px)
- `--radius-md`: 0.5rem (8px)
- `--radius-lg`: 0.75rem (12px)
- `--radius-xl`: 1rem (16px)
- `--radius-2xl`: 1.5rem (24px)
- `--radius-full`: 9999px (completamente redondo)

## Efectos Visuales

### Gradientes
- **Fondo principal**: Gradiente de azul a púrpura
- **Botones**: Gradiente de azul a púrpura
- **Imágenes**: Gradientes temáticos por slide

### Animaciones
- **Transiciones**: cubic-bezier(0.4, 0, 0.2, 1) para suavidad
- **Hover**: Escala y elevación sutil
- **Focus**: Outline para accesibilidad

## Responsividad

### Breakpoints
- **Móvil pequeño**: max-width: 360px
- **Móvil**: max-width: 480px
- **Tablet**: max-width: 768px (implícito)

### Adaptaciones
- Reducción de tamaños en pantallas pequeñas
- Ajuste de espaciado
- Optimización de tipografía

## Accesibilidad

### Estados de Focus
- Outline visible en todos los elementos interactivos
- Contraste adecuado en todos los colores
- Transiciones suaves para evitar mareos

### Navegación
- Puntos de paginación clickeables
- Botones con estados claros
- Indicadores visuales de progreso

## Personalización

Para cambiar los colores principales, modifica las variables CSS en la raíz del archivo:

```scss
:root {
  --primary-500: #tu-color-principal;
  --accent-500: #tu-color-accento;
  // ... otras variables
}
```

## Uso

El sistema está diseñado para ser:
- **Consistente**: Mismas variables en toda la aplicación
- **Escalable**: Fácil de mantener y extender
- **Accesible**: Cumple estándares de accesibilidad
- **Moderno**: Utiliza las mejores prácticas de diseño actual
