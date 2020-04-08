/////////////////////////////////////////////////
// Layer Card SVG
/////////////////////////////////////////////////
import React from 'react';

/////////////////////////////////////////////////
// LayerCardSVG
/////////////////////////////////////////////////
export default function LayerCardSVG(params) {

  // Pull Out Information
  const layer_name = params.layer_name;
  const layer_type = params.layer_type;
  
  // Pull out label params
  const parameters = params.params;

  // Pull out methods
  const addChild = params.addChild;
  const editLayer = params.editLayer;

  return (
    <svg width="216px" height="216px" viewBox="0 0 216 216" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <title>LayerCard</title>
        <desc>Created with Sketch.</desc>
        <defs>
            <linearGradient x1="47.0796717%" y1="83.3533249%" x2="27.04726%" y2="185.215584%" id="linearGradient-1">
                <stop stop-color="#FFFFFF" offset="0%"></stop>
                <stop stop-color="#000000" offset="100%"></stop>
            </linearGradient>
            <path d="M206,178 C206,193.463973 193.463973,206 178,206 L34,206 C18.536027,206 6,193.463973 6,178 L6,6 L206,6 L206,178 Z" id="path-2"></path>
            <filter x="-5.5%" y="-5.5%" width="113.0%" height="113.0%" filterUnits="objectBoundingBox" id="filter-3">
                <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
                <feOffset dx="2" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
            <path d="M206,50.4725275 C206,65.123246 190.777681,77 172,77 L40,77 C21.2223185,77 6,65.123246 6,50.4725275 L6,6 L206,6 L206,50.4725275 Z" id="path-4"></path>
            <filter x="-3.5%" y="-7.0%" width="107.0%" height="119.7%" filterUnits="objectBoundingBox" id="filter-5">
                <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
        </defs>
        <g id="LayerCard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="LayerCardBase">
                <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
                <use fill="url(#linearGradient-1)" fillRule="evenodd" xlinkHref="#path-2"></use>
            </g>
            <g id="LayerTitleBox">
                <use fill="black" fillOpacity="1" filter="url(#filter-5)" xlinkHref="#path-4"></use>
                <use fillOpacity="0.913625437" fill="#FF8105" fillRule="evenodd" style={{mixBlendMode: "darken"}} xlinkHref="#path-4"></use>
            </g>
            <text id="LayerTitle" fontFamily="Helvetica-Bold, Helvetica" fontSize="20" fontWeight="bold" fill="#F6EEEA">
                <tspan x="49.8007812" y="30">Layer Name</tspan>
            </text>
            <path d="M61.6926749,180.001675 L144.858491,180 C159.848332,180 172,185.596441 172,192.5 C172,192.667706 171.992829,192.834641 171.97862,193.000742 L172,193 L172,206 L35,206 L35,193 L35.0213798,193.000742 C35.0071711,192.834641 35,192.667706 35,192.5 C35,185.665476 46.9098495,180.11206 61.6926749,180.001675 L61.6926749,180.001675 Z" id="AddLayerButton" fillOpacity="0.4" fill="#000000"></path>
            <text id="AddLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#FFFFFF" fillOpacity="0.734238418">
                <tspan x="77" y="195">Add Layer</tspan>
            </text>
            <path d="M123.320755,56 C130.213894,56 135.82228,60.3383345 135.995859,65.7418955 L136,66 L136,77 L72,77 L72,66 C72,60.4771525 77.6766915,56 84.6792453,56 L123.320755,56 Z" id="EditLayerButton" fillOpacity="0.4" fill="#000000"></path>
            <text id="EditLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="8" fontWeight="bold" fill="#000000">
                <tspan x="84" y="70">Edit Layer</tspan>
            </text>
            <rect id="ParamBox" fill="#D8D8D8" x="13" y="98" width="186" height="69" rx="8"></rect>
            <line x1="89" y1="103" x2="89.5" y2="161.5" id="Line" stroke="#979797" strokeLinecap="square"></line>
            <text id="param1_label" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="22.9794922" y="111">Window Size</tspan>
            </text>
            <text id="param1_value" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="95" y="111">param1_value</tspan>
            </text>
            <text id="param2_value" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="95" y="127">param2_value</tspan>
            </text>
            <text id="param2_label" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="32.8720703" y="127">Stride Size</tspan>
            </text>
            <text id="param3_value" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="95" y="143">param3_value</tspan>
            </text>
            <text id="param3_label" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="35.6601562" y="143">Activation</tspan>
            </text>
            <text id="param4_value" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="95" y="159">param4_value</tspan>
            </text>
            <text id="param4_label" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#4A4A4A">
                <tspan x="15.1035156" y="159">Regularization</tspan>
            </text>
            <text id="LayerNameText" fontFamily="Helvetica-Bold, Helvetica" fontSize="12" fontWeight="bold" fill="#4A4A4A">
                <tspan x="53" y="92">Convolution Layer</tspan>
            </text>
        </g>
    </svg>
  )
}