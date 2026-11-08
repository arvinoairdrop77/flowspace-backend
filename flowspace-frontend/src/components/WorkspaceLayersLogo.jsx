import React from 'react';

export const WorkspaceLayersLogo = ({ className = "w-10 h-10" }) => (
  <svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="workspaceLayersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <g stroke="url(#workspaceLayersGrad)" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="45" width="50" height="70" rx="8" strokeWidth="7" />
      <line x1="38" y1="58" x2="62" y2="58" strokeWidth="6" />
      <rect x="125" y="45" width="50" height="70" rx="8" strokeWidth="7" />
      <line x1="138" y1="58" x2="162" y2="58" strokeWidth="6" />
      <path 
        d="M 60 20 H 140 a 12 12 0 0 1 12 12 v 60 a 12 12 0 0 1 -12 12 H 72 a 12 12 0 0 0 -12 12 v 52 a 12 12 0 0 0 12 12 H 140 a 12 12 0 0 0 12 -12 v -25" 
        strokeWidth="7" 
      />
      <line x1="75" y1="33" x2="125" y2="33" strokeWidth="6" />
    </g>
  </svg>
);