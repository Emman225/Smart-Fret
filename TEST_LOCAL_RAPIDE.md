# 🚀 Guide de Test Rapide - Configuration Locale

## 📍 Configuration Actuelle

- **Frontend React** : `http://localhost:3000` (Vite)
- **Backend Laravel** : `http://127.0.0.1:8001`
- **Proxy Vite** : `/api` → `http://127.0.0.1:8001`

---

## ✅ Étape 1: Backend Laravel (10 minutes)

### 1.1 Créer ProxyController.php

Sur votre projet Laravel, créez le fichier :
```
app/Http/Controllers/Api/ProxyController.php
```

Copiez le contenu depuis : [Backend_ProxyController.php](file:///d:/NEW%20DOC%20MANU%2011102025/SMART%20Fret/APP/smart-fret---tableau-de-bord/Backend_ProxyController.php)

### 1.2 Ajouter la Route

Dans `routes/api.php`, ajoutez :

```php
use App\Http\Controllers\Api\ProxyController;

Route::post('/proxy/login', [ProxyController::class, 'proxyLogin'])
    ->middleware('throttle:10,1');
```

### 1.3 Démarrer Laravel (Si Pas Déjà Fait)

```bash
php artisan serve --host=127.0.0.1 --port=8001
```

### 1.4 Vérifier les Routes

```bash
php artisan route:list | grep proxy
```

**Résultat attendu :**
```
POST    api/proxy/login .... ProxyController@proxyLogin
```

---

## 🧪 Étape 2: Test Backend Seul (2 minutes)

### Test 1: Vérifier que l'API répond

```bash
curl http://127.0.0.1:8001/api/type-dossiers
```

**Réponse attendue :** JSON avec la liste des types de dossiers

### Test 2: Tester le Proxy Login

```bash
curl -X POST http://127.0.0.1:8001/api/proxy/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"LoginUser\":\"A\",\"PwdUser\":\"123\"}"
```

**✅ Réponse attendue (succès) :**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "...",
    "token_type": "Bearer"
  }
}
```

**❌ Réponse possible (erreur 404) :**
```json
{
  "message": "Page not found"
}
```
→ La route n'est pas enregistrée. Vérifiez l'étape 1.2

**❌ Réponse possible (erreur 500) :**
```json
{
  "success": false,
  "message": "Erreur lors de la connexion"
}
```
→ Vérifiez les logs Laravel : `tail -f storage/logs/laravel.log`

---

## 🌐 Étape 3: Test Frontend + Backend (3 minutes)

### 3.1 Vérifier que le Frontend Tourne

Le serveur Vite devrait déjà être en marche. Sinon :
```bash
npm run dev
```

### 3.2 Ouvrir l'Application

Navigateur : `http://localhost:3000`

### 3.3 Essayer de Se Connecter

1. Entrez vos identifiants (ex: `A` / `123`)
2. Cliquez sur "Se connecter"

### 3.4 Vérifier la Console du Navigateur (F12)

**✅ Ce que vous DEVEZ voir :**
```
Proxying request: POST /api/proxy/login -> http://127.0.0.1:8001
Envoi de la requête de connexion à: /api/proxy/login
Réponse du serveur: {success: true, data: {...}}
Utilisateur connecté avec succès
```

**❌ Ce que vous NE devez PLUS voir :**
```
Réponse brute du serveur: <!DOCTYPE html>... LWS Protection DDoS
Erreur: La protection DDoS du serveur bloque les requêtes
```

---

## 🎯 Checklist Rapide

- [ ] Laravel tourne sur `http://127.0.0.1:8001`
- [ ] `ProxyController.php` créé dans `app/Http/Controllers/Api/`
- [ ] Route ajoutée dans `routes/api.php`
- [ ] `php artisan route:list | grep proxy` montre la route
- [ ] Test curl vers `/api/proxy/login` retourne du JSON (pas d'erreur 404)
- [ ] Frontend React tourne sur `http://localhost:3000`
- [ ] Test de connexion depuis le navigateur
- [ ] Console montre "Utilisateur connecté avec succès"
- [ ] Redirection vers `/dashboard`

---

## 🐛 Dépannage Express

### Problème : Erreur 404 sur /api/proxy/login

**Solution :**
```bash
# Vérifier que la route existe
php artisan route:list | grep proxy

# Si elle n'existe pas :
php artisan route:clear
php artisan cache:clear
```

### Problème : CORS Error dans le navigateur

**Vérification :**
```bash
# Dans config/cors.php, vérifiez :
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
```

### Problème : "Target class [AuthController] does not exist"

**Solution :** Dans `ProxyController.php`, vérifiez le namespace de votre AuthController.

Si votre controller est dans `App\Http\Controllers\AuthController` :
```php
$authController = app(\App\Http\Controllers\AuthController::class);
```

Si dans `App\Http\Controllers\Api\AuthController` :
```php
$authController = app(\App\Http\Controllers\Api\AuthController::class);
```

### Problème : La console montre toujours l'erreur DDoS

**Vérification :**
1. Dans la console, cherchez : "Envoi de la requête de connexion à:"
2. Doit afficher : `/api/proxy/login`
3. Si c'est `/api/auth/login`, le fichier `authService.ts` n'a pas été rechargé

**Solution :** 
- Rafraîchir la page (Ctrl+R)
- Ou redémarrer le serveur Vite

---

## 📊 Résultat Final Attendu

### Console Navigateur
```
✅ Proxying request: POST /api/proxy/login -> http://127.0.0.1:8001
✅ Proxy response: /api/proxy/login 200
✅ Envoi de la requête de connexion à: /api/proxy/login
✅ Réponse du serveur: {success: true, ...}
✅ Utilisateur connecté avec succès: {id: ..., username: "A"}
```

### Logs Laravel
```
[INFO] Tentative de connexion via proxy {"user":"A","ip":"127.0.0.1"}
[INFO] Connexion réussie via proxy {"user":"A"}
```

### Application
- ✅ Redirection vers `/dashboard`
- ✅ Affichage du tableau de bord
- ✅ Nom d'utilisateur affiché dans le header

---

## 🎉 Une Fois que Ça Fonctionne

### Pour Déployer en Production

1. **Modifier `vite.config.ts`** pour pointer vers `https://api.acexgroupe.com`
2. **Garder le même ProxyController** sur le serveur de production
3. **Le proxy backend contournera la protection DDoS** en production aussi

### Configuration Production

```typescript
// vite.config.ts - Production
proxy: {
  '/api': {
    target: 'https://api.acexgroupe.com',
    changeOrigin: true,
    secure: false,
  }
}
```

Le frontend appellera toujours `/api/proxy/login`, mais via le serveur de production.

---

## ⏱️ Temps Total

- Backend (création + route) : **10 min**
- Test curl : **2 min**
- Test frontend : **3 min**
- **Total : ~15 minutes**

---

## 📞 Besoin d'Aide ?

Si après avoir suivi ces étapes vous avez encore des problèmes :

1. **Partagez les logs Laravel** : `tail -20 storage/logs/laravel.log`
2. **Partagez la console navigateur** : copier les messages d'erreur
3. **Vérifiez les routes** : `php artisan route:list | grep -E "(login|proxy)"`

Je pourrai vous aider à diagnostiquer le problème exact ! 🚀
