import {
  GENDER_OPTIONS,
  AGE_RANGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  PROFESSION_OPTIONS,
  ChipGroup,
} from './DemographicSelectors.jsx';
import { HumourToggle } from './HumourToggle.jsx';

/**
 * Renders the accessible input form with glassmorphism styling
 * and the specific layout defined in the wireframes.
 */
export function InputForm({ formData, onFieldChange, onSubmit, isLoading }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Name row */}
      <div>
        <label htmlFor="prospect-name" className="sr-only">Prospect Name</label>
        <input
          type="text"
          id="prospect-name"
          name="prospect-name"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          disabled={isLoading}
          placeholder="Name"
          className="w-full rounded-2xl px-6 py-4 text-center font-light font-subheading text-gray-800 placeholder-gray-400 glass-input"
        />
      </div>

      {/* Main Grid: Info + Goal (Left) | Selectors (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column (Info & Goal) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="prospect-info" className="sr-only">Prospect information</label>
            <textarea
              id="prospect-info"
              name="prospect-info"
              rows={8}
              value={formData.prospectInfo}
              onChange={(e) => onFieldChange('prospectInfo', e.target.value)}
              disabled={isLoading}
              placeholder="Prospect Info"
              className="w-full h-full rounded-2xl px-6 py-4 text-center align-middle font-light font-subheading text-gray-800 placeholder-gray-400 glass-input resize-none flex items-center justify-center"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="outreach-intent" className="sr-only">Your outreach goal</label>
            <textarea
              id="outreach-intent"
              name="outreach-intent"
              rows={5}
              value={formData.intent}
              onChange={(e) => onFieldChange('intent', e.target.value)}
              disabled={isLoading}
              placeholder="Outreach Goal"
              className="w-full h-full rounded-2xl px-6 py-4 text-center font-light font-subheading text-gray-800 placeholder-gray-400 glass-input resize-none"
            />
          </div>
        </div>

        {/* Right Column (Demographic Selectors) */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
            <ChipGroup
              label="gender selection"
              name="gender"
              options={GENDER_OPTIONS}
              selected={formData.gender}
              onChange={(value) => onFieldChange('gender', value)}
            />
          </div>
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
            <ChipGroup
              label="age range selection"
              name="ageRange"
              options={AGE_RANGE_OPTIONS}
              selected={formData.ageRange}
              onChange={(value) => onFieldChange('ageRange', value)}
            />
          </div>
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
            <ChipGroup
              label="marital status selection"
              name="maritalStatus"
              options={MARITAL_STATUS_OPTIONS}
              selected={formData.maritalStatus}
              onChange={(value) => onFieldChange('maritalStatus', value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Country, Profession, Witty Hook */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="country-select" className="sr-only">Country</label>
          <select
            id="country-select"
            name="country"
            value={formData.country ?? ''}
            onChange={(e) => onFieldChange('country', e.target.value || null)}
            className="w-full rounded-full px-6 py-3 text-center font-light font-subheading text-gray-800 glass-input appearance-none"
          >
            <option value="">country</option>
            {COUNTRY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="profession-select" className="sr-only">Profession</label>
          <select
            id="profession-select"
            name="profession"
            value={formData.profession ?? ''}
            onChange={(e) => onFieldChange('profession', e.target.value || null)}
            className="w-full rounded-full px-6 py-3 text-center font-light font-subheading text-gray-800 glass-input appearance-none"
          >
            <option value="">profession</option>
            {PROFESSION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center">
          <HumourToggle
            humour={formData.humour}
            onToggle={() => onFieldChange('humour', !formData.humour)}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading}
          aria-busy={isLoading}
          className="liquid-button rounded-full bg-white/40 px-12 py-4 text-sm tracking-widest font-bold font-subheading text-gray-900 shadow-md border border-white/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase z-0"
        >
          <span className="relative z-10">{isLoading ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>
    </form>
  );
}
