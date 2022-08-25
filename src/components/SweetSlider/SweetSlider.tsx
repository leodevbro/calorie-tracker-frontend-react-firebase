import React, { ReactNode, useMemo } from "react";

// import ReactDOM from "react-dom";

import { cla } from "src/App";
import style from "./SweetSlider.module.scss";

// Core modules imports are same as usual

// Direct React component imports
import { Swiper, SwiperSlide } from "swiper/react";

import {
  // Pagination,
  // Navigation,
  Mousewheel,
  Keyboard,
  FreeMode,
} from "swiper";

// Styles must use direct files imports
// import "swiper/swiper.scss"; // core Swiper
// import "swiper/modules/navigation/navigation.scss"; // Navigation module
// import "swiper/modules/pagination/pagination.scss"; // Pagination module

import "swiper/css";

import { ReactComponent as SvgOfArrowRight } from "src/styling-constants/svg-items/arrow-right-3.svg";

export const SweetSlider: React.FC<{
  className?: string;
  slideItems?: { id: string; el: ReactNode }[];
  classOfSlider?: string;
  classOfSlide?: string;
  classOfGoLeft?: string;
  classOfGoRight?: string;
  leftRightPaddingCss?: string; // clamp(20px, 5%, 96px);
  showPagination?: boolean;
}> = ({
  className,
  slideItems,
  classOfSlider,
  classOfSlide,
  classOfGoLeft,
  classOfGoRight,
  leftRightPaddingCss,
  showPagination = true,
}) => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const modules = useMemo(() => {
    const arr = [
      // Navigation,
      Mousewheel,
      Keyboard,
      FreeMode,
    ];

    return arr;
  }, []);

  return (
    <div className={cla(style.ground, className)}>
      <Swiper
        freeMode={true}
        slidesPerView={"auto"}
        spaceBetween={0}
        slidesPerGroup={1}
        loop={false}
        loopFillGroupWithBlank={true}
        pagination={
          showPagination && {
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${cla(
                className,
                style.bullet,
              )}"><span class=${"inSwiperBullet"}></span></span>`;
            },
          }
        }
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        keyboard={true}
        modules={modules}
        className={cla(style.mySwiper, classOfSlider)}
        style={
          leftRightPaddingCss
            ? { paddingLeft: leftRightPaddingCss, paddingRight: leftRightPaddingCss }
            : undefined
        }
      >
        {slideItems &&
          slideItems.map((item) => {
            return (
              <SwiperSlide key={item.id} className={cla(style.sl, classOfSlide)}>
                {item.el}
              </SwiperSlide>
            );
          })}

        {/* ---------------------- */}

        <div
          ref={navigationPrevRef}
          className={cla(style.goLeft, classOfGoLeft)}
          style={leftRightPaddingCss ? { left: leftRightPaddingCss } : undefined}
        >
          <SvgOfArrowRight className={style.svgOfArrow} />
        </div>

        <div
          ref={navigationNextRef}
          className={cla(style.goRight, classOfGoRight)}
          style={leftRightPaddingCss ? { right: leftRightPaddingCss } : undefined}
        >
          <SvgOfArrowRight className={style.svgOfArrow} />
        </div>
      </Swiper>
    </div>
  );
};
