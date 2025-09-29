export class OnboardingUtils {
  
  /**
   * Resetea el estado del onboarding para que aparezca como primera vez
   */
  static resetOnboarding(): void {
    localStorage.removeItem('hasSeenOnboarding');
    console.log('✅ Onboarding reseteado - ahora aparecerá como primera vez');
  }

  /**
   * Marca el onboarding como visto
   */
  static markOnboardingAsSeen(): void {
    localStorage.setItem('hasSeenOnboarding', 'true');
    console.log('✅ Onboarding marcado como visto');
  }

  /**
   * Verifica si el onboarding ya fue visto
   */
  static hasSeenOnboarding(): boolean {
    return localStorage.getItem('hasSeenOnboarding') === 'true';
  }

  /**
   * Limpia todo el localStorage relacionado con la app
   */
  static clearAllAppData(): void {
    localStorage.removeItem('hasSeenOnboarding');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('limitesAdelanto');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('recordarLogin');
    localStorage.removeItem('cedulaGuardada');
    console.log('🧹 Todos los datos de la app han sido limpiados');
  }
}
