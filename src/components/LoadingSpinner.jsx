/**
 * Renders an accessible loading spinner with screen reader announcements.
 * Uses role="status" and aria-busy for assistive technology support.
 *
 * @param {Object} props
 * @param {string} [props.message='Loading...'] - Descriptive loading message
 * @returns {JSX.Element}
 */
export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
      className="flex flex-col items-center justify-center py-8 gap-3"
    >
      <span aria-hidden="true" className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <span className="sr-only">{message}</span>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
