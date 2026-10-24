import { Building2, SearchX } from "lucide-react";
import type { MockJob } from "./mock-data";

interface JobsTableProps {
  jobs: MockJob[];
  pagination?: React.ReactNode;
}

export function JobsTable({ jobs, pagination }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-3 text-text-muted">
          <SearchX className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          No matching jobs found
        </h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Try adjusting your search criteria or changing the match threshold filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Match Score
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Salary Est.
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold tracking-wider text-text-secondary uppercase"
              >
                Date Found
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => {
              // Color coding logic matching find-jobs.png design:
              // 90%+: Green (bg-success)
              // 80-89%: Blue (bg-info-medium)
              // 70-79%: Orange (bg-warning)
              // <70%: Muted
              let progressColor = "bg-text-muted";
              if (job.match_score >= 90) {
                progressColor = "bg-success";
              } else if (job.match_score >= 80) {
                progressColor = "bg-info-medium";
              } else if (job.match_score >= 70) {
                progressColor = "bg-warning";
              }

              return (
                <tr
                  key={job.id}
                  className="hover:bg-surface-secondary/60 transition-colors"
                >
                  {/* Company */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-secondary border border-border-light flex items-center justify-center text-text-secondary shrink-0">
                        <Building2 className="w-4 h-4 text-text-secondary" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-semibold text-text-primary">
                        {job.company}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {job.title}
                  </td>

                  {/* Match Score */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1.5 bg-border-light rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                          style={{ width: `${Math.min(Math.max(job.match_score, 0), 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-text-primary min-w-[36px]">
                        {job.match_score}%
                      </span>
                    </div>
                  </td>

                  {/* Salary Estimate */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {job.salary}
                  </td>

                  {/* Date Found */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {job.date_label}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination}
    </div>
  );
}
