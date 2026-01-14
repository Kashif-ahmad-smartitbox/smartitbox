"use client";
import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  FileText,
  DollarSign,
  Award,
  Calendar,
  ExternalLink,
  Filter,
  ChevronDown,
  Users,
  Clock,
  Building,
} from "lucide-react";

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | string;
  summary?: string;
  postedAt?: string;
  externalApplyUrl: string; // Required for external applications
  salary?: string;
  experience?: string;
  tags?: string[];
  urgency?: "Urgent" | "High" | "Normal";
  remote?: boolean;
  featured?: boolean;
};

export type CareersData = {
  heading?: string;
  subheading?: string;
  intro?: string;
  jobs: Job[];
  features?: {
    enableSearch?: boolean;
    enableFilters?: boolean;
    enableSorting?: boolean;
    showPostedDate?: boolean;
    showSalary?: boolean;
    showExperience?: boolean;
    showTags?: boolean;
  };
  stats?: {
    totalJobs?: number;
    departments?: number;
    locations?: number;
  };
};

export type CareerSectionProps = {
  data: CareersData;
  className?: string;
};

function formatDate(date?: string) {
  if (!date) return "";
  try {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return date;
  }
}

function getUrgencyColor(urgency?: string) {
  switch (urgency) {
    case "Urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
}

export default function CareerSection({
  data,
  className = "",
}: CareerSectionProps) {
  const {
    heading = "Join Our Team",
    subheading = "Careers",
    intro = "Discover opportunities that match your skills and ambitions. Grow with us.",
    jobs = [],
    features = {
      enableSearch: true,
      enableFilters: true,
      enableSorting: true,
      showPostedDate: true,
      showSalary: true,
      showExperience: true,
      showTags: true,
    },
    stats = {
      totalJobs: 0,
      departments: 0,
      locations: 0,
    },
  } = data ?? {};

  // State management
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("All");
  const [location, setLocation] = useState<string>("All");
  const [jobType, setJobType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "department">(
    "newest"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Derived data
  const departments = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.department)))],
    [jobs]
  );

  const locations = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.location)))],
    [jobs]
  );

  const jobTypes = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.type)))],
    [jobs]
  );

  const filteredAndSortedJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = jobs.filter((j) => {
      if (department !== "All" && j.department !== department) return false;
      if (location !== "All" && j.location !== location) return false;
      if (jobType !== "All" && j.type !== jobType) return false;
      if (!q) return true;

      const searchText = `${j.title} ${j.summary ?? ""} ${j.department} ${
        j.location
      } ${j.tags?.join(" ") ?? ""} ${j.experience ?? ""}`.toLowerCase();
      return searchText.includes(q);
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.postedAt || 0).getTime() -
            new Date(a.postedAt || 0).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "department":
          return a.department.localeCompare(b.department);
        default:
          return 0;
      }
    });

    return filtered;
  }, [jobs, search, department, location, jobType, sortBy]);

  const featuredJobs = useMemo(
    () => filteredAndSortedJobs.filter((job) => job.featured),
    [filteredAndSortedJobs]
  );

  const regularJobs = useMemo(
    () => filteredAndSortedJobs.filter((job) => !job.featured),
    [filteredAndSortedJobs]
  );

  // Auto-calculated stats if not provided
  const calculatedStats = useMemo(
    () => ({
      totalJobs: stats.totalJobs || jobs.length,
      departments:
        stats.departments || new Set(jobs.map((j) => j.department)).size,
      locations: stats.locations || new Set(jobs.map((j) => j.location)).size,
    }),
    [jobs, stats]
  );

  const handleExternalApply = (job: Job) => {
    window.open(job.externalApplyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className={`py-20 lg:py-28 bg-white ${className}`}
      aria-labelledby="careers-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              {subheading}
            </span>
          </div>

          <h1
            id="careers-heading"
            className="text-4xl md:text-5xl font-bold text-primary-900 mb-4"
          >
            {heading}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-900">
                {calculatedStats.totalJobs}
              </div>
              <div className="text-primary-700 font-medium">Open Positions</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-900">
                {calculatedStats.departments}
              </div>
              <div className="text-primary-700 font-medium">Departments</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-900">
                {calculatedStats.locations}
              </div>
              <div className="text-primary-700 font-medium">Locations</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {features.enableSearch && (
                <div className="flex-1 relative min-w-[300px]">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search roles, skills, keywords..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              )}

              <div className="flex gap-3">
                {features.enableFilters && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={18} />
                    Filters
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {features.enableSorting && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="department">Department</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && features.enableFilters && (
            <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="max-w-6xl mx-auto">
          {/* Featured Jobs */}
          {featuredJobs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">
                Featured Roles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    features={features}
                    onApply={handleExternalApply}
                    isFeatured={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Jobs */}
          <div>
            <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">
              All Open Positions
            </h2>

            {filteredAndSortedJobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="rounded-2xl border-2 border-dashed border-gray-300 p-16 bg-gray-50">
                  <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No positions found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your search or filters to find what
                    you&apos;re looking for.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {regularJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    features={features}
                    onApply={handleExternalApply}
                    isFeatured={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Job Card Component
function JobCard({ job, features, onApply, isFeatured }: any) {
  return (
    <article
      className={`group relative rounded-2xl p-8 bg-white border-2 border-gray-100 hover:border-primary-300 hover:shadow-2xl transition-all duration-500 ${
        isFeatured
          ? "ring-2 ring-primary-200 bg-linear-to-br from-white to-primary-50"
          : ""
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute -top-3 -right-3 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          Featured
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-800 transition-colors">
                {job.title}
              </h3>
              {job.urgency && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                    job.urgency
                  )}`}
                >
                  {job.urgency}
                </span>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-4">
              <span className="inline-flex items-center gap-2">
                <Briefcase size={16} className="text-primary-500" />
                {job.department}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-primary-500" />
                {job.location}
                {job.remote && " • Remote"}
              </span>
              <span className="inline-flex items-center gap-2">
                <FileText size={16} className="text-primary-500" />
                {job.type}
              </span>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {features.showSalary && job.salary && (
                <span className="inline-flex items-center gap-2">
                  <DollarSign size={16} className="text-primary-500" />
                  {job.salary}
                </span>
              )}
              {features.showExperience && job.experience && (
                <span className="inline-flex items-center gap-2">
                  <Award size={16} className="text-primary-500" />
                  {job.experience}
                </span>
              )}
              {features.showPostedDate && job.postedAt && (
                <span className="inline-flex items-center gap-2 ml-auto">
                  <Calendar size={16} className="text-primary-500" />
                  {formatDate(job.postedAt)}
                </span>
              )}
            </div>

            {/* Tags */}
            {features.showTags && job.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-primary-100 text-primary-700 text-sm border border-primary-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            {job.summary && (
              <p className="text-gray-700 leading-relaxed">{job.summary}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={() => onApply(job)}
            className="group/btn inline-flex items-center gap-3 w-full px-6 py-3 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 text-white font-bold hover:from-primary-600 hover:to-primary-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span>Apply Now</span>
            <ExternalLink
              size={18}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
