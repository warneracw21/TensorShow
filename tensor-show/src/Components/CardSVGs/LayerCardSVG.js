/////////////////////////////////////////////////
// Layer Card SVG
/////////////////////////////////////////////////
import React from 'react';

/////////////////////////////////////////////////
// LayerCardSVG
/////////////////////////////////////////////////
export default function LayerCardSVG(params) {

  /////////////////////////////////////////////////
  // Calculate Parameters for SVG
  /////////////////////////////////////////////////
  const layerName = params.layerName;
  const layerType = params.layerType;
  const inputShape = params.inputShape;
  const outputShape = params.outputShape;

  /////////////////////////////////////////////////
  // Methods used in SVG
  /////////////////////////////////////////////////
  const addChild = params.addChild;
  const editLayer = params.editLayer;

  return (
    <svg width="210px" height="210px" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
          <linearGradient x1="47.0796717%" y1="83.3533249%" x2="27.04726%" y2="185.215584%" id="linearGradient-1">
              <stop stopColor="#FFFFFF" offset="0%"></stop>
              <stop stopColor="#000000" offset="100%"></stop>
          </linearGradient>
          <path d="M204,174 C204,189.463973 191.463973,202 176,202 L32,202 C16.536027,202 4,189.463973 4,174 L4,2 L204,2 L204,174 Z" id="path-2"></path>
          <filter x="-5.5%" y="-5.5%" width="113.0%" height="113.0%" filterUnits="objectBoundingBox" id="filter-3">
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
      <g id="LayerCard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="LayerCardBase">
              <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
              <use fill="url(#linearGradient-1)" fillRule="evenodd" xlinkHref="#path-2"></use>
          </g>
          <g id="LayerTitleBox">
              <use fill="black" fillOpacity="1" filter="url(#filter-5)" xlinkHref="#path-4"></use>
              <use fillOpacity="0.913625437" fill="#FF8105" fillRule="evenodd" style={{mixBlendMode: "darken"}} xlinkHref="#path-4"></use>
          </g>
          <path d="M121.320755,52 C128.213894,52 133.82228,56.3383345 133.995859,61.7418955 L134,62 L134,73 L70,73 L70,62 C70,56.4771525 75.6766915,52 82.6792453,52 L121.320755,52 Z" id="EditButton" onClick={(event) => editLayer(event, params.sender_pos)} fillOpacity="0.4" fill="#000000"></path>
          <text id="EditLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="8" fontWeight="bold" fill="#000000">
            <tspan x="82" y="66">Edit Layer</tspan>
          </text>
          <text id="LayerTitle" fontFamily="Helvetica-Bold, Helvetica" fontSize="20" fontWeight="bold" fill="#F6EEEA">
              <tspan x="44.8007812" y="27">{layerName}</tspan>
          </text>
          <rect id="InfoLabelBox" x="12" y="83" width="61" height="83"></rect>
          <rect id="InfoTextBox" x="75" y="83" width="119" height="83"></rect>
          <text id="LayerTypeLabe;" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="48.61" y="99">Type</tspan>
          </text>
          <text id="InputShapeLabel" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="18.53" y="127">Input Shape</tspan>
          </text>
          <text id="OutputShapeLabel" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="10.75" y="155">Output Shape</tspan>
          </text>
          <line x1="82" y1="166" x2="82" y2="83" id="InfoDivider" stroke="#979797"></line>
          <text id="LayerTypeText" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="87" y="93">{layerType}</tspan>
          </text>
          <text id="InputShapeText" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="87" y="123">{inputShape}</tspan>
          </text>
          <text id="OutputShapeText" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="87" y="151">{outputShape}</tspan>
          </text>
          {(addChild !== undefined) ? (
            <g>
              <path d="M142.858491,176 C157.848332,176 170,181.596441 170,188.5 C170,188.667706 169.992829,188.834641 169.97862,189.000742 L170,189 L170,202 L33,202 L33,189 L33.0213798,189.000742 C33.0071711,188.834641 33,188.667706 33,188.5 C33,181.596441 45.1516677,176 60.1415094,176 L142.858491,176 Z" id="Toolbar" fillOpacity="0.4" fill="#000000" onClick={(event) => addChild(event, params.sender_pos)}></path>
              <text id="AddLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#FFFFFF" fillOpacity="0.734238418">
              <tspan x="75" y="191">Add Layer</tspan>
              </text>
            </g>): <g/>}

        
      </g>
    </svg>
  )
}
