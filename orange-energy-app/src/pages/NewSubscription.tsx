import React, { useState, useRef } from 'react';
import { Layout } from '../components/common/Layout';

interface Offer {
  id: string;
  title: string;
  subscriptionFee: string;
  duration: string;
  monthlyFee: string;
  totalCost: string;
}

const ORANGE_ENERGY_OFFERS: Offer[] = [
  {
    id: 'essential_plus_revamp',
    title: 'Essential Plus Revamp',
    subscriptionFee: '$2,500 LRD',
    duration: '24 mos',
    monthlyFee: '$1,300 LRD',
    totalCost: '$33,700 LRD',
  },
  {
    id: 'comfort_plus_sunking',
    title: 'Comfort Plus Sunking',
    subscriptionFee: '$5,250 LRD',
    duration: '24 mos',
    monthlyFee: '$6,600 LRD',
    totalCost: '$163,650 LRD',
  },
  {
    id: 'comfort_sia_power',
    title: 'Comfort Sia Power',
    subscriptionFee: '$10,000 LRD',
    duration: '24 mos',
    monthlyFee: '$6,600 LRD',
    totalCost: '$163,650 LRD',
  },
  {
    id: 'comfort_premium_fridge',
    title: 'Comfort Premium - Fridge',
    subscriptionFee: '$10,000 LRD',
    duration: '24 mos',
    monthlyFee: '$9,995 LRD',
    totalCost: '$239,880 LRD',
  },
  {
    id: 'comfort_premium_freezer',
    title: 'Comfort Premium - Freezer',
    subscriptionFee: '$12,745 LRD',
    duration: '24 mos',
    monthlyFee: '$12,745 LRD',
    totalCost: '$305,880 LRD',
  },
];

