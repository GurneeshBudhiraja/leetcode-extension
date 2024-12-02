import { useState, useEffect, useRef } from 'react';
import {
  sendMessage,
  createSession,
  setLocalStorage,
  getLocalStorage,
  sendContentMessage,
} from '../utils/utils.js';
import {
  dsaAgentPrompt,
  agentHeadPrompt,
  recommendationAgentPrompt,
  nonCodingAgentPrompt,
} from '../systemPrompts/dsaPrompts/dsaPrompts.js';
import {
  ToolTip,
  SwitchButton,
  CodingLanguage,
  Chat,
} from '../components/components.js';

function DsaPage({
  setAiAvailable,
  questionName,
  setQuestionName,
  aiAvailable,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(''); // Track the selected language
  const [loading, setLoading] = useState(false); // Keeps the track of the loading state
  const [messages, setMessages] = useState([]); // Chat messages state
  const [input, setInput] = useState(''); // Chat textarea state
  const objectiveRef = useRef();
  const [agentHeadSession, setAgentHeadSession] = useState(null);
  const [dsaAgentSession, setDsaAgentSession] = useState(null);
  const [recommendationAgentSession, setRecommendationAgentSession] =
    useState(null);
  const [nonCodingAgentSession, setNonCodingAgentSession] = useState(null);

  // gets the user code from content.js
  const getUserCode = async () => {
    try {
      const { response } = await sendContentMessage({
        type: 'getUserCode',
      });
      return response ?? '';
    } catch (error) {
      console.log('Failed to fetch the user code:', error);
    }
  };

  // Send message to the promptAPI
  const messageAI = async (message) => {
    // Gets the current user code
    const userCode = await getUserCode();
    console.log('User Code:');
    console.log(userCode);

    console.log('Getting the response from the head');
    const headAgentResp = await agentHeadSession.prompt(message);

    const validJson = headAgentResp.replace(/'/g, '"');

    const { agent } = JSON.parse(validJson);

    console.log(agent);
  };

  const activateAI = async () => {
    try {
      const headPrompt = agentHeadPrompt();
      const dsaPrompt = dsaAgentPrompt(questionName, selectedLanguage);
      const recommendationPrompt = recommendationAgentPrompt();
      const nonCodingPrompt = nonCodingAgentPrompt();

      const headSession = await createSession({
        systemPrompt: headPrompt,
      });

      const dsaSession = await createSession({ systemPrompt: dsaPrompt });

      const recommendationSession = await createSession({
        systemPrompt: recommendationPrompt,
      });

      const nonCodingSession = await createSession({
        systemPrompt: nonCodingPrompt,
      });

      // Checks the array has all the valid session object
      const arr = [
        headSession,
        dsaSession,
        recommendationSession,
        nonCodingSession,
      ];
      arr.map((obj) => {
        if (!Object.keys(obj).length) {
          console.log('Empty prompt session object');
          return;
        }
      });

      const { session: hSession } = headSession;
      setAgentHeadSession(hSession);

      const { session: dSession } = dsaSession;
      setDsaAgentSession(dSession);

      const { session: rSession } = recommendationSession;
      setRecommendationAgentSession(rSession);

      const { session: ncSession } = nonCodingSession;
      setNonCodingAgentSession(ncSession);
    } catch (error) {
      console.log('Failed to activate the prompt AI in DsaPage.jsx:', error);
      return;
    }
  };

  useEffect(() => {
    // Sets the aiLoading state
    setLoading(true);

    // Checking if the browser supports the ai features
    if (!self.ai || !self.ai.languageModel) {
      setAiAvailable(false);
      return;
    }

    // Gets the current tab info and validates the valid leetcode question URL
    sendMessage({ type: 'getCurrentURL' })
      .then((URLResponse) => {
        if (URLResponse?.url?.startsWith('https://leetcode.com/problems/')) {
          console.log(URLResponse);
          setQuestionName(
            URLResponse.url
              ?.split('https://leetcode.com/problems/')[1]
              ?.split('/')[0] ?? ''
          );
        }
      })
      .catch((error) => console.log('Failed to fetch URL:', error));

    // Message to service-worker for preferred coding language of the user
    if (questionName) {
      sendMessage({ type: 'getPreferredLanguage' })
        .then((languageResponse) => {
          setSelectedLanguage(languageResponse.language ?? '');
        })
        .catch((error) =>
          console.log('Failed to fetch coding language:', error)
        );
    }

    // gets the user objective from the local storage
    getLocalStorage({ param: 'objective' })
      .then((objectiveResponse) => {
        if (Object.keys(objectiveResponse).length && objectiveRef.current) {
          objectiveRef.current.value = objectiveResponse['objective'];
        }
      })
      .catch((error) => console.log('Failed to fetch the objective: ', error));

    activateAI();

    // Updates the loading state
    setLoading(false);
  }, [questionName, selectedLanguage, setAiAvailable, setQuestionName]);

  return (
    <div>
      {aiAvailable ? (
        <div className="mt-3 space-y-4 flex flex-col mb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-focusmode-size text-white">Focus mode</span>
              <ToolTip title="Reminds you to return to LeetCode only if you're off-task for 10 minutes." />
            </div>
            <SwitchButton />
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter the objective for today"
              className=""
              ref={objectiveRef}
            />
            <button
              className="p-2 cursor-pointer text-white bg-blue-900/85 "
              onClick={async () => {
                if (objectiveRef.current) {
                  const objective = objectiveRef.current.value.trim();
                  await setLocalStorage({ objective });
                }
              }}
            >
              Submit
            </button>
          </div>
          {questionName ? (
            <div className="h-[420px]">
              <CodingLanguage
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
              <Chat
                loading={loading}
                messageAI={messageAI}
                messages={messages}
                setMessages={setMessages}
                input={input}
                setInput={setInput}
              />
            </div>
          ) : (
            <div className="text-[#F5F5F5] bg-[#1A1B23] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium p-3 text-center border rounded-lg select-none w-5/6">
              To use the Kode DSA, please open a LeetCode problem page.
            </div>
          )}
        </div>
      ) : (
        <div className="text-[#F5F5F5] bg-[#1A1B23] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium p-3 text-center border rounded-lg select-none w-5/6">
          The Kode DSA is not supported on your current browser.
        </div>
      )}
    </div>
  );
}

export default DsaPage;
