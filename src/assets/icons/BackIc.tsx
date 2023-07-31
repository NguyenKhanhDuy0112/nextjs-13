function BackIc(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
      <defs>
        <clipPath id="clip-path">
          <rect width="16" height="16" fill="none" />
        </clipPath>
      </defs>
      <g id="Backward_arrow" data-name="Backward arrow" clip-path="url(#clip-path)">
        <g id="Backward_arrow-2" data-name="Backward arrow">
          <path
            id="Path_10"
            data-name="Path 10"
            d="M8,0,6.545,1.455l5.506,5.506H0V9.039H12.052L6.545,14.545,8,16l8-8Z"
            transform="translate(16 16) rotate(180)"
            fill="#242e52"
          />
        </g>
      </g>
    </svg>
  );
}

export default BackIc;
