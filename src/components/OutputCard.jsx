/**
 * Renders the generated message output card with copy and save actions.
 * Shows the message in an article element, with accessible buttons for
 * copying to clipboard and saving to Google Sheets.
 *
 * @param {Object} props
 * @param {string} props.message - The generated message text
 * @param {Function} props.onCopy - Callback to copy message to clipboard
 * @param {Function} props.onSave - Callback to save message to Google Sheets
 * @param {string|null} props.sheetStatus - Current Sheets save status (null|'saving'|'saved'|'error')
 * @param {string} props.sheetUrl - URL to the Google Sheet
 * @returns {JSX.Element}
 */
export function OutputCard({ message, onCopy, onSave, sheetStatus, sheetUrl }) {
  return (
    <article className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Your personalised message
      </h2>

      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
        {message}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy message to clipboard"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Copy
        </button>

        <SaveButton
          onSave={onSave}
          sheetStatus={sheetStatus}
        />

        <a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 underline"
        >
          View log
        </a>
      </div>

      {sheetStatus === 'error' && (
        <p className="text-sm text-amber-700 mt-2">
          Could not save to Sheets. Your message is still available above.
        </p>
      )}
    </article>
  );
}

/**
 * Renders the save-to-sheets button with loading and success states.
 *
 * @param {Object} props
 * @param {Function} props.onSave - Callback to trigger save
 * @param {string|null} props.sheetStatus - Current save status
 * @returns {JSX.Element}
 */
function SaveButton({ onSave, sheetStatus }) {
  const isSaving = sheetStatus === 'saving';
  const isSaved = sheetStatus === 'saved';

  let buttonText = 'Save to Sheets';
  if (isSaving) buttonText = 'Saving...';
  if (isSaved) buttonText = 'Saved ✓';

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={isSaving || isSaved}
      aria-busy={isSaving}
      aria-disabled={isSaving || isSaved}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isSaved
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
      }`}
    >
      {buttonText}
    </button>
  );
}
