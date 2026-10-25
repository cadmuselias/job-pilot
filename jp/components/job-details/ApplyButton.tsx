interface ApplyButtonProps {
  company: string;
  applyUrl?: string | null;
}

export function ApplyButton({ company, applyUrl }: ApplyButtonProps) {
  if (!applyUrl) {
    return (
      <div className="pt-2">
        <button
          type="button"
          disabled
          className="w-full py-3.5 px-6 rounded-xl bg-accent/60 text-white font-medium text-sm sm:text-base text-center cursor-not-allowed shadow-xs block"
        >
          Apply Now at {company} (Link Unavailable)
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-dark text-white font-medium text-sm sm:text-base text-center transition-all shadow-xs active:scale-[0.99] block"
      >
        Apply Now at {company}
      </a>
    </div>
  );
}
