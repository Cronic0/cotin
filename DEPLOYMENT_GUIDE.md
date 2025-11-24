# 🚀 Guía de Despliegue y Arquitectura - El Trébol

## 📋 Situación Actual vs. Necesidades

### ❌ Problema Actual
Tu app **actualmente** usa:
- **AsyncStorage**: Almacenamiento LOCAL en cada dispositivo
- **Sin sincronización**: Cambios del admin NO se reflejan en otros dispositivos
- **Sin base de datos**: Los datos se pierden al reinstalar
- **Sin estadísticas reales**: Cada dispositivo tiene sus propios datos

### ✅ Lo Que Necesitas
Para tu modelo de negocio (QR → Web + Admin Panel):
- **Base de datos centralizada**: Todos leen/escriben del mismo lugar
- **API Backend**: Servidor que gestiona los datos
- **Cambios en tiempo real**: Admin edita → Clientes ven cambios instantáneamente
- **Escalable**: Múltiples restaurantes en el mismo servidor

---

## 🏗️ Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────┐
│                   USUARIOS                          │
│  (Escanean QR → Acceden desde navegador móvil)     │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND WEB                            │
│  - React (Expo Web)                                 │
│  - Desplegado en Coolify/VPS                        │
│  - Accesible vía dominio: menu.eltrebol.com        │
└───────────────┬─────────────────────────────────────┘
                │
                │ HTTP Requests
                ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND API                             │
│  - Node.js + Express                                │
│  - REST API                                          │
│  - Autenticación (JWT)                              │
│  - WebSockets (cambios en tiempo real)             │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│              BASE DE DATOS                           │
│  - PostgreSQL (recomendado)                         │
│  - Tablas: products, schedules, analytics, users    │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Soluciones Técnicas

### Opción A: Firebase (🏆 RECOMENDADA para empezar)

**Ventajas:**
- ✅ Configuración rápida (1-2 horas)
- ✅ Base de datos en tiempo real incluida
- ✅ Autenticación integrada
- ✅ Hosting gratuito para empezar
- ✅ Escalable automáticamente
- ✅ Sin gestión de servidor

**Desventajas:**
- ⚠️ Costos crecen con uso
- ⚠️ Menos control sobre datos

**Stack:**
```
Frontend: React (Expo Web)
Backend: Firebase Functions (serverless)
Base de datos: Firestore (NoSQL en tiempo real)
Hosting: Firebase Hosting
Autenticación: Firebase Auth
```

**Costo estimado:** 
- Gratis hasta ~50k lecturas/día
- ~$25-50/mes para 1-5 restaurantes

---

### Opción B: Backend Propio (VPS)

**Ventajas:**
- ✅ Control total
- ✅ Costos predecibles (~$10-20/mes VPS)
- ✅ Base de datos SQL (mejor para reportes)
- ✅ Personalización total

**Desventajas:**
- ⚠️ Más tiempo desarrollo (1-2 semanas)
- ⚠️ Mantenimiento servidor
- ⚠️ Configuración más compleja

**Stack:**
```
Frontend: React (Expo Web) → Nginx
Backend: Node.js + Express → PM2
Base de datos: PostgreSQL
Servidor: Ubuntu VPS (Coolify)
Real-time: Socket.io o Polling
```

