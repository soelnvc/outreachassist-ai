import { useState, useRef, useCallback, useMemo } from 'react';
import { InputForm } from '../../components/InputForm.jsx';
import { OutputCard } from '../../components/OutputCard.jsx';
import { ErrorMessage } from '../../components/ErrorMessage.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { validateProspectInput } from '../../utils/validators.js';
import { buildPersonalizerPrompt } from '../../prompts/index.js';
import { callGemini } from '../../services/gemini.js';
import { parseApiResponse } from '../../utils/parseResponse.js';
import { appendToSheet, getSheetUrl } from '../../services/sheets.js';

/**
 * PersonalizerPage — the main feature page that wires form input to prompt
 * building, Gemini API calls, response parsing, and Google Sheets logging.
 * Owns all application state per Plan.md architecture.
 *
 * @returns {JSX.Element}
 */
export function PersonalizerPage() {
  const [formData, setFormData] = useState({
    prospectInfo: '',
    intent: '',
    gender: null,
    ageRange: null,
    country: null,
    profession: null,
    maritalStatus: null,
    humour: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sheetStatus, setSheetStatus] = useState(null);

  const abortControllerRef = useRef(null);

  const sheetUrl = useMemo(() => getSheetUrl(), []);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCopy = useCallback(() => {
    if (result?.message) {
      navigator.clipboard.writeText(result.message);
    }
  }, [result]);

  const handleSave = useCallback(() => {
    if (!result?.message) return;
    setSheetStatus('saving');
    appendToSheet({ ...formData, message: result.message })
      .then(() => setSheetStatus('saved'))
      .catch(() => setSheetStatus('error'));
  }, [formData, result]);

  const handleSubmit = useCallback(async () => {
    const validation = validateProspectInput(formData);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setResult(null);
    setError(null);
    setSheetStatus(null);
    setIsLoading(true);

    try {
      const prompt = buildPersonalizerPrompt(formData);
      const rawResponse = await callGemini(prompt, abortControllerRef.current.signal);
      const parsed = parseApiResponse(rawResponse);
      setResult(parsed);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            OutreachAI — Message Personalizer
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Generate hyper-personalised cold outreach messages in seconds.
          </p>
        </header>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">Message generator form</h2>
          <InputForm
            formData={formData}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </section>

        <ErrorMessage message={error} />

        {isLoading && (
          <LoadingSpinner message="Crafting your personalised message..." />
        )}

        {result && (
          <OutputCard
            message={result.message}
            onCopy={handleCopy}
            onSave={handleSave}
            sheetStatus={sheetStatus}
            sheetUrl={sheetUrl}
          />
        )}
      </div>
    </main>
  );
}
