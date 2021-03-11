import React from 'react';
import style from './Launch.module.scss';

interface LaunchLogoProps {
  isNotAnimated?: boolean;
}

const Launch = (props: LaunchLogoProps) => {
  const { isNotAnimated } = props;
  return (
    <svg
      width='108'
      height='108'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 108 108'
      version='1.1'
      className={`${style.launch} ${!isNotAnimated ? '' : style.notAnimated}`}
    >
      <defs>
        <clipPath id='right_crescent_mask'>
          <path
            className={style.right_crescent_mask_path}
            opacity='1'
            fill='#f0f'
            stroke='none'
            d='M54-9.553h54v125.768H54z'
          />
        </clipPath>
        <clipPath id='right_rear_hemi_mask'>
          <path
            className={style.right_rear_hemi_mask_path}
            opacity='1'
            fill='#f0f'
            stroke='none'
            d='M54-9.553h54v125.768H54z'
          />
        </clipPath>
        <clipPath id='outside_clip_mask'>
          <circle
            id='outside_clip_circle'
            cy='53.795'
            cx='54.043'
            r='53.92'
            opacity='1'
            fill='#f0f'
            stroke='none'
          />
        </clipPath>
      </defs>
      <g className={style.whole_logo_group} clipPath='url(#outside_clip_mask)'>
        <path
          id='right_rear_hemi'
          clipPath='url(#right_rear_hemi_mask)'
          d='M54.044-.125v107.84a53.92 53.92 0 0053.919-53.919A53.92 53.92 0 0054.044-.124z'
          fill='currentColor'
          stroke='none'
        />
        <path
          id='front_crescent'
          clipPath='url(#right_crescent_mask)'
          d='M54.042-.125v11.927a41.994 41.994 0 01.002 0 41.994 41.994 0 0141.994 41.994 41.994 41.994 0 01-41.994 41.992 41.994 41.994 0 01-.002 0v11.927a53.92 53.92 0 00.002 0 53.92 53.92 0 0053.919-53.919A53.92 53.92 0 0054.044-.124a53.92 53.92 0 00-.002 0z'
          fill='currentColor'
          stroke='none'
        />
        <g
          id='branches_group'
          fill='none'
          stroke='currentColor'
          strokeWidth='11.982'
          strokeLinecap='butt'
          strokeLinejoin='miter'
          strokeMiterlimit='4'
          strokeDasharray='none'
          strokeOpacity='1'
          markerStart='none'
          markerMid='none'
          markerEnd='none'
        >
          <path
            className={style.branch001_left}
            d='M58.635 49.087L39.621 68.542'
            strokeDasharray='40'
            strokeDashoffset='40'
          />
          <path
            className={style.branch001_right}
            d='M58.635 58.516L39.621 39.061'
            strokeDasharray='40'
            strokeDashoffset='40'
          />
          <path
            className={style.branch002_left_A}
            d='M41.296 64.613L40.38 90.12'
            strokeDasharray='40'
            strokeDashoffset='40'
          />
          <path
            className={style.branch002_left_B}
            d='M43.785 66.696l-25.858.555'
            strokeDasharray='40'
            strokeDashoffset='40'
          />
          <path
            className={style.branch002_right_A}
            d='M43.785 40.907l-25.858-.555'
            strokeDasharray='40'
            strokeDashoffset='40'
          />
          <path
            className={style.branch002_right_B}
            d='M41.296 42.99l-.916-25.509'
            strokeDasharray='40'
            strokeDashoffset='40'
          />
          <path
            className={style.branch003_left_A}
            d='M40.159 87.883l7.947 23.092'
            strokeDasharray='35'
            strokeDashoffset='35'
          />
          <path
            className={style.branch003_left_B}
            d='M43.575 85.028L18.906 97.85'
            strokeDasharray='30'
            strokeDashoffset='30'
          />
          <path
            className={style.branch003_left_C}
            d='M23.136 63.977L9.684 89.27'
            strokeDasharray='30'
            strokeDashoffset='30'
          />
          <path
            className={style.branch003_left_D}
            d='M20.047 67.555L-3.96 59.53'
            strokeDasharray='35'
            strokeDashoffset='35'
          />
          <path
            className={style.branch003_right_A}
            d='M20.047 40.048L-3.96 48.072'
            strokeDasharray='35'
            strokeDashoffset='35'
          />
          <path
            className={style.branch003_right_B}
            d='M23.136 43.625L9.684 18.334'
            strokeDasharray='30'
            strokeDashoffset='30'
          />
          <path
            className={style.branch003_right_C}
            d='M43.575 22.575L18.906 9.752'
            strokeDasharray='30'
            strokeDashoffset='30'
          />
          <path
            className={style.branch003_right_D}
            d='M40.159 19.72l7.947-23.092'
            strokeDasharray='35'
            strokeDashoffset='35'
          />
        </g>
      </g>
    </svg>
  );
};

export default Launch;
