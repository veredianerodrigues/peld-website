export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-dark mb-4">{title}</h1>
      {description && (
        <p className="text-neutral-text max-w-2xl">{description}</p>
      )}
    </section>
  );
}
