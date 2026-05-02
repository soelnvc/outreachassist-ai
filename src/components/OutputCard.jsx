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
    <article className="glass-panel rounded-2xl p-8 mt-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 text-center">
        Your personalised message
      </h2>

      <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap font-medium text-center">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-white/50">
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy message to clipboard"
          className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/60 px-6 py-2.5 text-sm font-medium text-gray-800 hover:bg-white transition-all shadow-sm"
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
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
        >
          View log
        </a>
      </div>

      {sheetStatus === 'error' && (
        <p className="text-sm text-red-500 mt-4 text-center font-medium">
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
      className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all shadow-sm ${
        isSaved
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-gradient-to-r from-[#E9D9FA] to-[#F1C5F0] text-gray-900 border border-white/60 hover:shadow-md disabled:opacity-50'
      }`}
    >
      {buttonText}
    </button>
  );
}
