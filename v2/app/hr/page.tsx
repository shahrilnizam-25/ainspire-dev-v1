"use client";
import dynamic from 'next/dynamic';
const HRPortal = dynamic(() => import('../../src/components/HRPortal'), { ssr: false });
export default function Page() { return <HRPortal />; }
