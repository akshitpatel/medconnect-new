'use client';

import React from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';

export function ProfileSkeletonLoader() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-6 w-80" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 overflow-x-auto rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
            <Skeleton className="h-12 flex-1 min-w-[100px]" />
            <Skeleton className="h-12 flex-1 min-w-[100px]" />
            <Skeleton className="h-12 flex-1 min-w-[100px]" />
            <Skeleton className="h-12 flex-1 min-w-[100px]" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 lg:row-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Skeleton className="h-20 w-20 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
