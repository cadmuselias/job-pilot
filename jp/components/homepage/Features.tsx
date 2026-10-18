import Image from "next/image";

type FeaturesProps = Record<string, never>;

export function Features({}: FeaturesProps) {
  return (
    <div className="w-full">
      {/* Feature Block 1: Manage Your Job Search With Ease */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col pr-0 lg:pr-8">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-text-primary tracking-tight leading-tight">
                Manage Your Job
                <br />
                Search With Ease
              </h2>

              <div className="mt-8 border-y border-border divide-y divide-border">
                {/* Item 1 - Highlighted */}
                <div className="py-5 pl-5 border-l-2 border-accent -ml-[1px]">
                  <h3 className="text-base font-semibold text-text-primary">
                    Find jobs that actually fit
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Search by title and location or paste a job link. Get matched roles
                    you can quickly scan.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="py-5 pl-5">
                  <h3 className="text-base font-semibold text-text-primary">
                    Know the Company Before You Apply
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Stop guessing what a company is about. JobPilot browses their
                    site and gives you everything you need to apply with confidence.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="py-5 pl-5">
                  <h3 className="text-base font-semibold text-text-primary">
                    Keep track of every application
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Keep a clear view of every job you&apos;ve found, tailored. Your
                    activity and progress all stay in one simple place.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image (Jobs List Table) */}
            <div className="flex justify-center lg:border-l lg:border-border lg:pl-10">
              <div className="w-full max-w-[580px]">
                <Image
                  src="/images/jobs-lists.png"
                  alt="Jobs list preview"
                  width={580}
                  height={420}
                  className="w-full h-auto drop-shadow-sm rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Block 2: Apply With More Confidence, Every Time */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Image (Agent Terminal) */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="w-full max-w-[520px]">
                <Image
                  src="/images/agnet-log.png"
                  alt="JobPilot agent terminal log"
                  width={520}
                  height={380}
                  className="w-full h-auto drop-shadow-lg rounded-2xl"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex flex-col order-1 lg:order-2 pl-0 lg:pl-8">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-text-primary tracking-tight leading-tight">
                Apply With More
                <br />
                Confidence, Every Time
              </h2>

              <div className="mt-8 border-y border-border divide-y divide-border">
                {/* Item 1 */}
                <div className="py-5">
                  <h3 className="text-base font-semibold text-text-primary">
                    Understand your match score
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    See how your profile lines up with each role before you apply.
                    Get a clear breakdown of what fits and what&apos;s missing.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="py-5">
                  <h3 className="text-base font-semibold text-text-primary">
                    AI-Powered Job Matching
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Stop guessing which jobs are worth applying to. JobPilot scores
                    every role against your actual skills so you focus on the ones that
                    matter.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="py-5">
                  <h3 className="text-base font-semibold text-text-primary">
                    Focus on the right roles
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                    Filter out low fit jobs and stay on the ones that actually matter.
                    Spend less time sorting and more time applying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
