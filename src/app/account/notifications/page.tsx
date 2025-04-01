"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiBell,
  FiMail,
  FiSmartphone,
  FiInfo,
} from "react-icons/fi";

// Define the type for notification settings
type NotificationSettings = {
  pushNotifications: boolean;
  orderUpdates: boolean;
  deliveryAlerts: boolean;
  promotionsOffers: boolean;
  emailNotifications: boolean;
  emailOrderUpdates: boolean;
  emailDeliveryAlerts: boolean;
  emailPromotionsOffers: boolean;
  smsNotifications: boolean;
  smsOrderUpdates: boolean;
  smsDeliveryAlerts: boolean;
  smsPromotionsOffers: boolean;
};

const NotificationsPage = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    orderUpdates: true,
    deliveryAlerts: true,
    promotionsOffers: false,
    emailNotifications: true,
    emailOrderUpdates: true,
    emailDeliveryAlerts: true,
    emailPromotionsOffers: false,
    smsNotifications: false,
    smsOrderUpdates: false,
    smsDeliveryAlerts: false,
    smsPromotionsOffers: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCategoryToggle = (type: "push" | "email" | "sms") => {
    if (type === "push") {
      const newValue = !settings.pushNotifications;
      setSettings((prev) => ({
        ...prev,
        pushNotifications: newValue,
        orderUpdates: newValue ? prev.orderUpdates : false,
        deliveryAlerts: newValue ? prev.deliveryAlerts : false,
        promotionsOffers: newValue ? prev.promotionsOffers : false,
      }));
    } else if (type === "email") {
      const newValue = !settings.emailNotifications;
      setSettings((prev) => ({
        ...prev,
        emailNotifications: newValue,
        emailOrderUpdates: newValue ? prev.emailOrderUpdates : false,
        emailDeliveryAlerts: newValue ? prev.emailDeliveryAlerts : false,
        emailPromotionsOffers: newValue ? prev.emailPromotionsOffers : false,
      }));
    } else if (type === "sms") {
      const newValue = !settings.smsNotifications;
      setSettings((prev) => ({
        ...prev,
        smsNotifications: newValue,
        smsOrderUpdates: newValue ? prev.smsOrderUpdates : false,
        smsDeliveryAlerts: newValue ? prev.smsDeliveryAlerts : false,
        smsPromotionsOffers: newValue ? prev.smsPromotionsOffers : false,
      }));
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Styled toggle switch component
  const ToggleSwitch = ({
    isOn,
    onToggle,
  }: {
    isOn: boolean;
    onToggle: () => void;
  }) => (
    <div
      className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
        isOn ? "bg-indigo-600" : "bg-gray-300"
      }`}
      onClick={onToggle}
    >
      <span
        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
          isOn ? "transform translate-x-6" : ""
        }`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 flex items-center sticky top-0 z-10 shadow-sm">
        <Link href="/account/settings" className="mr-3">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Notification Settings</h1>
      </div>

      <div className="p-4">
        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start">
          <FiInfo className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Customize how and when you receive notifications about your orders,
            deliveries, and exclusive offers.
          </p>
        </div>

        {/* Push notifications section */}
        <div className="bg-white rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <FiBell className="text-indigo-600" />
              </div>
              <h2 className="font-medium">Push Notifications</h2>
            </div>
            <ToggleSwitch
              isOn={settings.pushNotifications}
              onToggle={() => handleCategoryToggle("push")}
            />
          </div>

          {settings.pushNotifications && (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Order updates</p>
                  <p className="text-xs text-gray-500">
                    Get notified about order status
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.orderUpdates}
                  onToggle={() => handleToggle("orderUpdates")}
                />
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Delivery alerts</p>
                  <p className="text-xs text-gray-500">
                    Get notified about delivery status
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.deliveryAlerts}
                  onToggle={() => handleToggle("deliveryAlerts")}
                />
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Promotions & offers</p>
                  <p className="text-xs text-gray-500">
                    Get notified about new deals
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.promotionsOffers}
                  onToggle={() => handleToggle("promotionsOffers")}
                />
              </div>
            </div>
          )}
        </div>

        {/* Email notifications section */}
        <div className="bg-white rounded-lg mb-4 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <FiMail className="text-indigo-600" />
              </div>
              <h2 className="font-medium">Email Notifications</h2>
            </div>
            <ToggleSwitch
              isOn={settings.emailNotifications}
              onToggle={() => handleCategoryToggle("email")}
            />
          </div>

          {settings.emailNotifications && (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Order updates</p>
                  <p className="text-xs text-gray-500">
                    Receive order details via email
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.emailOrderUpdates}
                  onToggle={() => handleToggle("emailOrderUpdates")}
                />
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Delivery alerts</p>
                  <p className="text-xs text-gray-500">
                    Receive delivery updates via email
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.emailDeliveryAlerts}
                  onToggle={() => handleToggle("emailDeliveryAlerts")}
                />
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Promotions & offers</p>
                  <p className="text-xs text-gray-500">
                    Receive deals and offers via email
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.emailPromotionsOffers}
                  onToggle={() => handleToggle("emailPromotionsOffers")}
                />
              </div>
            </div>
          )}
        </div>

        {/* SMS notifications section */}
        <div className="bg-white rounded-lg mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <FiSmartphone className="text-indigo-600" />
              </div>
              <h2 className="font-medium">SMS Notifications</h2>
            </div>
            <ToggleSwitch
              isOn={settings.smsNotifications}
              onToggle={() => handleCategoryToggle("sms")}
            />
          </div>

          {settings.smsNotifications && (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Order updates</p>
                  <p className="text-xs text-gray-500">
                    Receive order updates via SMS
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsOrderUpdates}
                  onToggle={() => handleToggle("smsOrderUpdates")}
                />
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Delivery alerts</p>
                  <p className="text-xs text-gray-500">
                    Receive delivery alerts via SMS
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsDeliveryAlerts}
                  onToggle={() => handleToggle("smsDeliveryAlerts")}
                />
              </div>

              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-sm">
                  <p>Promotions & offers</p>
                  <p className="text-xs text-gray-500">
                    Receive deals and offers via SMS
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsPromotionsOffers}
                  onToggle={() => handleToggle("smsPromotionsOffers")}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium mb-4"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>

        {/* Success message */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
            <div className="bg-green-100 rounded-full p-1 mr-3">
              <FiBell className="text-green-600" />
            </div>
            <p className="text-sm text-green-800">
              Your notification preferences have been updated successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
