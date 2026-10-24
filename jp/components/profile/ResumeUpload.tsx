"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  Download,
} from "lucide-react";
import { uploadResume, extractResumeAction, deleteResumeAction, type ExtractedProfileData } from "@/actions/profile";

type ResumeUploadProps = {
  currentResumeUrl?: string | null;
  onFileSelect?: (file: File) => void;
  onUploadSuccess?: (url: string) => void;
  onGenerateClick?: () => void;
  onGenerateSuccess?: (url: string) => void;
  onRemoveSuccess?: () => void;
  onExtractSuccess?: (data: ExtractedProfileData) => void;
};

export function ResumeUpload({
  currentResumeUrl,
  onFileSelect,
  onUploadSuccess,
  onGenerateClick,
  onGenerateSuccess,
  onRemoveSuccess,
  onExtractSuccess,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [activeResumeUrl, setActiveResumeUrl] = useState<string | null>(
    currentResumeUrl ?? null
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    currentResumeUrl ? "Current_Resume.pdf" : null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (file: File) => {
    setUploadError(null);
    setGenerateError(null);
    setGenerateSuccess(false);

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setUploadError("Only PDF files are supported. Please select a valid PDF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    const prevFileName = selectedFileName;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResume(formData);

      if (res.success && res.url) {
        setSelectedFile(file);
        setSelectedFileName(file.name);
        setActiveResumeUrl(res.url);
        onFileSelect?.(file);
        onUploadSuccess?.(res.url);
      } else {
        setSelectedFileName(prevFileName);
        setUploadError(res.error || "Failed to upload resume.");
      }
    } catch (err) {
      console.error("[ResumeUpload] Upload error:", err);
      setSelectedFileName(prevFileName);
      setUploadError("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isUploading || isGenerating) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processUpload(file);
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processUpload(file);
    }
  };

  const handleExtract = async () => {
    setExtractError(null);
    setExtractSuccess(false);
    setGenerateError(null);
    setGenerateSuccess(false);
    setIsExtracting(true);

    try {
      let formData: FormData | undefined;
      if (selectedFile) {
        formData = new FormData();
        formData.append("resume", selectedFile);
      }
      const res = await extractResumeAction(formData);
      if (res.success && res.data) {
        setExtractSuccess(true);
        onExtractSuccess?.(res.data);
      } else {
        setExtractError(res.error || "Failed to extract profile information.");
      }
    } catch (err) {
      console.error("[ResumeUpload] Extraction error:", err);
      setExtractError("An unexpected error occurred during extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateResume = async () => {
    setGenerateError(null);
    setGenerateSuccess(false);
    setUploadError(null);
    setExtractError(null);
    setIsGenerating(true);

    try {
      onGenerateClick?.();

      const res = await fetch("/api/resume/generate", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setGenerateSuccess(true);
        setActiveResumeUrl(data.url);
        setSelectedFileName("Generated_Resume.pdf");
        setSelectedFile(null);
        onGenerateSuccess?.(data.url);
        onUploadSuccess?.(data.url);
      } else {
        setGenerateError(data.error || "Failed to generate resume.");
      }
    } catch (err) {
      console.error("[ResumeUpload] Generation error:", err);
      setGenerateError("An unexpected error occurred while generating resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveResume = async () => {
    setUploadError(null);
    setExtractError(null);
    setGenerateError(null);
    setExtractSuccess(false);
    setGenerateSuccess(false);
    setIsDeleting(true);

    try {
      const res = await deleteResumeAction();
      if (res.success) {
        setSelectedFile(null);
        setSelectedFileName(null);
        setActiveResumeUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onRemoveSuccess?.();
        onUploadSuccess?.("");
      } else {
        setUploadError(res.error || "Failed to remove resume.");
      }
    } catch (err) {
      console.error("[ResumeUpload] Delete error:", err);
      setUploadError("An unexpected error occurred while removing resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!activeResumeUrl) return;
    setIsDownloading(true);

    try {
      const response = await fetch(activeResumeUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      const downloadFilename = selectedFileName
        ? selectedFileName.replace(/\.pdf$/i, "") + ".pdf"
        : "Resume.pdf";
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("[ResumeUpload] Download error, opening in new tab fallback:", err);
      window.open(activeResumeUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSelectResumeClick = () => {
    if (!isUploading && !isExtracting && !isGenerating && !isDeleting && !isDownloading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-text-primary">Resume</h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new
          tailored one from your details below.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative mt-5 border-2 border-dashed rounded-xl py-8 px-6 flex flex-col items-center justify-center text-center transition-colors ${
          isDragging
            ? "border-accent bg-accent-muted/40"
            : "border-border-muted hover:border-accent/40 bg-surface-secondary/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          disabled={isUploading || isExtracting || isGenerating}
          className="hidden"
          id="resume-file-input"
        />

        <div className="w-12 h-12 rounded-full bg-accent-muted flex items-center justify-center text-accent mb-3">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 text-accent" />
          )}
        </div>

        <p className="text-sm font-semibold text-text-primary">
          {isUploading
            ? "Uploading your resume..."
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-text-muted mt-1">
          PDF formatting only. Maximum file size 5MB.
        </p>

        {/* Upload error banner */}
        {uploadError && (
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-error bg-error/10 border border-error/20 px-3.5 py-2 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
            {uploadError.toLowerCase().includes("unauthorized") && (
              <a
                href="/login?returnTo=/profile"
                className="underline font-semibold hover:text-text-primary shrink-0"
              >
                Log in
              </a>
            )}
          </div>
        )}

        {/* Extraction error banner */}
        {extractError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-error bg-error/10 border border-error/20 px-3.5 py-2 rounded-lg max-w-md w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{extractError}</span>
          </div>
        )}

        {/* Extraction success banner */}
        {extractSuccess && !isExtracting && (
          <div className="mt-3 flex items-center gap-2 text-xs text-success bg-success-lightest border border-success-light px-3.5 py-2 rounded-lg max-w-md w-full">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Profile fields populated from resume! Review below and click Save Profile.</span>
          </div>
        )}

        {/* Generation error banner */}
        {generateError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-error bg-error/10 border border-error/20 px-3.5 py-2 rounded-lg max-w-md w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generateError}</span>
          </div>
        )}

        {/* Generation success banner */}
        {generateSuccess && !isGenerating && (
          <div className="mt-3 flex items-center gap-2 text-xs text-success bg-success-lightest border border-success-light px-3.5 py-2 rounded-lg max-w-md w-full">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Resume successfully generated from your profile and saved!</span>
          </div>
        )}

        {/* Selected file confirmation & Extract button */}
        {selectedFileName && !isUploading && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-success bg-success-lightest px-3 py-1.5 rounded-lg border border-success-light">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-[320px]">
                {selectedFileName.startsWith("Generated") ? "Active: " : "Uploaded: "}
                {selectedFileName}
              </span>
              {activeResumeUrl && (
                <>
                  <a
                    href={activeResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-accent hover:underline cursor-pointer font-medium shrink-0"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={isDownloading || isExtracting || isGenerating || isDeleting}
                    className="ml-2 text-accent hover:underline cursor-pointer font-medium shrink-0 inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    <span>Download</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleSelectResumeClick}
                disabled={isDownloading || isExtracting || isGenerating || isDeleting}
                className="ml-2 underline text-text-secondary hover:text-text-primary cursor-pointer shrink-0 disabled:opacity-50"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveResume}
                disabled={isDownloading || isExtracting || isGenerating || isDeleting}
                className="ml-2 underline text-error hover:text-error/80 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>

            {/* Extract from Resume CTA Button (only shown for non-generated resumes or when raw file uploaded) */}
            {(selectedFile || activeResumeUrl) && !selectedFileName?.startsWith("Generated") && (
              <div className="flex flex-col items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={isExtracting || isGenerating || isDeleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing resume with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Extract from Resume</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-text-muted">
                  AI will read your PDF and auto-fill the profile form fields below.
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedFileName && !isUploading && (
          <button
            type="button"
            onClick={handleSelectResumeClick}
            disabled={isGenerating || isDeleting}
            className="mt-4 bg-surface hover:bg-surface-secondary text-text-primary border border-border px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            Select Resume
          </button>
        )}
      </div>

      {/* Generation CTA Row */}
      <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-text-primary block">
            Generate Resume with AI
          </span>
          <span className="text-xs text-text-secondary mt-0.5 block">
            Compiles your saved profile into an ATS-optimized single-page PDF.
          </span>
        </div>
        <button
          type="button"
          onClick={handleGenerateResume}
          disabled={isGenerating || isUploading || isExtracting || isDeleting}
          className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xs inline-flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Polishing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Generate Resume from Profile</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
