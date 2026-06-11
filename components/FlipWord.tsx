import React, { useEffect, useRef, useState } from 'react';

/**
 * Split-flap "shutter" word in the header. "JAJD" stays static; this word
 * rolls through the trades: each new word drops in from the top and pushes
 * the previous one out the bottom, like a departure-board shutter.
 *
 * Painting leads (it's the core trade), then Siding, Roofing, Pressure
 * Washing and the rest, then it loops back to Construction.
 *
 * The longest word is rendered invisibly to reserve width so the header
 * never shifts as the words change.
 */
const WORDS = ['Construction', 'Painting', 'Siding', 'Roofing', 'Pressure Washing', 'Remodeling', 'Cabinets', 'Decks', 'Commercial'];
const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a), '');
const INTERVAL_MS = 4200;

interface FlipWordProps {
  className?: string;
}

const FlipWord: React.FC<FlipWordProps> = ({ className = '' }) => {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion.current) return;

    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % WORDS.length);
      setCycle(c => c + 1);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const animate = cycle > 0 && !reduceMotion.current;
  const prevWord = WORDS[(index - 1 + WORDS.length) % WORDS.length];
  const currWord = WORDS[index];

  return (
    <span
      className="jajd-flip-word"
      aria-label="Construction, painting, siding, roofing, pressure washing, remodeling, cabinets, decks and commercial work"
    >
      {/* Invisible sizer reserves space for the widest word */}
      <span aria-hidden="true" className="invisible">{LONGEST}</span>

      {/* Outgoing word rolls down and out the bottom */}
      {animate && (
        <span key={`leave-${cycle}`} aria-hidden="true" className={`jajd-leaving ${className}`}>
          {prevWord}
        </span>
      )}

      {/* Incoming word drops in from the top */}
      <span
        key={`enter-${cycle}`}
        aria-hidden="true"
        className={`${animate ? 'jajd-entering' : ''} ${className}`}
      >
        {currWord}
      </span>
    </span>
  );
};

export default FlipWord;
