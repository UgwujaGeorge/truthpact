export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="protocol-label text-cyan-200/70">{eyebrow}</div>
      <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.45rem]">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">{description}</p>
    </div>
  );
}