**Costo estimado:**
- VPS 4GB RAM: $10-20/mes
- Dominio: $12/año
- SSL: Gratis (Let's Encrypt)

---

## 📊 Comparación Detallada

| Aspecto | Firebase | Backend Propio (VPS) |
|---------|----------|---------------------|
| **Tiempo setup** | 2-4 horas | 1-2 semanas |
| **Costo inicial** | $0 | $0 (solo VPS $10/mes) |
| **Escalabilidad** | Automática | Manual |
| **Control datos** | Limitado | Total |
| **Complejidad** | Baja | Media-Alta |
| **Tiempo real** | Nativo | Necesitas Socket.io |
| **Mantenimiento** | Mínimo | Medio |
| **Multi-tenant** | Fácil | Manual |

---

## 🎯 Mi Recomendación

### Para TU Caso Específico:

**FASE 1: MVP (1-3 meses) → Firebase**
- Lanza rápido con Firebase
- Valida el modelo de negocio
- Consigue 3-5 clientes
- Costo: ~$0-50/mes

**FASE 2: Escalado (después) → VPS**
- Migra a backend propio cuando:
  - Tengas >10 restaurantes
  - Costos Firebase >$100/mes
  - Necesites features custom
- Costo: $20-50/mes (más predecible)

---

## 🔄 Migración Necesaria

### Cambios en tu App Actual:

#### 1. **AdminContext** (CRÍTICO)
```typescript
// ANTES (AsyncStorage - Local)
await AsyncStorage.setItem('@products', JSON.stringify(products));

// DESPUÉS (Firebase - Sincronizado)
await db.collection('products').doc(restaurantId).set(products);
```

#### 2. **Estructura de Datos**
```typescript
// Necesitas añadir:
interface Restaurant {
  id: string;
  name: string;
  products: Product[];
  schedule: Schedule;
  settings: {
    showRecommendations: boolean;
    // ...
  };
}
```

#### 3. **Cambios en Tiempo Real**
```typescript
// Firebase auto-sync
useEffect(() => {
  const unsubscribe = db
    .collection('products')
    .doc(restaurantId)
    .onSnapshot((doc) => {
      setProducts(doc.data());
    });
  return unsubscribe;
}, []);
```

---

## 📝 Plan de Implementación (Firebase - Rápido)

### Paso 1: Configuración Firebase (30 min)
```bash
# Instalar Firebase
npm install firebase

# Configurar en tu app
# Crear firebaseConfig.ts con credenciales
```

### Paso 2: Migrar AdminContext (2 horas)
- Reemplazar AsyncStorage por Firestore
- Añadir listeners en tiempo real
- Gestionar restaurantId

### Paso 3: Configurar Expo Web (1 hora)
```bash
# Ya está configurado en tu proyecto
npm run web
```

### Paso 4: Deploy Frontend (30 min)
```bash
# Firebase Hosting
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

### Paso 5: Generar QR (5 min)
- URL: https://eltrebol-app.web.app
- Generar QR → Imprimir en mesas

**TOTAL: ~4 horas de trabajo**

---

## 🗄️ Estructura Base de Datos (Firebase)

```
restaurants/
  └─ {restaurantId}/
      ├─ info/
      │   ├─ name: "El Trébol"
      │   ├─ email: "info@eltrebol.com"
      │   └─ address: "..."
      │
      ├─ products/
      │   └─ {productId}/
      │       ├─ title
      │       ├─ description
      │       ├─ price
      │       ├─ image
      │       └─ category
      │
      ├─ schedule/
      │   └─ {dayKey}/
      │       ├─ isOpen
      │       ├─ openTime
      │       └─ closeTime
      │
      ├─ settings/
      │   ├─ showRecommendations
      │   ├─ showOffMenu
      │   └─ showTunaWeek
      │
      └─ analytics/
          └─ favorites/
              └─ {productId}: count
```

---

## 💡 Consejos para VPS (Cuando escales)

### Coolify Setup
```bash
# 1. Instalar Coolify en Ubuntu
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 2. Crear proyecto Node.js
# 3. Añadir PostgreSQL database
# 4. Deploy desde GitHub
```

### Dockerfile necesario
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎨 URLs Finales

```
Producción:
- Menú Web: https://menu.eltrebol.com
- Admin Panel: https://menu.eltrebol.com/admin
- API: https://api.eltrebol.com

QR en mesas:
- Mesa 1: https://menu.eltrebol.com?table=1
- Mesa 2: https://menu.eltrebol.com?table=2
```

---

## ❓ FAQ

**Q: ¿Cuánto cuesta mantener esto?**
A: 
- Firebase (inicio): $0-25/mes
- VPS (escalado): $10-20/mes
- Dominio: $12/año

**Q: ¿Los clientes necesitan internet?**
A: Sí, es una web app. Puedes añadir PWA para funcionar offline.

**Q: ¿Puedo tener varios restaurantes?**
A: Sí, cada restaurante tiene su `restaurantId`. Mismo código, múltiples instancias.

**Q: ¿Cómo hago que los cambios sean instantáneos?**
A: Firebase: Automático. VPS: Socket.io o polling cada 5-10 segundos.

---

## ✅ Próximos Pasos

1. **Decide:** ¿Firebase (rápido) o VPS (control)?
2. **Creo rama:** `git checkout -b feature/firebase-integration`
3. **Migro código:** AdminContext → Firebase
4. **Pruebas locales:** Verificar sincronización
5. **Deploy:** Firebase Hosting o Coolify
6. **Generar QR:** Para pruebas en restaurante

---

**¿Empezamos con Firebase para validar rápido?** 🚀
