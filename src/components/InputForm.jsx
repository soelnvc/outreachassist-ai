import { DemographicSelectors } from './DemographicSelectors.jsx';
import { HumourToggle } from './HumourToggle.jsx';

/**
 * Renders the accessible input form with prospect textarea,
 * demographic selectors, humour toggle, and submit button.
 * Contains zero business logic — all state and handlers come from props.
 *
 * @param {Object} props
 * @param {Object} props.formData - The current form state object
 * @param {Function} props.onFieldChange - Callback receiving (fieldName, value)
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Whether a request is in progress
 * @returns {JSX.Element}
 */
export function InputForm({ formData, onFieldChange, onSubmit, isLoading }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="prospect-info"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Prospect information
        </label>
        <textarea
          id="prospect-info"
          name="prospect-info"
          rows={5}
          value={formData.prospectInfo}
          onChange={(e) => onFieldChange('prospectInfo', e.target.value)}
          disabled={isLoading}
          placeholder="Paste LinkedIn bio, company about page, recent post, job title — anything about the prospect..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="outreach-intent"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your outreach goal <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="outreach-intent"
          name="outreach-intent"
          rows={3}
          value={formData.intent}
          onChange={(e) => onFieldChange('intent', e.target.value)}
          disabled={isLoading}
          placeholder="What's the reason for reaching out? E.g., selling a product, recruiting, inviting to an event, networking..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <DemographicSelectors
        gender={formData.gender}
        ageRange={formData.ageRange}
        country={formData.country}
        profession={formData.profession}
        maritalStatus={formData.maritalStatus}
        onFieldChange={onFieldChange}
      />

      <HumourToggle
        humour={formData.humour}
        onToggle={() => onFieldChange('humour', !formData.humour)}
      />

      <button
        type="submit"
        disabled={isLoading}
        aria-disabled={isLoading}
        aria-busy={isLoading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate personalised message'}
      </button>
    </form>
  );
}
