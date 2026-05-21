<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return config('app.frontend_url') . '/auth/ResetPassword?token=' . $token . '&email=' . urlencode($user->getEmailForPasswordReset());
        });

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {

            return config('app.frontend_url') . '/auth/EmailVerification' . urlencode($url);
        });
    }
}
