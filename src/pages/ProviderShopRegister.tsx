import React, { useState, useEffect, useRef } from "react";
import { Store, MapPin, Camera, Plus, Trash2, ArrowRight, UploadCloud, Clock, Tag, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LS_SHOP_NAME = 'rr_provider_shop_name';
const LS_SHOP_PHOTO = 'rr_provider_shop_photo';
const LS_SHOP_GST = 'rr_provider_shop_gst';
const LS_SHOP_CATEGORY = 'rr_provider_shop_category';
const LS_SHOP_ADDRESS = 'rr_provider_shop_address';
const LS_SHOP_LAT = 'rr_provider_shop_lat';
const LS_SHOP_LNG = 'rr_provider_shop_lng';
const LS_SHOP_OPEN = 'rr_provider_shop_open';
const LS_SHOP_CLOSE = 'rr_provider_shop_close';
const LS_SHOP_SERVICES = 'rr_provider_shop_services';

declare global {
  interface Window {
    initMap?: () => void;
    google?: any;
  }
}

export default function ProviderShopRegister() {
  const nav = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  const [shopPhoto, setShopPhoto] = useState(() => localStorage.getItem(LS_SHOP_PHOTO) || '');
  const [shopName, setShopName] = useState(() => localStorage.getItem(LS_SHOP_NAME) || '');
  const [address, setAddress] = useState(() => localStorage.getItem(LS_SHOP_ADDRESS) || '');
  const [gst, setGst] = useState(() => localStorage.getItem(LS_SHOP_GST) || '');
  const [category, setCategory] = useState(() => localStorage.getItem(LS_SHOP_CATEGORY) || 'Car Mechanic');
  const [openTime, setOpenTime] = useState(() => localStorage.getItem(LS_SHOP_OPEN) || '09:00');
  const [closeTime, setCloseTime] = useState(() => localStorage.getItem(LS_SHOP_CLOSE) || '21:00');
  const [lat, setLat] = useState(() => parseFloat(localStorage.getItem(LS_SHOP_LAT) || '0') || null);
  const [lng, setLng] = useState(() => parseFloat(localStorage.getItem(LS_SHOP_LNG) || '0') || null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [pinLabel, setPinLabel] = useState('');
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem(LS_SHOP_SERVICES);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return [{ name: '', price: '' }];
  });

  const addService = () => setServices([...services, { name: '', price: '' }]);
  const removeService = (i: number) => { if (services.length > 1) setServices(services.filter((_, idx) => idx !== i)); };
  const updateService = (i: number, key: 'name' | 'price', val: string) => {
    const list = [...services]; list[i][key] = val; setServices(list);
  };

  useEffect(() => {
    if (lat && lng) setPinLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  }, []);

  useEffect(() => {
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) { setMapLoaded(true); return; }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMapCallback`;
    script.async = true;
    script.defer = true;

    window.initMapCallback = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const defaultPos = lat && lng ? { lat, lng } : { lat: 28.6139, lng: 77.2090 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    });

    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: defaultPos,
      map,
      draggable: true,
      title: 'Shop Location',
    });

    markerRef.current = marker;

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      if (pos) {
        const newLat = pos.lat();
        const newLng = pos.lng();
        setLat(newLat);
        setLng(newLng);
        setPinLabel(`${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
        localStorage.setItem(LS_SHOP_LAT, String(newLat));
        localStorage.setItem(LS_SHOP_LNG, String(newLng));
      }
    });

    map.addListener('click', (e: any) => {
      if (e.latLng) {
        marker.setPosition(e.latLng);
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setLat(newLat);
        setLng(newLng);
        setPinLabel(`${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
        localStorage.setItem(LS_SHOP_LAT, String(newLat));
        localStorage.setItem(LS_SHOP_LNG, String(newLng));
      }
    });
  }, [mapLoaded]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setLat(newLat);
        setLng(newLng);
        setPinLabel(`${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
        localStorage.setItem(LS_SHOP_LAT, String(newLat));
        localStorage.setItem(LS_SHOP_LNG, String(newLng));

        if (mapInstanceRef.current && markerRef.current) {
          const newPos = { lat: newLat, lng: newLng };
          mapInstanceRef.current.panTo(newPos);
          mapInstanceRef.current.setZoom(16);
          markerRef.current.setPosition(newPos);
        }
      },
      () => alert('Could not get your location. Please allow GPS access.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const saveField = (key: string, val: string) => localStorage.setItem(key, val);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-4 py-6 pb-20">
      <div className="mx-auto w-full max-w-md">
        
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex justify-between items-center text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <span>Step 2 of 2</span>
            <span className="text-[var(--color-primary)]">Verification Pending</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-full rounded-full bg-[var(--color-primary)] transition-all duration-500"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
        >
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Register Your Shop</h1>
            <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
              Define your business hours, service list, and storefront details.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Shop Name *</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                <Store size={18} className="text-gray-400" />
                <input
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  onBlur={() => saveField(LS_SHOP_NAME, shopName)}
                  className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="e.g. Sharma Auto Care"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Shop Front Photo *</label>
              <label className="mt-2 flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all">
                {shopPhoto ? (
                  <div className="text-center p-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">✓</span>
                    <p className="text-[12px] font-medium text-gray-900 truncate max-w-xs">{shopPhoto}</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Photo added successfully</p>
                  </div>
                ) : (
                  <div className="text-center p-3 flex flex-col items-center">
                    <UploadCloud size={24} className="text-gray-400 mb-1" />
                    <span className="text-[12px] font-medium text-gray-700">Upload Shop Photo</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">JPEG, PNG up to 5MB</span>
                  </div>
                )}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setShopPhoto(file.name); saveField(LS_SHOP_PHOTO, file.name); }
                  }}
                />
              </label>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">GST Number (Optional)</label>
              <input
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                onBlur={() => saveField(LS_SHOP_GST, gst)}
                className="mt-1.5 w-full rounded-xl input-field"
                placeholder="Enter 15-digit GSTIN details"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Service Category *</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); saveField(LS_SHOP_CATEGORY, e.target.value); }}
                className="mt-2 w-full rounded-xl input-field cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="Car Mechanic">Car Mechanic</option>
                <option value="Bike Mechanic">Bike Mechanic</option>
                <option value="Towing">Towing Service</option>
                <option value="Puncture">Puncture Repair</option>
                <option value="AC Service">AC Service</option>
                <option value="Battery">Battery Jumpstart</option>
                <option value="Fuel Delivery">Fuel Delivery</option>
                <option value="Locksmith">Locksmith</option>
                <option value="Electrician">Electrician</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Shop Address *</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 px-3 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all">
                <MapPin size={18} className="text-gray-400" />
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => saveField(LS_SHOP_ADDRESS, address)}
                  className="w-full bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="Enter shop address"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Google Map Pin Location *</label>
              <div className="mt-2 rounded-xl border border-gray-200 overflow-hidden">
                <div ref={mapRef} className="h-48 w-full bg-gray-100" />
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Navigation className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-[11px] font-medium text-gray-700 truncate">
                        {pinLabel || 'Tap map or use button to set location'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={useMyLocation}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-[#2d2d4a] transition-colors cursor-pointer"
                    >
                      <MapPin className="h-3 w-3" />
                      My Location
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" /> Open Time
                </label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => { setOpenTime(e.target.value); saveField(LS_SHOP_OPEN, e.target.value); }}
                  className="mt-2 w-full rounded-xl input-field cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" /> Close Time
                </label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => { setCloseTime(e.target.value); saveField(LS_SHOP_CLOSE, e.target.value); }}
                  className="mt-2 w-full rounded-xl input-field cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={12} className="text-gray-400" /> Services & Products
                </label>
                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white hover:bg-[#2d2d4a] transition active:scale-90 cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <AnimatePresence initial={false}>
                  {services.map((s, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 p-2.5 grid grid-cols-2 gap-2">
                        <input
                          placeholder="Service description"
                          value={s.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          className="bg-transparent text-[12px] font-medium text-gray-900 outline-none border-b border-transparent focus:border-[var(--color-primary)] placeholder:text-gray-400 transition-colors"
                        />
                        <input
                          placeholder="Price (INR)"
                          value={s.price}
                          onChange={(e) => updateService(index, 'price', e.target.value)}
                          className="bg-transparent text-[12px] font-medium text-gray-900 outline-none border-b border-transparent focus:border-[var(--color-primary)] placeholder:text-gray-400 text-right transition-colors"
                        />
                      </div>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              saveField(LS_SHOP_NAME, shopName);
              saveField(LS_SHOP_SERVICES, JSON.stringify(services));
              nav('/verification-pending');
            }}
            disabled={!shopName || !shopPhoto || !address}
            className="mt-8 btn-primary w-full"
          >
            <span>Register & Submit</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
