// Sport background component
export function SportBackground({ sport }) {
    const getSportPattern = () => {
        switch (sport) {
            case 'football':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                        {/* Football field pattern */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-green-700" />
                        {/* Center line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white" />
                        {/* Goal boxes */}
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-48 border-2 border-white" />
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-24 h-48 border-2 border-white" />
                        {/* Horizontal stripes for grass effect */}
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute left-0 right-0 h-8"
                                style={{
                                    top: `${i * 5}%`,
                                    backgroundColor: i % 2 === 0 ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
                                }}
                            />
                        ))}
                        {/* Goal frames */}
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 h-40 w-20 border-2 border-white/70" />
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 h-40 w-20 border-2 border-white/70" />
                        {/* Ball */}
                        <div className="absolute bottom-12 left-20 h-10 w-10 rounded-full border-2 border-white/80" />
                        <div className="absolute bottom-14 left-24 h-6 w-6 rounded-full border border-white/70" />
                        {/* Bold overlay */}
                        <div className="absolute -bottom-8 left-10 text-[12rem] font-black tracking-[0.2em] text-white/10 select-none">
                            FOOTBALL
                        </div>
                        <div className="absolute top-16 right-16 h-40 w-40 rounded-full border-[10px] border-white/20" />
                    </div>
                );

            case 'basketball':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                        {/* Basketball court */}
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-amber-900" />
                        {/* Center line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white" />
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white" />
                        {/* Three-point arcs */}
                        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-64 rounded-l-full border-2 border-white" />
                        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-32 h-64 rounded-r-full border-2 border-white" />
                        {/* Free throw circles */}
                        <div className="absolute top-1/2 left-24 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white" />
                        <div className="absolute top-1/2 right-24 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white" />
                        {/* Bold overlay */}
                        <div className="absolute -bottom-8 left-10 text-[12rem] font-black tracking-[0.2em] text-white/10 select-none">
                            BASKETBALL
                        </div>
                        <div className="absolute top-14 right-20 h-44 w-44 rounded-full border-[10px] border-white/20" />
                    </div>
                );

            case 'cricket':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                        {/* Cricket pitch */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-emerald-900" />
                        {/* Pitch rectangle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-96 bg-yellow-200/20 border-2 border-white" />
                        {/* Wickets */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-20 border-2 border-white" />
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-20 border-2 border-white" />
                        {/* Boundary circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border-2 border-white" />
                        {/* Bat */}
                        <div className="absolute bottom-16 right-24 h-24 w-8 rotate-12 rounded-sm border-2 border-white/70" />
                        <div className="absolute bottom-10 right-20 h-10 w-3 rotate-12 rounded-sm bg-white/60" />
                        {/* Ball */}
                        <div className="absolute bottom-20 right-36 h-8 w-8 rounded-full border-2 border-white/80" />
                        {/* Stumps */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex gap-2">
                            <div className="h-16 w-2 bg-white/70" />
                            <div className="h-16 w-2 bg-white/70" />
                            <div className="h-16 w-2 bg-white/70" />
                        </div>
                        {/* Bold overlay */}
                        <div className="absolute -bottom-8 left-10 text-[12rem] font-black tracking-[0.2em] text-white/10 select-none">
                            CRICKET
                        </div>
                    </div>
                );

            case 'volleyball':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                        {/* Volleyball court */}
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-orange-800" />
                        {/* Center net line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white" />
                        {/* Attack lines */}
                        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white" />
                        <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white" />
                        {/* Court boundaries */}
                        <div className="absolute inset-8 border-2 border-white" />
                        {/* Bold overlay */}
                        <div className="absolute -bottom-8 left-10 text-[12rem] font-black tracking-[0.2em] text-white/10 select-none">
                            VOLLEYBALL
                        </div>
                    </div>
                );

            case 'hockey':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                        {/* Hockey rink */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
                        {/* Center line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/70" />
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-white/70" />
                        {/* Goal creases */}
                        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-16 h-28 rounded-full border-2 border-white/70" />
                        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-16 h-28 rounded-full border-2 border-white/70" />
                        {/* Bold overlay */}
                        <div className="absolute -bottom-8 left-10 text-[12rem] font-black tracking-[0.2em] text-white/10 select-none">
                            HOCKEY
                        </div>
                    </div>
                );

            case 'badminton':
                return (
                    <div className="absolute inset-0 pointer-events-none opacity-15">
                        {/* Badminton court */}
                        <div className="absolute inset-0 bg-gradient-to-b from-teal-900 to-cyan-900" />
                        {/* Center net line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white" />
                        {/* Service courts */}
                        <div className="absolute inset-x-1/4 inset-y-1/4 border-2 border-white" />
                        {/* Outer boundary */}
                        <div className="absolute inset-12 border-2 border-white" />
                        {/* Bold overlay */}
                        <div className="absolute -bottom-8 left-10 text-[12rem] font-black tracking-[0.2em] text-white/10 select-none">
                            BADMINTON
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return getSportPattern();
}
