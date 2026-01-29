export default function BackgroundPattern() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Dot Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `radial-gradient(var(--text-secondary) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Subtle Gradient Overlay for depth */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-bg opacity-40"
            />
        </div>
    );
}
