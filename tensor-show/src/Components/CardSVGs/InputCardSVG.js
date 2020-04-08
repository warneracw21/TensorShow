/////////////////////////////////////////////////
// Input Card SVG
/////////////////////////////////////////////////
import React from 'react';

/////////////////////////////////////////////////
// InputCardSVG
/////////////////////////////////////////////////
export default function InputCardSVG(params) {

  /////////////////////////////////////////////////
  // Calculate Parameters for SVG
  /////////////////////////////////////////////////
  const dataset_name = params.layer_info.layer_params.dataset_name
  const train_set_shape = params.layer_info.layer_params.train_set_shape
  const test_set_shape = params.layer_info.layer_params.test_set_shape

  /////////////////////////////////////////////////
  // Methods used in SVG
  /////////////////////////////////////////////////
  const addChild = params.addChild

  return (
    <svg x={params.x} y={params.y} width="210px" height="210px" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink">
        
        <title>InputCard</title>
        <defs>
            <linearGradient x1="47.0796717%" y1="83.3533249%" x2="27.04726%" y2="185.215584%" id="linearGradient-1">
                <stop stop-color="#FFFFFF" offset="0%"></stop>
                <stop stop-color="#000000" offset="100%"></stop>
            </linearGradient>
            <path d="M204,174 C204,189.463973 191.463973,202 176,202 L32,202 C16.536027,202 4,189.463973 4,174 L4,2 L204,2 L204,174 Z" id="path-2"></path>
            <filter x="-5.5%" y="-5.5%" width="113.0%" height="113.0%" filterUnits="objectBoundingBox" id="filter-3">
                <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
                <feOffset dx="2" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
            <path d="M204,33.9450549 C204,44.4688105 188.777681,53 170,53 L38,53 C19.2223185,53 4,44.4688105 4,33.9450549 L4,2 L204,2 L204,33.9450549 Z" id="path-4"></path>
            <filter x="-3.5%" y="-9.8%" width="107.0%" height="127.5%" filterUnits="objectBoundingBox" id="filter-5">
                <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
        </defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="LayerCardBase">
                <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
                <use fill="url(#linearGradient-1)" fillRule="evenodd" xlinkHref="#path-2"></use>
            </g>
            <g id="LayerTitleBox">
                <use fill="black" fillOpacity="1" filter="url(#filter-5)" xlinkHref="#path-4"></use>
                <use fillOpacity="0.913625437" fill="#FF8105" fillRule="evenodd" style={{mixBlendMode: "darken"}} xlinkHref="#path-4"></use>
            </g>
            <path d="M142.858491,176 C157.848332,176 170,181.596441 170,188.5 C170,188.667706 169.992829,188.834641 169.97862,189.000742 L170,189 L170,202 L33,202 L33,189 L33.0213798,189.000742 C33.0071711,188.834641 33,188.667706 33,188.5 C33,181.596441 45.1516677,176 60.1415094,176 L142.858491,176 Z" id="Toolbar" fillOpacity="0.4" fill="#000000" onClick={(event) => addChild(event, params.sender_pos)}></path>
            <text id="AddLayerText" fontFamily="Helvetica-Bold, Helvetica" fontSize="10" fontWeight="bold" fill="#FFFFFF" fillOpacity="0.734238418">
                <tspan x="75" y="191">Add Layer</tspan>
            </text>
            <rect id="ChooseDataset" fill="#D8D8D8" x="54" y="58" width="95" height="24" rx="8"></rect>
            <text id="LayerTitle" fontFamily="Helvetica-Bold, Helvetica" fontSize="20" fontWeight="bold" fill="#F6EEEA">
                <tspan x="47.6035156" y="27">Input Layer</tspan>
            </text>
            <text id="Choose-Dataset" fontFamily="Helvetica" fontSize="12" font-weight="normal" fill="#000000">
                <tspan x="58.4746094" y="74">Choose Dataset</tspan>
            </text>
            <text id="LayerTypeLabe;" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
                <tspan x="37.54" y="103">Dataset</tspan>
            </text>
            <text id="InputShapeLabel" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
                <tspan x="10.78" y="133">Train Set Shape</tspan>
            </text>
            <text id="InputShapeLabel" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
                <tspan x="14.3" y="161">Test Set Shape</tspan>
            </text>
            <line x1="84" y1="170" x2="84" y2="87" id="InfoDivider" stroke="#979797"></line>
            <text id="DatasetName" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
                <tspan x="89" y="97">Insert Type Here</tspan>
            </text>
            <text id="TrainSetShape" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
                <tspan x="89" y="127">Insert Input Shape</tspan>
            </text>
            <text id="TestSetShape" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeightt="300" fill="#000000">
                <tspan x="89" y="155">Insert Output Shape </tspan>
            </text>
        </g>
    </svg>
  );
}