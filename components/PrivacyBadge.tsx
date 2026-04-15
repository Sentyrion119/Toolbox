export default function PrivacyBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs text-neutral-500 border border-neutral-800 px-3 py-1.5">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {text}
    </div>
  );
}
