# Guía: Cómo Subir a GitHub y Deployar en Vercel

## Paso 1: Crear Cuenta GitHub (si no tienes)

1. Ve a https://github.com
2. Click en "Sign up"
3. Completa el formulario (email, contraseña, usuario)
4. Verifica tu email
5. Listo

## Paso 2: Crear Nuevo Repositorio en GitHub

1. Inicia sesión en https://github.com
2. Click en el ➕ arriba a la derecha → "New repository"
3. Llena los datos:
   - **Repository name:** `asistia-app`
   - **Description:** `Frontend app para AsistIA - Gestión de clínicas estéticas`
   - **Public** (para que Vercel pueda acceder)
   - NO marques "Initialize this repository..."
4. Click en "Create repository"
5. En la siguiente pantalla, copia los comandos que aparecen

## Paso 3: Subir Código a GitHub desde tu Computadora

Abre terminal/command prompt y ejecuta estos comandos:

```bash
# Navega a la carpeta del proyecto
cd /ruta/a/asistia-app

# Inicia repositorio git (si no lo está)
git init

# Añade todos los archivos
git add .

# Haz el primer commit
git commit -m "Inicial commit: FASE 1-10 completadas"

# Conecta con GitHub (reemplaza con TU usuario)
git remote add origin https://github.com/TU_USUARIO/asistia-app.git

# Sube el código
git branch -M main
git push -u origin main
```

## Paso 4: Crear Cuenta Vercel (si no tienes)

1. Ve a https://vercel.com
2. Click en "Sign Up"
3. Click en "Continue with GitHub"
4. Autoriza Vercel para acceder a tu GitHub
5. Listo

## Paso 5: Importar Proyecto a Vercel

1. Inicia sesión en https://vercel.com
2. Click en "Add New..." → "Project"
3. Click en "Import Git Repository"
4. Busca y selecciona `asistia-app`
5. En opciones:
   - **Framework:** Vite
   - **Build command:** `npm run build` (debería ser automático)
   - **Output directory:** `dist` (debería ser automático)
6. Click en "Deploy"
7. **¡Listo!** Tu app está deployada 🎉

## Resultado

- **URL de tu app:** `asistia-app-xxxx.vercel.app` (Vercel te la mostrará)
- **Acceso:** Compartible con otros
- **Auto-deploy:** Cada vez que hagas push a GitHub, Vercel redeploya automáticamente

## Próximos Pasos (para cambios)

```bash
# Cuando hagas cambios locales
git add .
git commit -m "Descripción del cambio"
git push

# Vercel se actualiza automáticamente en 1-2 minutos
```

## ¿Problemas?

### "Permission denied"
- Genera SSH key en GitHub Settings → Developer settings → Personal access tokens
- O usa HTTPS en lugar de SSH

### "Build failed"
- Revisa los logs en Vercel dashboard
- Asegúrate que `npm install` funciona localmente

### "App muestra error blanco"
- Abre console (F12) para ver errores
- Revisa logs en Vercel

## Resumen Rápido

```
GitHub = Guardar código
Vercel = Publicar app en internet
Cada push a GitHub → Vercel redeploya automáticamente
```

¡Eso es todo! 🚀
