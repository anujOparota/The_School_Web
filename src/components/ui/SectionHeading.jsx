import AnimatedSection from "./AnimatedSection";

const SectionHeading = ({
  title,
  subtitle,
  children,
  centered = true,
}) => {
  return (
    <AnimatedSection className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
      {children}
    </AnimatedSection>
  );
};

export default SectionHeading;
