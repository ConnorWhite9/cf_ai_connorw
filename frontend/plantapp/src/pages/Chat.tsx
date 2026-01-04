import {useEffect, useState } from 'react';
import { PlantPalLayout } from '../components/Layout';
import { PlantPalChat } from '../components/PlantPalChat';




export default function Chat() {  return (
    <PlantPalLayout showAddButton={false} maxWidth='sm'> 
        <div className="h-[80vh]">
            <PlantPalChat />
        </div> 
    </PlantPalLayout>
  );
}