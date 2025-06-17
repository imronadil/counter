'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interface for donation data
interface Donation {
  id: string;
  amount: number;
  donor: string; 
  message?: string;
  timestamp: Date;
}

export default function AddDonation() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [newDonation, setNewDonation] = useState({
    amount: '',
    donor: '',
    message: ''
  });

  // Load donations from localStorage
  useEffect(() => {
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
    }
  }, []);

  // Function to dispatch custom event for live updates
  const dispatchDonationsUpdate = () => {
    const event = new CustomEvent('donationsUpdated');
    window.dispatchEvent(event);
  };

  // Handle form submission
  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDonation.amount || !newDonation.donor) {
      alert('Please fill in amount and donor name');
      return;
    }

    const donation: Donation = {
      id: Date.now().toString(),
      amount: parseInt(newDonation.amount.replace(/\D/g, '')), // Remove non-digits
      donor: newDonation.donor,
      message: newDonation.message,
      timestamp: new Date()
    };

    // Add new donation and save to localStorage
    const updatedDonations = [...donations, donation];
    setDonations(updatedDonations);
    localStorage.setItem('donations', JSON.stringify(updatedDonations));
    
    // Dispatch event for live updates
    dispatchDonationsUpdate();

    // Reset form
    setNewDonation({ amount: '', donor: '', message: '' });
    alert('Donation added successfully!');
  };

  // Delete donation
  const deleteDonation = (id: string) => {
    if (confirm('Are you sure you want to delete this donation?')) {
      const updatedDonations = donations.filter(d => d.id !== id);
      setDonations(updatedDonations);
      localStorage.setItem('donations', JSON.stringify(updatedDonations));
      
      // Dispatch event for live updates
      dispatchDonationsUpdate();
    }
  };

  // Format currency input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(value) || 0);
    setNewDonation({ ...newDonation, amount: formatted });
  };

  return (
    <div className="min-h-screen bg-[#222831] pt-12 font-sans">
      {/* Header */}
      <div className="max-w-[600px] mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="bg-[#D20062] hover:bg-[#B8004E] text-[#FFD0EC] px-4 py-2 rounded-lg font-bold transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[#FFD0EC]">Manage Donations</h1>
        </div>
      </div>

      {/* Add Donation Form */}
      <div className="max-w-[600px] mx-auto px-4">
        <div className="bg-[#D20062] p-8 rounded-[25px] text-[#FFD0EC]">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold">Add a New Donation</h2>
            <p className="text-[#FFD0EC]/80 mt-2">Help us reach our goals by recording your donation</p>
          </div>

          <form onSubmit={handleAddDonation} className="space-y-6">
            <div>
              <label className="block text-lg font-bold mb-3">
                Donation Amount <span className="text-red-300">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D20062] font-bold text-lg">
                  Rp
                </span>
                <input
                  type="text"
                  value={newDonation.amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#FFD0EC] text-[#D20062] font-bold text-xl focus:outline-none focus:ring-4 focus:ring-white/30"
                  required
                />
              </div>
              <p className="text-sm text-[#FFD0EC]/70 mt-2">Enter the donation amount in Indonesian Rupiah</p>
            </div>

            <div>
              <label className="block text-lg font-bold mb-3">
                Donor Name <span className="text-red-300">*</span>
              </label>
              <input
                type="text"
                value={newDonation.donor}
                onChange={(e) => setNewDonation({ ...newDonation, donor: e.target.value })}
                placeholder="Enter donor name"
                className="w-full p-4 rounded-lg bg-[#FFD0EC] text-[#D20062] font-bold text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                required
              />
              <p className="text-sm text-[#FFD0EC]/70 mt-2">Name of the person or organization making the donation</p>
            </div>

            <div>
              <label className="block text-lg font-bold mb-3">
                Message (Optional)
              </label>
              <textarea
                value={newDonation.message}
                onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
                placeholder="Add a message from the donor..."
                className="w-full p-4 rounded-lg bg-[#FFD0EC] text-[#D20062] h-32 resize-none focus:outline-none focus:ring-4 focus:ring-white/30"
                maxLength={200}
              />
              <p className="text-sm text-[#FFD0EC]/70 mt-2">Optional message or note from the donor (max 200 characters)</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#FFD0EC] text-[#D20062] px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition-colors shadow-lg"
              >
                💝 Add Donation
              </button>
              <Link
                href="/"
                className="px-8 py-4 rounded-lg border-2 border-[#FFD0EC] text-[#FFD0EC] hover:bg-[#FFD0EC] hover:text-[#D20062] transition-colors text-center font-bold text-lg"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 p-4 bg-[#FFD0EC]/10 rounded-lg">
            <h4 className="font-bold mb-2">💡 Tips:</h4>
            <ul className="text-sm text-[#FFD0EC]/80 space-y-1">
              <li>• Double-check the amount before submitting</li>
              <li>• Use the donor&apos;s preferred name or organization</li>
              <li>• Messages can include special notes or dedications</li>
              <li>• All data is stored locally on your device</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Donations List */}
      {donations.length > 0 && (
        <div className="max-w-[1000px] mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#FFD0EC]">📋 All Donations ({donations.length})</h3>
            <div className="text-[#FFD0EC]/70 text-sm">
              Total: {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(donations.reduce((sum, d) => sum + d.amount, 0))}
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {donations
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((donation) => (
                <div key={donation.id} className="bg-[#D20062] p-4 rounded-lg text-[#FFD0EC] flex justify-between items-start hover:bg-[#B8004E] transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-lg">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(donation.amount)}
                        </span>
                        <span className="text-sm ml-2">from {donation.donor}</span>
                      </div>
                      <span className="text-xs text-[#FFD0EC]/70">
                        {donation.timestamp.toLocaleDateString('id-ID')} {donation.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {donation.message && (
                      <p className="text-sm text-[#FFD0EC]/90 italic">&ldquo;{donation.message}&rdquo;</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteDonation(donation.id)}
                    className="ml-4 text-[#FFD0EC]/70 hover:text-white text-lg transition-colors p-2 hover:bg-red-500/20 rounded"
                    title="Delete donation"
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[#FFD0EC]/60 text-sm">
              💡 Click the trash icon to delete a donation. This action cannot be undone.
            </p>
          </div>
        </div>
      )}

      {donations.length === 0 && (
        <div className="max-w-[600px] mx-auto px-4 mt-12 text-center">
          <div className="bg-[#D20062]/20 p-8 rounded-[25px] border border-[#D20062]/40">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-[#FFD0EC] mb-4">No Donations Yet</h3>
            <p className="text-[#FFD0EC]/70 text-lg">
              Once you add donations, they will appear here for you to view and manage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
