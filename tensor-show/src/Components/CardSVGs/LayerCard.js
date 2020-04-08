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
        <defs>
            <linearGradient x1="47.0796717%" y1="83.3533249%" x2="27.04726%" y2="185.215584%" id="linearGradient-1">
                <stop stopColor="#FFFFFF" offset="0%"></stop>
                <stop stopColor="#000000" offset="100%"></stop>
            </linearGradient>
            <path d="M206,178 C206,193.463973 193.463973,206 178,206 L34,206 C18.536027,206 6,193.463973 6,178 L6,6 L206,6 L206,178 Z" id="path-2"></path>
            <filter x="-5.5%" y="-5.5%" width="113.0%" height="113.0%" filterUnits="objectBoundingBox" id="filter-3">
                <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
                <feOffset dx="2" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
            <path d="M200,44.4725275 C200,59.123246 184.777681,71 166,71 L34,71 C15.2223185,71 0,59.123246 0,44.4725275 L0,0 L200,0 L200,44.4725275 Z" id="path-4"></path>
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

            <g id="LayerTitle" transform="translate(0.000000, 0.000000)">
                <g id="LayerTitleBox">
                    <use fill="black" fillOpacity="1" filter="url(#filter-5)" xlinkHref="#path-4"></use>
                    <use fillOpacity="0.913625437" fill="#FF8105" fillRule="evenodd" style={{mixBlendMode: "darken"}} xlinkHref="#path-4"></use>
                </g>
                <text fontFamily="Helvetica-Bold, Helvetica" fontSize="20" fontWeight="bold" fill="#F6EEEA">
                    <tspan x="43.8007812" y="24">{layer_name}</tspan>
                </text>
            </g>

            {(addChild !== undefined) ?
            <g id="AddLayerButton" transform="translate(35.000000, 175.5000000)">
                <path d="M26.6926749,0.00167464287 L109.858491,0 C124.848332,0 137,5.59644063 137,12.5 C137,12.667706 136.992829,12.8346406 136.97862,13.0007423 L137,13 L137,26 L0,26 L0,13 L0.0213798352,13.0007423 C0.00717111765,12.8346406 0,12.667706 0,12.5 C0,5.66547622 11.9098495,0.112059524 26.6926749,0.00167464287 L26.6926749,0.00167464287 Z" fillOpacity="0.4" fill="#000000"></path>
                <text id="AddLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#FFFFFF" fillOpacity="0.734238418">
                    <tspan x="42" y="15">Add Layer</tspan>
                </text>
            </g>: null }

            <g id="EditLayerButton" transform="translate(70, 34.5)" fill="#000000">
                <path d="M51.3207547,0 C58.2138936,0 63.8222797,4.33833454 63.9958589,9.7418955 L64,10 L64,21 L0,21 L0,10 C0,4.4771525 5.67669147,0 12.6792453,0 L51.3207547,0 Z" fillOpacity="0.4"></path>
                <text id="EditLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="8" fontWeight="bold">
                    <tspan x="12" y="14">Edit Layer</tspan>
                </text>
            </g>

            <text id="LayerNameText" fontFamily="Helvetica-Bold, Helvetica" fontSize="12" fontWeight="bold" fill="#4A4A4A">
                <tspan x="53" y="92">{layer_type}</tspan>
            </text>

            {(parameters !== undefined) ?
            <g id="ParamWindow" transform="translate(13.000000, 98.000000)">
                <rect id="ParamBox" fill="#D8D8D8" x="0" y="0" width="186" height="69" rx="8"></rect>
                <line x1="76" y1="5" x2="76.5" y2="63.5" id="Line" stroke="#979797" strokeLinecap="square"></line>
                
                {(parameters[0] !== undefined) ?
                <g id="param1" transform="translate(2.000000, 3.000000)" fill="#4A4A4A" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold">
                    <text id="param1_label">
                        <tspan x="7.97949219" y="10">{parameters[0].label}</tspan>
                    </text>
                    <text id="param1_value">
                        <tspan x="80" y="10">{parameters[0].value}</tspan>
                    </text>
                </g>: <g/>}

                {(parameters[1] !== undefined ) ? 
                <g id="param2" transform="translate(2.000000, 19.000000)" fill="#4A4A4A" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold">
                    <text id="param2_value">
                        <tspan x="80" y="10">{parameters[1].value}</tspan>
                    </text>
                    <text id="param2_label">
                        <tspan x="17.8720703" y="10">{parameters[1].label}</tspan>
                    </text>
                </g>: <g/> }

                {(parameters[2] !== undefined) ?
                <g id="param3" transform="translate(2.000000, 35.000000)" fill="#4A4A4A" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold">
                    <text id="param3_value">
                        <tspan x="80" y="10">{parameters[2].value}</tspan>
                    </text>
                    <text id="param3_label">
                        <tspan x="20.6601562" y="10">{parameters[2].label}</tspan>
                    </text>
                </g>: <g/>}

                {(parameters[3] !== undefined) ?
                <g id="param4" transform="translate(2.000000, 51.000000)" fill="#4A4A4A" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold">
                    <text id="param4_value">
                        <tspan x="80" y="10">{parameters[3].value}</tspan>
                    </text>
                    <text id="param4_label">
                        <tspan x="0.103515625" y="10">{parameters[3].label}</tspan>
                    </text>
                </g>: <g/>}
            </g>: <g/>}
        </g>
    </svg>
  );
}