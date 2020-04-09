/////////////////////////////////////////////////
// Input Card SVG
/////////////////////////////////////////////////
import React from 'react';

/////////////////////////////////////////////////
// ModelCardSVG
/////////////////////////////////////////////////
export default function ModelCardSVG(params) {

  /////////////////////////////////////////////////
  // Calculate Parameters for SVG
  /////////////////////////////////////////////////

return (
    <svg width="208px" height="138px" viewBox="0 0 208 138" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <title>ModelCard</title>
        <defs>
            <linearGradient x1="47.0796717%" y1="60.0893808%" x2="27.04726%" y2="90.9027142%" id="linearGradient-1">
                <stop stop-color="#FFFFFF" offset="0%"></stop>
                <stop stop-color="#000000" offset="100%"></stop>
            </linearGradient>
            <path d="M204,84 C204,99.463973 191.463973,112 176,112 L32,112 C16.536027,112 4,99.463973 4,84 L4,2 L204,2 L204,84 Z" id="path-2"></path>
            <filter x="-5.5%" y="-10.0%" width="113.0%" height="123.6%" filterUnits="objectBoundingBox" id="filter-3">
                <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
                <feOffset dx="2" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
            <path d="M204,46.4725275 C204,61.123246 188.777681,73 170,73 L38,73 C19.2223185,73 4,61.123246 4,46.4725275 L4,2 L204,2 L204,46.4725275 Z" id="path-4"></path>
            <filter x="-3.5%" y="-7.0%" width="107.0%" height="119.7%" filterUnits="objectBoundingBox" id="filter-5">
                <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
        </defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="LayerCardBase">
                <use fill="black" fill-opacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
                <use fill="url(#linearGradient-1)" fillRule="evenodd" xlinkHref="#path-2"></use>
            </g>
            <g id="LayerTitleBox">
                <use fill="black" fillOpacity="1" filter="url(#filter-5)" xlinkHref="#path-4"></use>
                <use fillOpacity="0.913625437" fill="#FF8105" fillRule="evenodd" style={{mixBlendMode: "darken"}} xlinkHref="#path-4"></use>
            </g>
            <path d="M79.3207547,91 C86.2138936,91 91.8222797,95.3383345 91.9958589,100.741896 L92,101 L92,112 L28,112 L28,101 C28,95.4771525 33.6766915,91 40.6792453,91 L79.3207547,91 Z" id="TrainButton" fill-opacity="0.4" fill="#000000"></path>
            <path d="M168.320755,91 C175.213894,91 180.82228,95.3383345 180.995859,100.741896 L181,101 L181,112 L117,112 L117,101 C117,95.4771525 122.676691,91 129.679245,91 L168.320755,91 Z" id="TestButton" fill-opacity="0.4" fill="#000000"></path>
            <path d="M121.320755,52 C128.213894,52 133.82228,56.3383345 133.995859,61.7418955 L134,62 L134,73 L70,73 L70,62 C70,56.4771525 75.6766915,52 82.6792453,52 L121.320755,52 Z" id="EditButton" fill-opacity="0.4" fill="#000000"></path>
            <text id="EditLayerText" font-family="Helvetica-Bold, Helvetica" font-size="8" font-weight="bold" fill="#000000">
                <tspan x="82" y="66">Edit Model</tspan>
            </text>
            <text id="LayerTitle" font-family="Helvetica-Bold, Helvetica" font-size="20" font-weight="bold" fill="#F6EEEA">
                <tspan x="42.5986328" y="27">Model Name</tspan>
            </text>
            <text id="TrainText" font-family="Helvetica-Bold, Helvetica" font-size="12" font-weight="bold" fill="#F6EEEA">
                <tspan x="45.1591797" y="102">Train</tspan>
            </text>
            <text id="TestText" font-family="Helvetica-Bold, Helvetica" font-size="12" font-weight="bold" fill="#F6EEEA">
                <tspan x="137.605469" y="102">Test</tspan>
            </text>
        </g>
    </svg>
    );
}