/**
 * Renders an accessible humour toggle switch.
 * Uses a checkbox input with a visible label linked via htmlFor.
 *
 * @param {Object} props
 * @param {boolean} props.humour - Whether humour mode is currently enabled
 * @param {Function} props.onToggle - Callback to toggle humour on/off
 * @returns {JSX.Element}
 */
export function HumourToggle({ humour, onToggle }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <label
        htmlFor="humour-toggle"
        className="text-sm font-medium text-gray-700 cursor-pointer select-none"
      >
        Add a witty opening hook
      </label>
      <button
        id="humour-toggle"
        type="button"
        role="switch"
        aria-checked={humour}
        aria-label="Toggle humour mode"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          humour ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            humour ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
