"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { UserDetails } from '@/types/upload';
import { validateEmail } from '@/lib/utils';

interface UserDetailsFormProps {
  userDetails: UserDetails;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onUpdateDetails: (details: Partial<UserDetails>) => void;
}

export function UserDetailsForm({ userDetails, error, onSubmit, onUpdateDetails }: UserDetailsFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="text-center pt-8 pb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <span className="text-4xl">✨</span>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Share Your Designs
        </CardTitle>
        <p className="text-gray-600">
          Tell us about yourself to get started
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-base font-semibold">Your Name *</Label>
            <Input
              id="name"
              type="text"
              value={userDetails.name}
              onChange={(e) => onUpdateDetails({ name: e.target.value })}
              placeholder="Enter your name"
              className="mt-2 h-12 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={userDetails.email}
              onChange={(e) => onUpdateDetails({ email: e.target.value })}
              placeholder="your.email@example.com (optional)"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={userDetails.phone}
              onChange={(e) => onUpdateDetails({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000 (optional)"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold">
            Continue to Design Upload
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
