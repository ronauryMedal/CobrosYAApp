import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingUtils } from '../../utils/onboarding-utils';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  imageError?: boolean;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class OnboardingComponent implements OnInit {
  slides: OnboardingSlide[] = [
    {
      id: 1,
      title: 'Aquí comienza tu libertad financiera',
      description: 'Solicita, aprueba y recibe tu adelanto en pocos pasos – sin papeleo innecesario.',
      image: 'assets/images/onboarding/slider1.png',
      icon: 'people-outline'
    },
    {
      id: 2,
      title: 'Tu sueldo cuando lo necesites',
      description: 'Accede a tu sueldo antes del día de pago – rápido, seguro y sin complicaciones.',
      image: 'assets/images/onboarding/slider2.jpg',
      icon: 'restaurant-outline'
    },
    {
      id: 3,
      title: 'Accede a tu dinero hoy',
      description: 'Programa recordatorios, revisa tu historial y mantén el equilibrio perfecto.',
      image: 'assets/images/onboarding/slider3.jpg',
      icon: 'card-outline'
    }
  ];

  currentSlide = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar si ya se mostró el onboarding
    if (OnboardingUtils.hasSeenOnboarding()) {
      this.router.navigate(['/login']);
    }
  }

  onSlideChange(index: number) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.completeOnboarding();
    }
  }

  skipOnboarding() {
    this.completeOnboarding();
  }

  resetOnboarding() {
    OnboardingUtils.resetOnboarding();
    this.currentSlide = 0;
  }

  private completeOnboarding() {
    OnboardingUtils.markOnboardingAsSeen();
    this.router.navigate(['/login']);
  }

  getProgressPercentage(): number {
    return ((this.currentSlide + 1) / this.slides.length) * 100;
  }

  onImageError(event: any, slide: OnboardingSlide) {
    console.log('Error cargando imagen para slide:', slide.id);
    slide.imageError = true;
  }

  // Obtener la ruta del logo según el tema
  getLogoPath(): string {
    // Solo verificar la clase dark en el body (método principal de Ionic)
    const isDarkMode = document.body.classList.contains('dark');
    
    if (isDarkMode) {
      return 'assets/images/logos/Isotipo blanco.png';
    } else {
      return 'assets/images/logos/Isotipo a color.png';
    }
  }
}