export const NewSubscription = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Customer Identification
    customerName: '',
    address: '',
    communityName: '',
    gpsCoordinates: '',
    primaryPhone: '',
    secondaryPhone: '',
    idType: '',
    idNumber: '',
    emailAddress: '',
    numberOfKits: 1,

    // Step 2: Device & Orange Energy Offers
    kitSerialNumber: '',
    solarPanelSerial: '',
    batterySerial: '',
    selectedOfferId: 'essential_plus_revamp',

    // Step 3: Preferences & Legal Terms
    receiveOrangeInfo: 'Yes',
    receiveElectronicInvoice: 'Yes',
    termsAccepted: false,

    // Step 4: Administrative Details
    fileNumber: '',
    agreementDate: new Date().toISOString().split('T')[0],
    orangeShop: '',
    installerName: '',
    installerContactNumber: '',

    // Step 5: Digital Signatures & Biometrics
    customerSignature: '',
    thumbprintPhoto: '',
    installerSignature: '',
  });

  const [phoneError, setPhoneError] = useState('');
  const [installerPhoneError, setInstallerPhoneError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Canvas Refs for Signatures
  const customerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const installerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingCustomer, setIsDrawingCustomer] = useState(false);
  const [isDrawingInstaller, setIsDrawingInstaller] = useState(false);

  // Fetch device GPS coordinates
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
          setFormData((prev) => ({ ...prev, gpsCoordinates: coords }));
          setIsLocating(false);
        },
        () => {
          alert('Unable to retrieve location. Please grant location permissions.');
          setIsLocating(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Handle phone changes
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'primaryPhone' | 'secondaryPhone' | 'installerContactNumber'
  ) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'primaryPhone') {
      if (value.length > 0 && !value.startsWith('077')) {
        setPhoneError('Phone number must start with 077');
      } else if (value.length > 0 && value.length < 10) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else {
        setPhoneError('');
      }
    }

    if (field === 'installerContactNumber') {
      if (value.length > 0 && value.length < 10) {
        setInstallerPhoneError('Installer contact number must be 10 digits');
      } else {
        setInstallerPhoneError('');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Signature Canvas Helpers
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setIsDrawing: (drawing: boolean) => void
  ) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    isDrawing: boolean
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (setIsDrawing: (drawing: boolean) => void) => {
    setIsDrawing(false);
  };

  const clearCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    field: 'customerSignature' | 'installerSignature'
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  // Handle Thumbprint Upload
  const handleThumbprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbprintPhoto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (
        !formData.primaryPhone.startsWith('077') ||
        formData.primaryPhone.length !== 10
      ) {
        setPhoneError('Please enter a valid 10-digit phone number starting with 077');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    alert('Contract draft saved locally!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Contract submitted successfully!');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {/* Step Navigation Progress Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 overflow-x-auto gap-2">
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 1 ? 'text-orange-600 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs">
              1
            </span>
            <span className="text-xs hidden md:inline">Identification</span>
          </div>
          <div className="h-0.5 w-6 md:w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 2 ? 'text-orange-600 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs">
              2
            </span>
            <span className="text-xs hidden md:inline">Device & Offers</span>
          </div>
          <div className="h-0.5 w-6 md:w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 3 ? 'text-orange-600 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs">
              3
            </span>
            <span className="text-xs hidden md:inline">Preferences & Legal</span>
          </div>
          <div className="h-0.5 w-6 md:w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 4 ? 'text-orange-600 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs">
              4
            </span>
            <span className="text-xs hidden md:inline">Admin Details</span>
          </div>
          <div className="h-0.5 w-6 md:w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 ${
              currentStep === 5 ? 'text-orange-600 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs">
              5
            </span>
            <span className="text-xs hidden md:inline">Signatures</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: CUSTOMER IDENTIFICATION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="bg-orange-500 text-white font-extrabold text-sm uppercase px-4 py-3 rounded-lg mb-6">
                CUSTOMER IDENTIFICATION
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer / Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Community Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="communityName"
                  placeholder="e.g. Sinkor, Paynesville"
                  value={formData.communityName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GPS Coordinates
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="gpsCoordinates"
                    placeholder="e.g. 6.3156, -10.8074"
                    value={formData.gpsCoordinates}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 rounded-xl transition-colors whitespace-nowrap"
                  >
                    {isLocating ? 'Locating...' : 'Get GPS'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (Orange Money Connected){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="077XXXXXXX"
                  value={formData.primaryPhone}
                  onChange={(e) => handlePhoneChange(e, 'primaryPhone')}
                  required
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                    phoneError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-orange-500'
                  } focus:outline-none focus:ring-2`}
                />
                {phoneError && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number #2
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="07XXXXXXXX"
                  value={formData.secondaryPhone}
                  onChange={(e) => handlePhoneChange(e, 'secondaryPhone')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select ID Type</option>
                  <option value="NATIONAL_ID">National ID (NIR)</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Kits <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="numberOfKits"
                  min={1}
                  value={formData.numberOfKits}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DEVICE & ORANGE ENERGY OFFERS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-orange-500 text-white font-extrabold text-sm uppercase px-4 py-3 rounded-lg">
                  DEVICE & KIT DETAILS
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kit Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kitSerialNumber"
                    value={formData.kitSerialNumber}
                    onChange={handleChange}
                    required
                    placeholder="e.g. OE-KIT-88231"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Solar Panel Serial Number
                    </label>
                    <input
                      type="text"
                      name="solarPanelSerial"
                      value={formData.solarPanelSerial}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Battery Pack Serial Number
                    </label>
                    <input
                      type="text"
                      name="batterySerial"
                      value={formData.batterySerial}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* ORANGE ENERGY OFFERS */}
              <div className="pt-2">
                <div className="bg-orange-500 text-white font-extrabold text-sm uppercase px-4 py-3 rounded-lg mb-4">
                  ORANGE ENERGY OFFERS
                </div>

                <div className="space-y-3">
                  {ORANGE_ENERGY_OFFERS.map((offer) => {
                    const isSelected = formData.selectedOfferId === offer.id;
                    return (
                      <div
                        key={offer.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            selectedOfferId: offer.id,
                          }))
                        }
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <input
                            type="radio"
                            name="selectedOffer"
                            value={offer.id}
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 text-orange-500 border-slate-300 focus:ring-orange-500 cursor-pointer"
                          />
                          <span className="text-sm font-bold text-slate-900 text-center">
                            {offer.title}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 text-center font-medium">
                          Subscription Fees:{' '}
                          <span className="text-slate-700 font-semibold">
                            {offer.subscriptionFee}
                          </span>{' '}
                          | Duration:{' '}
                          <span className="text-slate-700 font-semibold">
                            {offer.duration}
                          </span>{' '}
                          | Monthly:{' '}
                          <span className="text-slate-700 font-semibold">
                            {offer.monthlyFee}
                          </span>{' '}
                          | Total:{' '}
                          <span className="text-slate-700 font-semibold">
                            {offer.totalCost}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES & LEGAL TERMS */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="bg-orange-500 text-white font-extrabold text-sm uppercase px-4 py-3 rounded-lg mb-6">
                PREFERENCES & LEGAL TERMS
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Would you like to receive information from Orange Liberia?
                </label>
                <select
                  name="receiveOrangeInfo"
                  value={formData.receiveOrangeInfo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Receive electronic invoice for this line and services? <span className="text-red-500">*</span>
                </label>
                <select
                  name="receiveElectronicInvoice"
                  value={formData.receiveElectronicInvoice}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Terms and Conditions Summary
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p>
                    <strong>Article 1: Object</strong> - Orange Liberia provides solar energy solutions governed by these terms.
                  </p>
                  <p>
                    <strong>Article 3: Rental/Sale</strong> - Equipment remains property of Orange until fully paid. First 30 days payment due 15 days after installation. 14-day money-back guarantee/withdrawal.
                  </p>
                  <p>
                    <strong>Article 5: Activation</strong> - Customer must maintain an active Orange SIM with Orange Money.
                  </p>
                  <p>
                    <strong>Article 9: Termination</strong> - Failure to pay monthly fees results in suspension. Orange reserves right to repossess equipment after 60 days of unpaid suspension.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => alert('Downloading Terms & Conditions PDF...')}
                  className="w-full py-3 px-4 bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-sm"
                >
                  📄 Download / View Full Terms & Conditions (PDF)
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                  className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-xs text-slate-700 font-medium cursor-pointer"
                >
                  I confirm that I have read and agree to the terms and conditions outlined above.
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: ADMINISTRATIVE DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="bg-orange-500 text-white font-extrabold text-sm uppercase px-4 py-3 rounded-lg mb-6">
                ADMINISTRATIVE DETAILS
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  File Number
                </label>
                <input
                  type="text"
                  name="fileNumber"
                  value={formData.fileNumber}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Agreement Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="agreementDate"
                  value={formData.agreementDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Orange Shop <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="orangeShop"
                  value={formData.orangeShop}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  OE Installer/Agent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="installerName"
                  placeholder="Full Name"
                  value={formData.installerName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  OE Installer/Agent Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="07XXXXXXXX"
                  value={formData.installerContactNumber}
                  onChange={(e) => handlePhoneChange(e, 'installerContactNumber')}
                  required
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                    installerPhoneError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-orange-500'
                  } focus:outline-none focus:ring-2`}
                />
                {installerPhoneError && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">
                    {installerPhoneError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: DIGITAL SIGNATURES & BIOMETRICS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-orange-500 text-white font-extrabold text-sm uppercase px-4 py-3 rounded-lg mb-6">
                DIGITAL SIGNATURES & BIOMETRICS
              </div>

              {/* Customer Signature */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Customer Signature <span className="text-red-500">*</span>
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl bg-slate-50/50 overflow-hidden">
                  <canvas
                    ref={customerCanvasRef}
                    width={750}
                    height={160}
                    onMouseDown={(e) => startDrawing(e, customerCanvasRef, setIsDrawingCustomer)}
                    onMouseMove={(e) => draw(e, customerCanvasRef, isDrawingCustomer)}
                    onMouseUp={() => stopDrawing(setIsDrawingCustomer)}
                    onMouseLeave={() => stopDrawing(setIsDrawingCustomer)}
                    onTouchStart={(e) => startDrawing(e, customerCanvasRef, setIsDrawingCustomer)}
                    onTouchMove={(e) => draw(e, customerCanvasRef, isDrawingCustomer)}
                    onTouchEnd={() => stopDrawing(setIsDrawingCustomer)}
                    className="w-full h-40 cursor-crosshair touch-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => clearCanvas(customerCanvasRef, 'customerSignature')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  Clear Signature
                </button>
              </div>

              {/* Customer Thumbprint Photo (Optional) */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Customer Thumbprint Photo <span className="text-slate-400 font-normal">(Optional)</span>
                </label>

                <label className="w-full py-3 px-4 bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-300">
                  📷 Take / Upload Customer Thumbprint Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleThumbprintUpload}
                    className="hidden"
                  />
                </label>

                <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center min-h-[120px]">
                  {formData.thumbprintPhoto ? (
                    <div className="relative group">
                      <img
                        src={formData.thumbprintPhoto}
                        alt="Customer Thumbprint"
                        className="max-h-36 rounded-lg border border-slate-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbprintPhoto: '' }))}
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline block text-center"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      No thumbprint captured (Optional)
                    </span>
                  )}
                </div>
              </div>

              {/* OE Installer/Agent Signature */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  OE Installer/Agent Signature <span className="text-red-500">*</span>
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl bg-slate-50/50 overflow-hidden">
                  <canvas
                    ref={installerCanvasRef}
                    width={750}
                    height={160}
                    onMouseDown={(e) => startDrawing(e, installerCanvasRef, setIsDrawingInstaller)}
                    onMouseMove={(e) => draw(e, installerCanvasRef, isDrawingInstaller)}
                    onMouseUp={() => stopDrawing(setIsDrawingInstaller)}
                    onMouseLeave={() => stopDrawing(setIsDrawingInstaller)}
                    onTouchStart={(e) => startDrawing(e, installerCanvasRef, setIsDrawingInstaller)}
                    onTouchMove={(e) => draw(e, installerCanvasRef, isDrawingInstaller)}
                    onTouchEnd={() => stopDrawing(setIsDrawingInstaller)}
                    className="w-full h-40 cursor-crosshair touch-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => clearCanvas(installerCanvasRef, 'installerSignature')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  Clear Signature
                </button>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS & STEP CONTROLS */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
            <div>
              {/* Display Save Draft button ONLY on Step 5 */}
              {currentStep === 5 && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Save Draft
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-sm transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
                >
                  Submit Contract
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};