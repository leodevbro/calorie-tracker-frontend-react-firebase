import React, { ReactNode, useState } from "react";
// import { Link } from "react-router-dom";

import style from "./ButtonWithPopup.module.scss";
// import { useNavigate } from "react-router-dom";

import { SweetPopup } from "src/components/SweetPopup/SweetPopup";

// import { useNavigate } from "react-router-dom";
// import { cla } from "src/App";

// import { useAppSelector } from "src/app/hooks";

export const ButtonWithPopup: React.FC<{
  buttontext: string;
  popTitle: string;
  content?: ReactNode;
  componentLink?: {
    contentFn: React.FC<{ [key: string]: any } | undefined>;
    propsForContent?: { [key: string]: any };
  };
}> = ({ buttontext, popTitle, content, componentLink }) => {
  const [showPop, setShowPop] = useState(false);

  // const navigate = useNavigate();

  return (
    <div className={style.download}>
      <span
        onClick={() => {
          setShowPop((prev) => true);
        }}
      >
        {buttontext}
      </span>
      <SweetPopup
        show={showPop}
        title={popTitle}
        closerFn={() => {
          // console.log("cllllllllllll");
          setShowPop((prev) => false);
        }}
        content={
          content || componentLink?.contentFn({ ...componentLink.propsForContent, setShowPop })
        }
        backButtonShouldClose={false}
        showCloseButton={true}
      />
    </div>
  );
};
