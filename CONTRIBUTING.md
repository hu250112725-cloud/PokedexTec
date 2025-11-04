# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a PokedexTec! 

## 📋 Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU-USUARIO/PokedexTec.git
cd PokedexTec
```

### 2. Instalar Dependencias (Opcional)
```bash
npm install
```

### 3. Crear una Rama
```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 4. Hacer Cambios
- Escribe código limpio y bien comentado
- Sigue las convenciones de estilo del proyecto
- Asegúrate de que el código funcione correctamente

### 5. Probar Localmente
```bash
# Iniciar servidor local
python3 -m http.server 8000
# O
npm run dev

# Abrir http://localhost:8000
```

### 6. Commit y Push
```bash
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feature/nueva-funcionalidad
```

### 7. Crear Pull Request
- Ve a GitHub y crea un Pull Request
- Describe claramente qué cambios hiciste y por qué
- Espera revisión

## 📝 Convenciones de Código

### JavaScript
- Usar `const` y `let`, no `var`
- Funciones bien documentadas con comentarios
- Manejo apropiado de errores con try/catch
- Nombres descriptivos de variables y funciones

### CSS
- Usar variables CSS para colores y valores reutilizables
- Clases descriptivas con BEM cuando sea apropiado
- Mobile-first approach

### Commits
Usar convenciones de commit semántico:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

## 🐛 Reportar Bugs

Si encuentras un bug:
1. Verifica que no esté ya reportado en Issues
2. Crea un nuevo Issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Screenshots si es relevante
   - Navegador y versión

## 💡 Sugerir Mejoras

Para sugerir nuevas funcionalidades:
1. Abre un Issue con etiqueta "enhancement"
2. Explica el caso de uso
3. Proporciona ejemplos si es posible

## 🎯 Áreas donde Necesitamos Ayuda

- [ ] Tests automatizados (Jest, Testing Library)
- [ ] Mejoras de accesibilidad (ARIA, navegación por teclado)
- [ ] Optimización de performance
- [ ] Modo offline / PWA
- [ ] Internacionalización (i18n)
- [ ] Documentación adicional

## ❓ Preguntas

Si tienes preguntas, puedes:
- Abrir un Issue con la etiqueta "question"
- Revisar Issues existentes
- Consultar el README.md

---

¡Gracias por contribuir! 🙌
