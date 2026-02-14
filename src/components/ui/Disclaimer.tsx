export function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`px-4 py-3 rounded-lg bg-burgundy/10 border border-burgundy/20 ${className}`}>
      <p className="text-[11px] text-burgundy-light leading-relaxed">
        Content may be offensive. Use responsibly. Not affiliated with any API providers.
      </p>
    </div>
  );
}
