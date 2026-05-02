export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
export const AGE_RANGE_OPTIONS = ['18–25', '26–35', '36–45', '45+'];
export const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Parent', 'Skip'];
export const COUNTRY_OPTIONS = [
  'United States',
  'India',
  'United Kingdom',
  'Germany',
  'Singapore',
  'Other',
];
export const PROFESSION_OPTIONS = [
  'Founder/CEO',
  'Head of Growth',
  'Sales Leader',
  'Product Manager',
  'Engineer',
  'Marketing',
  'Other',
];

/**
 * Renders accessible demographic selectors: chip groups for gender, age range,
 * and marital status; dropdown selects for country and profession.
 *
 * @param {Object} props - Component props with gender, ageRange, country, profession, maritalStatus, onFieldChange
 * @returns {JSX.Element}
 */
export function DemographicSelectors({
  gender,
  ageRange,
  country,
  profession,
  maritalStatus,
  onFieldChange,
}) {
  return (
    <div className="space-y-5">
      <ChipGroup
        label="Gender"
        name="gender"
        options={GENDER_OPTIONS}
        selected={gender}
        onChange={(value) => onFieldChange('gender', value)}
      />

      <ChipGroup
        label="Age Range"
        name="ageRange"
        options={AGE_RANGE_OPTIONS}
        selected={ageRange}
        onChange={(value) => onFieldChange('ageRange', value)}
      />

      <div>
        <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-gray-400">(optional)</span>
        </label>
        <select
          id="country-select"
          name="country"
          value={country ?? ''}
          onChange={(e) => onFieldChange('country', e.target.value || null)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
        >
          <option value="">Select country</option>
          {COUNTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="profession-select" className="block text-sm font-medium text-gray-700 mb-1">
          Profession <span className="text-gray-400">(optional)</span>
        </label>
        <select
          id="profession-select"
          name="profession"
          value={profession ?? ''}
          onChange={(e) => onFieldChange('profession', e.target.value || null)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
        >
          <option value="">Select profession</option>
          {PROFESSION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <ChipGroup
        label="Marital Status"
        name="maritalStatus"
        options={MARITAL_STATUS_OPTIONS}
        selected={maritalStatus}
        onChange={(value) => onFieldChange('maritalStatus', value)}
        optional
      />
    </div>
  );
}

/**
 * Renders an accessible chip group as radio inputs styled as chips.
 * Each option is a visually hidden radio input with a visible label.
 *
 * @param {Object} props
 * @param {string} props.label - The group label text
 * @param {string} props.name - The radio group name attribute
 * @param {string[]} props.options - Array of option values
 * @param {string|null} props.selected - Currently selected value
 * @param {Function} props.onChange - Callback receiving the selected value
 * @param {boolean} [props.optional=false] - Whether to show "(optional)" hint
 * @returns {JSX.Element}
 */
import { motion } from 'framer-motion';

export function ChipGroup({ label, name, options, selected, onChange, optional = false }) {
  const legendId = `${name}-label`;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <div id={legendId} className="text-sm font-light font-subheading text-gray-800 text-center uppercase tracking-wider">
        {label}
      </div>
      <div role="group" aria-labelledby={legendId} className="flex flex-wrap justify-center gap-2">
        {options.map((option) => (
          <motion.label
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-light font-subheading cursor-pointer border transition-colors duration-500 ${
              selected === option
                ? 'bg-gradient-to-r from-[#E9D9FA] to-[#F1C5F0] text-gray-900 border-white shadow-sm ring-1 ring-white/20'
                : 'bg-white/40 text-gray-700 border-white/60 hover:bg-white/60'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <motion.span
              animate={{
                fontWeight: selected === option ? 600 : 300,
              }}
              transition={{ duration: 0.5 }}
            >
              {option}
            </motion.span>
          </motion.label>
        ))}
      </div>
    </div>
  );
}
