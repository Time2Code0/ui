import { ChartNav } from "./chart-nav";

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 pt-8 pb-8 md:gap-12 md:pt-12">
      <section>
        <ChartNav />
      </section>
      {children}
    </div>
  );
}
