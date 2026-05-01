/**
 * Renders an accessible error message with role="alert".
 * Returns null if no message is provided.
 *
 * @param {Object} props
 * @param {string|null} props.message - The error message to display
 * @returns {JSX.Element|null}
 */
export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm mt-4"
    >
      {message}
    </p>
  );
}
