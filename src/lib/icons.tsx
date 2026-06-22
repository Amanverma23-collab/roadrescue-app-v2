import React from 'react';
import {
  Wrench,
  Snowflake,
  Pill,
  Fuel,
  Ambulance,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Sparkles,
  BatteryCharging,
  Car,
  Truck,
  CircleDot,
  Lock,
  Zap,
  Droplets,
  UtensilsCrossed,
  Bike,
  LifeBuoy,
  Hammer,
} from 'lucide-react';

export function IconByName({ name, className }: { name: string; className?: string }) {
  const props = { className: className || 'h-5 w-5' };
  switch (name) {
    case 'wrench':
      return <Wrench {...props} />;
    case 'snowflake':
      return <Snowflake {...props} />;
    case 'pill':
      return <Pill {...props} />;
    case 'fuel':
      return <Fuel {...props} />;
    case 'ambulance':
      return <Ambulance {...props} />;
    case 'shield-check':
      return <ShieldCheck {...props} />;
    case 'phone-call':
      return <PhoneCall {...props} />;
    case 'map-pin':
      return <MapPin {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'battery':
      return <BatteryCharging {...props} />;
    case 'car':
      return <Car {...props} />;
    case 'truck':
      return <Truck {...props} />;
    case 'circle-dot':
      return <CircleDot {...props} />;
    case 'lock':
      return <Lock {...props} />;
    case 'zap':
      return <Zap {...props} />;
    case 'droplets':
      return <Droplets {...props} />;
    case 'utensils':
      return <UtensilsCrossed {...props} />;
    case 'bike':
      return <Bike {...props} />;
    case 'life-buoy':
      return <LifeBuoy {...props} />;
    case 'hammer':
      return <Hammer {...props} />;
    default:
      return <Sparkles {...props} />;
  }
}
