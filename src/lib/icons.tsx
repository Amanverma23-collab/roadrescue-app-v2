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
    default:
      return <Sparkles {...props} />;
  }
}
