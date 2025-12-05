<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProxyController extends Controller
{
    /**
     * Proxy pour la connexion - contourne la protection DDoS LWS
     * 
     * Cette méthode crée une requête interne vers le AuthController,
     * permettant de bypasser la protection DDoS qui bloque uniquement
     * les requêtes externes.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function proxyLogin(Request $request)
    {
        try {
            // Validation des données d'entrée
            $request->validate([
                'LoginUser' => 'required|string|max:255',
                'PwdUser' => 'required|string'
            ]);

            Log::info('Tentative de connexion via proxy', [
                'user' => $request->input('LoginUser'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Récupérer le AuthController
            $authController = app(\App\Http\Controllers\Api\AuthController::class);
            
            // Créer une requête interne qui ne passera pas par la protection DDoS externe
            // En développement local (127.0.0.1:8001), cela fait une vraie requête interne
            $internalRequest = Request::create(
                '/api/auth/login',
                'POST',
                [
                    'LoginUser' => $request->input('LoginUser'),
                    'PwdUser' => $request->input('PwdUser')
                ],
                $request->cookies->all(), // Copier les cookies
                [], // Files
                $request->server->all() // Server params
            );
            
            // Copier les headers importants
            $internalRequest->headers->set('Accept', 'application/json');
            $internalRequest->headers->set('Content-Type', 'application/json');
            $internalRequest->headers->set('X-Requested-With', 'XMLHttpRequest');
            $internalRequest->headers->set('X-Forwarded-For', $request->ip());
            $internalRequest->headers->set('User-Agent', $request->userAgent());
            
            // Marquer comme requête proxy interne
            $internalRequest->headers->set('X-Internal-Proxy', 'true');
            
            // Appeler la méthode login du AuthController
            $response = $authController->login($internalRequest);
            
            // Logger le succès
            $statusCode = $response->getStatusCode();
            if ($statusCode === 200) {
                Log::info('Connexion réussie via proxy', [
                    'user' => $request->input('LoginUser')
                ]);
            } else {
                Log::warning('Échec de connexion via proxy', [
                    'user' => $request->input('LoginUser'),
                    'status' => $statusCode
                ]);
            }
            
            return $response;

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation échouée pour la connexion proxy', [
                'errors' => $e->errors()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Données de connexion invalides',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Erreur critique dans le proxy de connexion', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
            ], 500);
        }
    }
}
