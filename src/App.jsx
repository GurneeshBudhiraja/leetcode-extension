import { DsaPage, NotesPage } from './pages/pages.js';
import { OptionBar } from './components/components.js';
import { useState, useEffect } from 'react';
import { getCurrentTab } from './utils/utils.js';

function App() {
  const [aiAvailable, setAiAvailable] = useState(true); // Tracks whether the browser supports the ai features
  const [questionName, setQuestionName] = useState(''); // Current leetcode question the user is on
  const [currentPage, setCurrentPage] = useState('dsa'); // Tracks the current menu option selected

  // Pages supported by the extension
  const pages = {
    dsa: (
      <DsaPage
        aiAvailable={aiAvailable}
        setAiAvailable={setAiAvailable}
        questionName={questionName}
        setQuestionName={setQuestionName}
      />
    ),
    notes: <NotesPage questionName={questionName} />,
  };

  // Gets the current tab info and validates if the url is a valid leetcode question url
  const fetchCodingQuestion = async () => {
    try {
      const URLResponse = await getCurrentTab();

      if (URLResponse?.url?.startsWith('https://leetcode.com/problems/')) {
        setQuestionName(
          URLResponse.url
            ?.split('https://leetcode.com/problems/')[1]
            ?.split('/')[0] ?? ''
        );
      }
    } catch (error) {
      console.log('Failed to fetch URL:', error);
    }
  };

  useEffect(() => {
    // Checks if the browser supports the built in ai features
    if (!self.ai || !self.ai.languageModel) {
      setAiAvailable(false);
      return;
    }

    fetchCodingQuestion();
  }, [questionName, aiAvailable, currentPage]);

  return (
    <div className="w-screen h-screen bg-extension-background-gradient py-4 px-6 overflow-scroll">
      <div className="font-poppins font-bold text-heading-size bg-clip-text text-transparent bg-gradient-to-r from-heading-gradient-start from-0% via-heading-gradient-start via-40% to-heading-gradient-end to-100% tracking-wider inline-block">
        Kode
        <span className="ml-1 font-inter font-normal text-sm text-gray-600 tracking-normal">
          [Ctrl+Shift+K / ⌘+Shift+K]
        </span>
      </div>
      <div className="font-inter font-light text-tagline-size text-tagline-color">
        Amplifying Potential
      </div>
      <OptionBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {pages[currentPage] || null}
    </div>
  );
}

export default App;
