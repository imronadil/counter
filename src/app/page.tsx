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

  // Calculate totals
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalDonors = donations.length;
  const monthlyGoal = 50000000; // Rp 50,000,000

  return (
    <div className="min-h-screen bg-[#222831] pt-48 font-sans">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mx-auto max-w-[1000px] px-4">
        <AnimatedCounter value={totalDonations} label="Total Donations" isCurrency={true} />
        <AnimatedCounter value={totalDonors} label="Total Donors" showPlus />
        <AnimatedCounter value={monthlyGoal} label="Monthly Goal" isCurrency={true} />
      </div>
    </div>
  );
}
