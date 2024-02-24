import React, { useEffect, useRef } from 'react'
import styles from './MatchOption.module.css';
import { Content } from "@/app/utils/content-utils";
import classNames from "classnames";

type MatchOptionProps = {
  content: Content,
  attr: string,
  focused: boolean,
  handleClick: (e:React.MouseEvent) => void,
}

// TODO: change attr to something else
const MatchOption = ({content, attr, focused, handleClick}: MatchOptionProps) => {

  const matchOptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let curRef = matchOptionRef.current
    if (curRef) {
      const hasOverflow = curRef.scrollHeight > curRef.clientHeight;
      curRef.style.justifyContent = hasOverflow ? "start" : "center";
    }
  }, [content])

  return (
    <div
      className={classNames(styles.matchOption, focused && styles.focused)}
      ref={matchOptionRef}
      data-test="matchOption"
      onMouseUp={(e) => {handleClick(e)}}
    >
      {content[attr]}
    </div>
  )
}

export default MatchOption