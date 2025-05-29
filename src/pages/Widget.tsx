
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FollowersGoalWidget } from '../components/FollowersGoalWidget';

export const Widget = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">ID utilisateur manquant</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <FollowersGoalWidget userId={userId} showControls={false} />
    </div>
  );
};
