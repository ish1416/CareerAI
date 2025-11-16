import React from 'react';
import ModernNavbar from '../components/ModernNavbar';
import ModernHero from '../components/ModernHero';
import ModernStats from '../components/ModernStats';
import ModernFeatures from '../components/ModernFeatures';
import ModernFooter from '../components/ModernFooter';

export default function ModernLanding() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <ModernNavbar />
      <main>
        <ModernHero />
        <ModernStats />
        <ModernFeatures />
      </main>
      <ModernFooter />
    </div>
  );
}