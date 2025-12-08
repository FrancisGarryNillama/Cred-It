import React from 'react';
import { User, School, Mail, Phone } from 'lucide-react';
import { Input } from '../../../components/common';

export default function ProfileForm({ profile, onUpdate }) {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        value={profile.name}
        onChange={(e) => onUpdate('name', e.target.value)}
        icon={User}
      />

      <Input
        type="text"
        label="School Name"
        placeholder="Enter your school name"
        value={profile.school_name}
        onChange={(e) => onUpdate('school_name', e.target.value)}
        icon={School}
      />

      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={profile.email}
        onChange={(e) => onUpdate('email', e.target.value)}
        icon={Mail}
      />

      <Input
        type="tel"
        label="Phone Number"
        placeholder="Enter your phone number"
        value={profile.phone}
        onChange={(e) => onUpdate('phone', e.target.value)}
        icon={Phone}
      />

      <Input
        type="text"
        label="Address"
        placeholder="Enter your address"
        value={profile.address}
        onChange={(e) => onUpdate('address', e.target.value)}
        icon={MapPin}
      />

      <Input
        type="date"
        label="Date of Birth"
        placeholder="YYYY-MM-DD"
        value={profile.date_of_birth || ''}
        onChange={(e) => onUpdate('date_of_birth', e.target.value)}
        icon={Calendar}
      />
    </div>
  );
}