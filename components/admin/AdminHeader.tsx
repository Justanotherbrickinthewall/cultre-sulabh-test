"use client";

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              Cultre Sulabh Admin
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <User className="w-4 h-4" />
              <span>Welcome, {session?.user?.name}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
