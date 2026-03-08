'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import {
  User,
  Bell,
  Lock,
  CreditCard,
  MapPin,
  Globe,
  Shield,
  Eye,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';

type SettingsTab = 'account' | 'notifications' | 'privacy' | 'security';

export default function SettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Account Settings
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone || '');
      setBio(user.bio || '');
      setProfilePhoto(user.profilePhotoUrl || null);
    }
  }, [user]);

  // Load user settings from localStorage (mock)
  useEffect(() => {
    const loadSettings = () => {
      if (!user) return;

      try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);

          // Load settings into state
          if (settings.language) setLanguage(settings.language);
          if (settings.currency) setCurrency(settings.currency);
          setEmailNotifications(settings.email_notifications ?? true);
          setSmsNotifications(settings.sms_notifications ?? false);
          setPushNotifications(settings.push_notifications ?? true);
          setMarketingEmails(settings.marketing_emails ?? false);
          setBookingUpdates(settings.booking_updates ?? true);
          setMessageNotifications(settings.message_notifications ?? true);
          setProfileVisibility(settings.profile_visibility || 'public');
          setShowEmail(settings.show_email ?? false);
          setShowPhone(settings.show_phone ?? false);
          setActivityStatus(settings.activity_status ?? true);
          setTwoFactorEnabled(settings.two_factor_enabled ?? false);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update user data in auth store
      const { updateUser } = useAuthStore.getState();
      updateUser({
        firstName,
        lastName,
        phone: phoneNumber,
        bio,
        profilePhotoUrl: profilePhoto || undefined,
      });

      // Update user in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          phone: phoneNumber,
          bio,
          profilePhotoUrl: profilePhoto,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Save settings to localStorage
      const settings = {
        language,
        currency,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        push_notifications: pushNotifications,
        marketing_emails: marketingEmails,
        booking_updates: bookingUpdates,
        message_notifications: messageNotifications,
        profile_visibility: profileVisibility,
        show_email: showEmail,
        show_phone: showPhone,
        activity_status: activityStatus,
        two_factor_enabled: twoFactorEnabled,
      };
      localStorage.setItem('userSettings', JSON.stringify(settings));

      toast.success('Settings saved successfully!');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy', icon: Eye },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition mb-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

                  <div className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-6 pb-6 border-b">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                          {profilePhoto ? (
                            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-12 h-12" />
                          )}
                        </div>
                        <label
                          htmlFor="photo-upload"
                          className="absolute bottom-0 right-0 bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition"
                        >
                          <Camera className="w-4 h-4" />
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Profile Photo</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Upload a profile photo to personalize your account
                        </p>
                        <label
                          htmlFor="photo-upload-button"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium cursor-pointer transition"
                        >
                          <Upload className="w-4 h-4" />
                          Choose Photo
                          <input
                            id="photo-upload-button"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Me
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a little about yourself..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition resize-none"
                      />
                    </div>

                    {/* Language & Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="w-4 h-4 inline mr-1" />
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Chinese">Chinese</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="CNY">CNY (¥)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    {/* Notification Channels */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Channels</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">Email Notifications</p>
                              <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">SMS Notifications</p>
                              <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={smsNotifications}
                            onChange={(e) => setSmsNotifications(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">Push Notifications</p>
                              <p className="text-sm text-gray-500">Get alerts on your device</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={pushNotifications}
                            onChange={(e) => setPushNotifications(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Notify</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">Booking Updates</p>
                            <p className="text-sm text-gray-500">Reservations, confirmations, and changes</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={bookingUpdates}
                            onChange={(e) => setBookingUpdates(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">Messages</p>
                            <p className="text-sm text-gray-500">New messages from hosts and guests</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={messageNotifications}
                            onChange={(e) => setMessageNotifications(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">Marketing & Promotions</p>
                            <p className="text-sm text-gray-500">Deals, tips, and inspiration</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={marketingEmails}
                            onChange={(e) => setMarketingEmails(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Sharing</h2>

                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="users">Users Only - Only registered users</option>
                        <option value="private">Private - Only visible to connections</option>
                      </select>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information Display</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">Show Email Address</p>
                            <p className="text-sm text-gray-500">Allow others to see your email</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={showEmail}
                            onChange={(e) => setShowEmail(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">Show Phone Number</p>
                            <p className="text-sm text-gray-500">Allow others to see your phone</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={showPhone}
                            onChange={(e) => setShowPhone(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">Activity Status</p>
                            <p className="text-sm text-gray-500">Show when you're online</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={activityStatus}
                            onChange={(e) => setActivityStatus(e.target.checked)}
                            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Data & Privacy */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                          <p className="font-medium text-gray-900">Download Your Data</p>
                          <p className="text-sm text-gray-500">Get a copy of your information</p>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                          <p className="font-medium text-gray-900">Data Retention</p>
                          <p className="text-sm text-gray-500">Manage how long we keep your data</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security</h2>

                  <div className="space-y-6">
                    {/* Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                      <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg transition shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5" />
                            <span className="font-medium">Change Password</span>
                          </div>
                          <span className="text-sm">Last changed 30 days ago</span>
                        </div>
                      </button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-blue-900 font-semibold mb-1">
                              Secure Your Account
                            </p>
                            <p className="text-sm text-blue-800">
                              Add an extra layer of security by requiring a code from your phone when signing in
                            </p>
                          </div>
                        </div>
                      </div>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Enable 2FA</p>
                            <p className="text-sm text-gray-500">Protect your account with 2-step verification</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                          className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
                        />
                      </label>
                    </div>

                    {/* Active Sessions */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">MacBook Pro • San Francisco, CA</p>
                              <p className="text-sm text-gray-500">Current session • Last active now</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="mt-4 w-full py-3 px-4 border-2 border-rose-500 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition">
                        Sign Out All Other Devices
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition">
                          <p className="font-medium text-red-900">Deactivate Account</p>
                          <p className="text-sm text-red-700">Temporarily disable your account</p>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition">
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-700">Permanently delete your account and data</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Settings saved successfully!</span>
                  </div>
                )}
                {!saveSuccess && <div />}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-8 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
