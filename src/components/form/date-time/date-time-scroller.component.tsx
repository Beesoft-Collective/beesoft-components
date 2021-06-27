import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface DateTimeScrollerProps {
  title: string;
  onTitleClicked?: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
}

export default function DateTimeScroller({ title, onTitleClicked, onMovePrevious, onMoveNext }: DateTimeScrollerProps) {
  return (
    <div className="w-full flex flex-row py-1 px-2">
      <div className="flex-shrink cursor-pointer">
        <button className="focus:outline-none" onClick={onMovePrevious}>
          <FontAwesomeIcon icon={['fas', 'angle-left']} />
        </button>
      </div>
      <div className="flex-grow text-center cursor-pointer" onClick={onTitleClicked}>
        {title}
      </div>
      <div className="flex-shrink cursor-pointer">
        <button className="focus:outline-none" onClick={onMoveNext}>
          <FontAwesomeIcon icon={['fas', 'angle-right']} />
        </button>
      </div>
    </div>
  );
}
