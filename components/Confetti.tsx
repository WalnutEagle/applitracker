import React from 'react';

const CONFETTI_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    return <div className="confetti-piece" style={style}></div>;
};

const Confetti: React.FC = () => {
    const pieces = Array.from({ length: 100 }).map((_, index) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            animationDelay: `${Math.random() * 4}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${Math.floor(Math.random() * 5) + 5}px`,
            height: `${Math.floor(Math.random() * 10) + 10}px`,
        };
        return <ConfettiPiece key={index} style={style} />;
    });

    return <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-50">{pieces}</div>;
};

export default Confetti;
