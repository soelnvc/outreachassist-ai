import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import {
  COMPANY_SIZE_OPTIONS,
  OUTREACH_CHANNEL_OPTIONS,
  TONE_OPTIONS,
  INDUSTRY_OPTIONS,
  BUYER_PERSONA_OPTIONS,
  ChipGroup,
} from './SalesSelectors.jsx';
import { HumourToggle } from './HumourToggle.jsx';

const BUTTON_HOVER = { scale: 1.05, y: -2 };
const BUTTON_TAP = { scale: 0.95 };

/**
 * Renders the accessible input form with glassmorphism styling
 * for B2B Sales oriented outreach.
 *
 * @param {Object} props
 * @param {Object} props.formData - Current form state
 * @param {Function} props.onFieldChange - Callback to update a form field
 * @param {Function} props.onSubmit - Callback to trigger form submission
 * @param {boolean} props.isLoading - Whether a generation request is in progress
 * @returns {JSX.Element}
 */
export function InputForm({ formData, onFieldChange, onSubmit, isLoading }) {
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit();
  }, [onSubmit]);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Name row */}
      <div>
        <label htmlFor="prospect-name" className="sr-only">Prospect Name and Job Title</label>
        <input
          type="text"
          id="prospect-name"
          name="prospect-name"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          disabled={isLoading}
          placeholder="Who are we reaching out to? (e.g. Alex Graham, VP of Sales)"
          className="w-full rounded-2xl px-6 py-4 text-center font-light font-subheading text-gray-800 placeholder-gray-500 glass-input transition-all focus:placeholder-transparent"
        />
      </div>

      {/* Main Grid: Info + Goal (Left) | Selectors (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column (Info & Goal) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex-1 min-h-[200px]">
            <label htmlFor="prospect-info" className="sr-only">Company Context and Prospect Info (Required)</label>
            <textarea
              id="prospect-info"
              name="prospect-info"
              rows={8}
              value={formData.prospectInfo}
              onChange={(e) => onFieldChange('prospectInfo', e.target.value)}
              disabled={isLoading}
              required
              aria-required="true"
              maxLength={3000}
              placeholder="COMPANY CONTEXT / PROSPECT INFO...&#10;(e.g. Recently raised Series B, hiring a lot of engineers, or their specific pain points)"
              className="w-full h-full rounded-2xl px-6 py-12 text-center align-middle font-light font-subheading text-gray-800 placeholder-gray-500 glass-input resize-none flex items-center justify-center transition-all focus:placeholder-transparent"
            />
          </div>
          <div className="flex-1 min-h-[140px]">
            <label htmlFor="outreach-intent" className="sr-only">Value Proposition and Call to Action</label>
            <textarea
              id="outreach-intent"
              name="outreach-intent"
              rows={5}
              value={formData.intent}
              onChange={(e) => onFieldChange('intent', e.target.value)}
              disabled={isLoading}
              maxLength={500}
              placeholder="VALUE PROPOSITION & ASK...&#10;(e.g. Reduce cloud costs by 30%. Goal: Schedule a 15-min discovery call)"
              className="w-full h-full rounded-2xl px-6 py-8 text-center font-light font-subheading text-gray-800 placeholder-gray-500 glass-input resize-none transition-all focus:placeholder-transparent"
            />
          </div>
        </div>

        {/* Right Column (Firmographic Selectors) */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
            <ChipGroup
              label="OUTREACH CHANNEL"
              name="outreachChannel"
              options={OUTREACH_CHANNEL_OPTIONS}
              selected={formData.outreachChannel}
              onChange={(value) => onFieldChange('outreachChannel', value)}
            />
          </div>
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
            <ChipGroup
              label="COMPANY SIZE"
              name="companySize"
              options={COMPANY_SIZE_OPTIONS}
              selected={formData.companySize}
              onChange={(value) => onFieldChange('companySize', value)}
            />
          </div>
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
            <ChipGroup
              label="TONE"
              name="tone"
              options={TONE_OPTIONS}
              selected={formData.tone}
              onChange={(value) => onFieldChange('tone', value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Industry, Buyer Persona, Witty Hook */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <label htmlFor="industry-select" className="sr-only">Industry (Optional)</label>
          <select
            id="industry-select"
            name="industry"
            value={formData.industry ?? ''}
            onChange={(e) => onFieldChange('industry', e.target.value || null)}
            className="w-full rounded-full px-6 py-3 text-center font-light font-subheading text-gray-800 glass-input appearance-none cursor-pointer"
          >
            <option value="">SELECT INDUSTRY (OPTIONAL)</option>
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label htmlFor="persona-select" className="sr-only">Buyer Persona (Optional)</label>
          <select
            id="persona-select"
            name="buyerPersona"
            value={formData.buyerPersona ?? ''}
            onChange={(e) => onFieldChange('buyerPersona', e.target.value || null)}
            className="w-full rounded-full px-6 py-3 text-center font-light font-subheading text-gray-800 glass-input appearance-none cursor-pointer"
          >
            <option value="">BUYER PERSONA (OPTIONAL)</option>
            {BUYER_PERSONA_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center">
          <HumourToggle
            isHumourEnabled={formData.humour}
            onToggle={() => onFieldChange('humour', !formData.humour)}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <motion.button
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading}
          aria-busy={isLoading}
          aria-label={isLoading ? 'Generating personalised message...' : 'Generate personalised message'}
          whileHover={!isLoading ? BUTTON_HOVER : {}}
          whileTap={!isLoading ? BUTTON_TAP : {}}
          className="liquid-button rounded-full bg-white/40 px-16 py-4 text-sm tracking-[0.2em] font-semibold font-subheading text-gray-900 shadow-md border border-white/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase z-0 flex items-center gap-3"
        >
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              aria-hidden="true"
            >
              <FiLoader size={18} />
            </motion.div>
          )}
          <span className="relative z-10">{isLoading ? 'Generating...' : 'Generate'}</span>
        </motion.button>
      </div>
    </form>
  );
}
