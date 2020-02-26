import React from 'react';

export default function LayerCardSVG(params) {

  // Extract Layer Card Information
  const transformation = () => {
    return `translate(${params.x}, ${params.y})`
  }

  const layerName = params.layerName;
  const layerType = params.layerType;
  const inputShape = params.inputShape;
  const outputShape = params.outputShape;

  // Get Button Methods
  const onMouseOverRivet = params.onMouseOverRivet;
  const onMouseClickRivet = params.onMouseClickRivet;


  return (
    <svg width="208px" height="203px" viewBox="0 0 208 203" transform={transformation()} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
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
          <path d="M122.311321,55 C128.7668,55 134,58.8055796 134,63.5 C134,63.6679966 133.993298,63.8348548 133.980078,64.0004411 L134,64 L134,73 L75,73 L75,64 L75.0199222,64.0004411 C75.006702,63.8348548 75,63.6679966 75,63.5 C75,58.8055796 80.2332,55 86.6886792,55 L122.311321,55 Z" id="Toolbar" fillOpacity="0.4" fill="#000000"></path>
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
          <path d="M93.5,60 C100.108722,60 101.879548,64.5571429 101.957464,64.75 C102.014179,64.9117605 102.014179,65.0882395 101.957464,65.25 C101.879548,65.4428571 100.108722,70 93.5,70 L93.1899036,69.9964602 C93.1268936,69.9988131 93.0635854,70 93,70 C92.7395736,70 92.4837975,69.9800898 92.2341108,69.9417085 C86.6611604,69.4078373 85.1152215,65.4299109 85.0425356,65.25 C84.9858215,65.0882395 84.9858215,64.9117605 85.0425356,64.75 C85.1152215,64.5700891 86.6611604,60.5921627 92.2335481,60.0589081 C92.4837975,60.0199102 92.7395736,60 93,60 L93.188739,60.0034134 C93.2912805,60.0011497 93.39503,60 93.5,60 Z M93.1497342,61.4317084 L92.8493909,61.4456829 C92.6945431,61.4539653 92.5431542,61.4651712 92.395156,61.4791181 C90.7115172,61.7660493 89.4285714,63.2332006 89.4285714,65 C89.4285714,66.7667994 90.7115172,68.2339507 92.396629,68.5206744 C92.641513,68.5440272 92.8972654,68.5596882 93.1627275,68.5668912 L93,68.5714286 C94.9724455,68.5714286 96.5714286,66.9724455 96.5714286,65 C96.5714286,64.0527983 96.1951541,63.1443914 95.5253814,62.4746186 C94.8909847,61.840222 94.0424968,61.4691385 93.1497342,61.4317084 Z M97.0191468,62.0249336 L97.0591031,62.0798277 C97.6511914,62.9013972 98,63.9099643 98,65 C98,66.1144092 97.6354181,67.1436656 97.0190216,67.9750021 C99.2362628,67.1269207 100.203638,65.6077886 100.51247,65 C100.203638,64.3922114 99.2362628,62.8730793 97.0191468,62.0249336 Z M88.5191619,62.7789276 L88.4350078,62.835606 C87.2854872,63.6332226 86.7122185,64.5578073 86.4875295,65 C86.7174527,65.4487542 87.3123855,66.4065529 88.5162846,67.2173753 C88.185926,66.5482232 88,65.7958243 88,65 C88,64.2022117 88.1868448,63.4480634 88.5191619,62.7789276 Z" id="View" fill="#FFFFFF" fillRule="nonzero"></path>
          <path d="M121.4388,58.5611997 C122.187067,59.309466 122.187067,60.5226453 121.4388,61.2709116 L112.854713,69.8549989 C112.760364,69.9485822 112.632638,70.0007517 112.499751,70 L110.499963,70 C110.22385,70 110.000008,69.7761496 110.000008,69.5000366 L110.000008,67.5002492 C109.999248,67.3673619 110.051418,67.2396364 110.145001,67.145287 L118.729088,58.5611997 C119.477355,57.8129334 120.690534,57.8129334 121.4388,58.5611997 Z M118.645,60.064 L110.99991,67.7052274 L110.99991,69.0000898 L112.294773,69.0000898 L119.934,61.355 L118.645,60.064 Z M120.083944,59.001116 C119.841139,58.9993896 119.608156,59.096917 119.439013,59.2711242 L119.264,59.446 L120.553,60.736 L120.728876,60.5609871 C120.994041,60.3012093 121.074814,59.906399 120.932978,59.5633544 C120.791142,59.2203098 120.45514,58.9978201 120.083944,59.001116 Z" id="Edit" fill="#FFFFFF" fillRule="nonzero"></path>
          <text id="LayerTypeText" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="87" y="93">{layerType}</tspan>
          </text>
          <text id="InputShapeText" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="87" y="123">{inputShape}</tspan>
          </text>
          <text id="OutputShapeText" fontFamily="Helvetica-Light, Helvetica" fontSize="10" fontWeight="300" fill="#000000">
              <tspan x="87" y="151">{outputShape}</tspan>
          </text>
          <circle id="Oval" fillOpacity="0.539089816" fill="#180000" cx="37" cy="186" r="5"
            onMouseOver={() => onMouseOverRivet({pos: 0, action: 'over', sender: params.sender})}
            onMouseOut={() => onMouseOverRivet({pos: 0, action: 'out', sender: params.sender})}
            onClick={() => onMouseClickRivet({pos: 0, sender: params.sender})}

            ></circle>
          <circle id="Oval" fillOpacity="0.539089816" fill="#000000" cx="82" cy="186" r="5"></circle>
          <circle id="Oval" fillOpacity="0.539089816" fill="#000000" cx="127" cy="186" r="5"></circle>
          <circle id="Oval" fillOpacity="0.539089816" fill="#000000" cx="172" cy="186" r="5"></circle>
      </g>
    </svg>
  )
}
