<?php

/**
 * Fichier : routes/api.php
 * 
 * Ajoutez ces lignes dans votre fichier routes/api.php existant
 */

// ========================
// DÉBUT DES AJOUTS
// ========================

use App\Http\Controllers\Api\ProxyController;

// Route proxy pour contourner la protection DDoS LWS
// Cette route permet de faire passer les requêtes de connexion en interne,
// évitant ainsi le système de challenge Anubis de LWS
Route::post('/proxy/login', [ProxyController::class, 'proxyLogin'])
    ->middleware('throttle:10,1') // Limite à 10 tentatives par minute
    ->name('proxy.login');

// ========================
// FIN DES AJOUTS
// ========================

/**
 * NOTES IMPORTANTES :
 * 
 * 1. Placez ces lignes AVANT vos routes protégées par auth
 * 2. Le middleware throttle limite à 10 tentatives par minute par IP
 * 3. Si vous avez besoin d'ajuster le rate limiting, modifiez throttle:10,1
 *    Format: throttle:{nombre_requêtes},{minutes}
 *    Exemple: throttle:20,1 = 20 requêtes par minute
 * 
 * 4. Pour vérifier que la route est bien enregistrée, exécutez :
 *    php artisan route:list | grep proxy
 * 
 * 5. Si vous utilisez l'authentification Sanctum, vous pouvez exempter
 *    cette route de la vérification CSRF en l'ajoutant dans :
 *    app/Http/Middleware/VerifyCsrfToken.php
 * 
 *    protected $except = [
 *        'api/proxy/login',
 *    ];
 */
