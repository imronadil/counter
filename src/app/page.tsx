'use client';

import { useState, useEffect, useRef } from 'react';

// Interface for donation data
interface Donation {
  id: string;
  amount: number;
  donor: string; 
  message?: string;
  timestamp: Date;
}

// Counter component with animation
const AnimatedCounter = ({ value, label, showPlus = false, isCurrency = false }: { value: number; label: string; showPlus?: boolean; isCurrency?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Format number as Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with thousand separators  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  useEffect(() => {
    const animateCounter = () => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            animateCounter();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  // Reset animation when value changes
  useEffect(() => {
    setHasAnimated(false);
    setDisplayValue(0);
  }, [value]);

  return (
    <div className="bg-[#D20062] p-6 text-center text-[#FFD0EC] rounded-[25px]" ref={elementRef}>
      <div className="text-5xl font-bold inline-block relative">
        {isCurrency ? formatCurrency(Math.floor(displayValue)) : formatNumber(Math.floor(displayValue))}
        {showPlus && displayValue > 0 && (
          <span className="absolute top-0 -right-4 text-xl">+</span>
        )}
      </div>
      <div className="text-xl mt-2">{label}</div>
    </div>
  );
};

export default function DonationCounter() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load donations from localStorage on component mount
  useEffect(() => {
    reloadDonations();
  }, []);

  // Function to reload donations from localStorage
  const reloadDonations = () => {
    const savedDonations = localStorage.getItem('donations');
    if (savedDonations) {
      try {
        const parsed = JSON.parse(savedDonations);
        setDonations(parsed.map((d: Donation) => ({
          ...d,
          timestamp: new Date(d.timestamp)
        })));
      } catch (error) {
        console.error('Error loading donations:', error);
      }
    } else {
      // If no donations in localStorage, set to empty array
      setDonations([]);
    }
  };

  // Listen for localStorage changes (live updates from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'donations') {
        reloadDonations();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events (live updates from same tab)
  useEffect(() => {
    const handleDonationsUpdate = () => {
      reloadDonations();
    };

    window.addEventListener('donationsUpdated', handleDonationsUpdate);
    return () => window.removeEventListener('donationsUpdated', handleDonationsUpdate);
  }, []);

  // Refresh donations when page becomes visible (fallback for edge cases)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        reloadDonations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Calculate totals
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalDonors = donations.length;
  const monthlyGoal = 500000; // Rp 50,000,000

  return (
    <div className="min-h-screen bg-[#222831] font-sans relative flex items-center justify-center">
      {/* Fullscreen Button - Hide when in fullscreen mode */}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-6 right-6 z-50 bg-[#D20062] hover:bg-[#B8004E] text-[#FFD0EC] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#D20062]/30"
          title="Enter Fullscreen"
        >
          {/* Enter fullscreen icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
      )}

      {/* Add Donation Button - Hide in fullscreen for cleaner view */}
      {!isFullscreen && (
        <div className="fixed top-6 left-6 z-50">
          <a
            href="/add-donation"
            className="bg-[#D20062] hover:bg-[#B8004E] text-[#FFD0EC] px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#D20062]/30 flex items-center gap-2"
          >
            <span className="text-xl">💰</span>
            Add Donation
          </a>
        </div>
      )}

      {/* Stats Section - Vertically Centered */}
      <div className={`grid grid-cols-1 md:grid-cols-1 gap-6 w-full px-4 ${
        isFullscreen ? 'max-w-[1200px] gap-8' : 'max-w-[1000px]'
      }`}>
        <AnimatedCounter value={totalDonations} label="Total Donations" isCurrency={true} />
        <AnimatedCounter value={totalDonors} label="Total Donors" showPlus />
        <AnimatedCounter value={monthlyGoal} label="Monthly Goal" isCurrency={true} />
      </div>
    </div>
  );
}
