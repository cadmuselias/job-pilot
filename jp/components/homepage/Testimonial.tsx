import Image from "next/image";

type TestimonialProps = Record<string, never>;

export function Testimonial({}: TestimonialProps) {
  return (
    <section className="border-t border-b border-border bg-surface py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Category Label */}
        <span className="text-accent text-xs font-semibold tracking-widest uppercase mb-6 inline-block">
          SUCCESS STORIES
        </span>

        {/* Quote */}
        <blockquote className="text-2xl sm:text-3xl md:text-[32px] font-medium text-text-primary leading-snug tracking-tight mb-8">
          &ldquo;I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3 offers
          on the table simultaneously.&rdquo;
        </blockquote>

        {/* Author Info */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/user-icon.png"
            alt="Tom Wilson"
            width={44}
            height={44}
            className="w-11 h-11 rounded-lg object-cover border border-border mb-2.5"
          />
          <span className="text-sm font-semibold text-text-primary">
            Tom Wilson
          </span>
          <span className="text-xs text-text-secondary mt-0.5">
            Junior Developer
          </span>
        </div>
      </div>
    </section>
  );
}
