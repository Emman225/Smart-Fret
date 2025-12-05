# 🚀 Guide Rapide : Implémenter le Proxy Backend Laravel

## ⏱️ Temps estimé : 10 minutes

## 📝 Étapes à Suivre

### 1️⃣ Créer le Controller (Backend Laravel)

**Créez ce fichier :** `app/Http/Controllers/Api/ProxyController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProxyController extends Controller
{
    /**
     * Proxy pour la connexion - contourne la protection DDoS LWS
     */
    public function proxyLogin(Request $request)
    {
        try {
            // Valider les données
            $request->validate([
                'LoginUser' => 'required|string',
                'PwdUser' => 'required|string'
            ]);

            Log::info('Connexion via proxy', ['user' => $request->input('LoginUser')]);

            // Appeler directement le AuthController en interne
            $authController = app(\App\Http\Controllers\Api\AuthController::class);
            
            // Créer une requête interne
            $internalRequest = Request::create(
                '/api/auth/login',
                'POST',
                [
                    'LoginUser' => $request->input('LoginUser'),
                    'PwdUser' => $request->input('PwdUser')
                ]
            );
            
            // Copier les headers importants
            $internalRequest->headers->set('Accept', 'application/json');
            $internalRequest->headers->set('X-Requested-With', 'XMLHttpRequest');
            
            // Appeler la méthode login et retourner la réponse
            return $authController->login($internalRequest);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Erreur proxy login', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion'
            ], 500);
        }
    }
}
```

### 2️⃣ Ajouter la Route (Backend Laravel)

**Ouvrez :** `routes/api.php`

**Ajoutez en haut du fichier :**
```php
use App\Http\Controllers\Api\ProxyController;
```

**Ajoutez la route (n'importe où dans le fichier) :**
```php
// Route proxy pour contourner la protection DDoS LWS
Route::post('/proxy/login', [ProxyController::class, 'proxyLogin'])
    ->middleware('throttle:10,1'); // 10 tentatives par minute maximum
```

### 3️⃣ Tester avec Curl (Backend)

Sur votre terminal, testez que le proxy fonctionne :

```bash
curl -X POST http://127.0.0.1:8001/api/proxy/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"LoginUser":"A","PwdUser":"123"}'
```

**Réponse attendue :**
✅ Un JSON avec le token d'authentification
❌ PAS la page HTML de protection DDoS

### 4️⃣ Frontend (Déjà Fait ✅)

J'ai déjà modifié votre `authService.ts` pour utiliser `/api/proxy/login` au lieu de `/api/auth/login`.

### 5️⃣ Tester l'Application Complète

1. Assurez-vous que le backend Laravel est en marche
2. Assurez-vous que le frontend est en marche (`npm run dev`)
3. Ouvrez `http://localhost:3000`
4. Essayez de vous connecter

## 🔍 Vérification

### Dans la console du navigateur, vous devriez voir :

✅ **Avant :**
```
Envoi de la requête de connexion à: /api/auth/login
Réponse brute du serveur: <!DOCTYPE html>... LWS Protection DDoS
```

✅ **Après :**
```
Envoi de la requête de connexion à: /api/proxy/login
Réponse du serveur: {success: true, data: {...}}
Utilisateur connecté avec succès
```

### Dans les logs Laravel :

```bash
tail -f storage/logs/laravel.log
```

Vous devriez voir :
```
[INFO] Connexion via proxy {"user":"A"}
```

## ❌ En Cas de Problème

### Erreur 404 - Route not found
- Vérifiez que vous avez bien ajouté la route dans `routes/api.php`
- Vérifiez le namespace du controller
- Faites `php artisan route:list` pour voir toutes les routes

### Erreur 500 - Internal Server Error
- Vérifiez les logs Laravel : `storage/logs/laravel.log`
- Vérifiez que `AuthController` existe
- Vérifiez que la méthode `login` existe dans `AuthController`

### La protection DDoS s'affiche toujours
- Vérifiez que le frontend utilise bien `/api/proxy/login`
- Vérifiez dans la console : "Envoi de la requête de connexion à:"
- Vérifiez que le proxy Vite est actif

### CSRF Token Error
- Le proxy interne ne devrait pas avoir besoin de CSRF
- Si l'erreur persiste, ajoutez l'endpoint proxy aux exceptions CSRF

## 🛡️ Sécurité

Le rate limiting est déjà configuré :
```php
->middleware('throttle:10,1'); // 10 tentatives par minute
```

Pour plus de sécurité, vous pouvez :

1. **Logger les échecs de connexion** (ajoutez dans le catch)
2. **Bloquer les IP suspectes** (avec fail2ban ou Laravel)
3. **Ajouter une validation CAPTCHA** après X échecs

## 📊 Résumé

| Composant | Modification | Statut |
|-----------|--------------|--------|
| Backend - ProxyController.php | Créer le fichier | ⏳ À faire |
| Backend - routes/api.php | Ajouter la route | ⏳ À faire |
| Frontend - authService.ts | Changer l'endpoint | ✅ Fait |
| Test - Curl | Tester le proxy | ⏳ À faire |
| Test - Application | Tester la connexion | ⏳ À faire |

## 🎯 Prochaine Étape

➡️ **Créez le fichier `ProxyController.php` sur votre backend Laravel maintenant**

Une fois fait, testez avec la commande curl, puis essayez de vous connecter depuis l'application web.

Contactez-moi si vous rencontrez des problèmes !
