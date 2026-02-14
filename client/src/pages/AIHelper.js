import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ChatBubble from "../components/ChatBubble";

function AIHelper() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("welcome");
  const [typing, setTyping] = useState(false);
  const [showSupportLink, setShowSupportLink] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    simulateBot([
      "Hello! Welcome to CampusConnect Assistant.",
      "How can I assist you today?",
      "Type: help / complaint / guidance",
    ]);
  }, []);

  const simulateBot = (responses) => {
    setTyping(true);
    responses.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: msg, sender: "ai" }]);
        if (index === responses.length - 1) setTyping(false);
      }, 700 * (index + 1));
    });
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim().toLowerCase();
    addUserMessage(input);
    setInput("");

    setTimeout(() => processFlow(userText), 600);
  };

  const processFlow = (text) => {
    switch (step) {
      case "welcome":
        if (text.includes("help")) {
          simulateBot([
            "Sure, I will guide you.",
            "Please choose your help category:",
            "1. Account Help",
            "2. Opportunities Help",
            "3. Skill Match Help",
            "4. Resume and Profile Help",
            "5. Technical Issue",
            "6. Placement Guidance",
            "Please enter the number.",
          ]);
          setStep("helpCategory");
        } else if (text.includes("complaint")) {
          simulateBot([
            "Sorry you are facing an issue.",
            "Please choose complaint type:",
            "1. Login/Register Problem",
            "2. Application Not Submitted",
            "3. Opportunity Not Visible",
            "4. Skill Match Error",
            "5. Website Bug",
            "6. Other",
            "Please enter the number.",
          ]);
          setStep("complaintCategory");
        } else if (text.includes("guidance")) {
          simulateBot([
            "Are you looking for:",
            "1. Internship Guidance",
            "2. Placement Preparation",
            "Please enter 1 or 2.",
          ]);
          setStep("guidanceCategory");
        } else {
          simulateBot(["Please type: help / complaint / guidance"]);
        }
        break;

      case "helpCategory":
        if (text === "1") {
          simulateBot(["Account Help selected.", "Are you facing login issues? (yes/no)"]);
          setStep("accountHelp");
        } else if (text === "2") {
          simulateBot([
            "Opportunities Help selected.",
            "Are opportunities not visible? (yes/no)",
          ]);
          setStep("opportunityHelp");
        } else if (text === "3") {
          simulateBot([
            "Skill match depends on your profile skills and required skills.",
            "To improve it:",
            "- Add relevant technical skills",
            "- Keep your resume updated",
            "- Apply to matching opportunities",
          ]);
          resetFlow();
        } else if (text === "4") {
          simulateBot([
            "You can update resume and skills from the Profile page.",
            "Complete profile data improves recommendations.",
          ]);
          resetFlow();
        } else if (text === "5") {
          simulateBot([
            "Please describe the technical issue briefly.",
            "Our support team will review it.",
          ]);
          setShowSupportLink(true);
          resetFlow();
        } else if (text === "6") {
          simulateBot([
            "Placement guidance tips:",
            "- Practice coding and DSA daily",
            "- Prepare aptitude and communication",
            "- Build strong projects",
          ]);
          resetFlow();
        } else {
          simulateBot(["Please enter a valid option (1-6)."]);
        }
        break;

      case "complaintCategory":
        if (text === "1") {
          simulateBot([
            "Login/Register problem selected.",
            "Try resetting the password from the login page.",
            "If it continues, contact the support desk.",
          ]);
          setShowSupportLink(true);
          resetFlow();
        } else if (text === "2") {
          simulateBot([
            "Application Not Submitted.",
            "Check your dashboard for submission confirmation.",
            "Ensure all required fields are filled.",
          ]);
          resetFlow();
        } else if (text === "3") {
          simulateBot([
            "Opportunity Not Visible.",
            "Make sure your skills are updated.",
            "Listings are filtered by profile skills.",
          ]);
          resetFlow();
        } else if (text === "4") {
          simulateBot([
            "Skill Match Error.",
            "Update your profile skills carefully.",
            "Refresh after updating.",
          ]);
          resetFlow();
        } else if (text === "5") {
          simulateBot([
            "Website bug reported.",
            "Please describe the issue in detail.",
            "Our technical team will investigate.",
          ]);
          setShowSupportLink(true);
          resetFlow();
        } else if (text === "6") {
          simulateBot(["For other complaints, contact the support desk."]);
          setShowSupportLink(true);
          resetFlow();
        } else {
          simulateBot(["Please enter a valid option (1-6)."]);
        }
        break;

      case "guidanceCategory":
        if (text === "1") {
          simulateBot([
            "Internship guidance:",
            "- Build strong projects",
            "- Maintain your GitHub profile",
            "- Apply early and consistently",
            "- Learn industry-relevant skills",
          ]);
        } else if (text === "2") {
          simulateBot([
            "Placement preparation:",
            "- Practice coding daily",
            "- Prepare HR questions",
            "- Study core subjects",
            "- Attend mock interviews",
          ]);
        } else {
          simulateBot(["Please enter 1 or 2."]);
          return;
        }
        resetFlow();
        break;

      default:
        resetFlow();
    }
  };

  const resetFlow = () => {
    setTimeout(() => {
      simulateBot([
        "Is there anything else I can help you with?",
        "Type: help / complaint / guidance",
      ]);
      setStep("welcome");
    }, 1500);
  };

  return (
    <Layout>
      <section className="cc-glass rounded-3xl p-5 md:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="cc-chip">Campus AI Assistant</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Smart support in one chat</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ask for help, raise complaints, and get guidance instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setInput("help")}
              className="cc-button cc-button-soft px-4 py-2 text-sm"
            >
              Help
            </button>
            <button
              onClick={() => setInput("guidance")}
              className="cc-button cc-button-soft px-4 py-2 text-sm"
            >
              Guidance
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-inner">
          <div className="h-[500px] overflow-y-auto pr-1">
            {messages.map((msg, i) => (
              <ChatBubble key={i} text={msg.text} sender={msg.sender} />
            ))}

            {typing && (
              <p className="mt-1 text-xs font-medium text-slate-500">Assistant is typing...</p>
            )}

            {showSupportLink && (
              <div className="mt-4 text-center">
                <Link to="/support" className="text-sm font-semibold text-teal-700 underline">
                  Contact Support Desk
                </Link>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              className="cc-input flex-1"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="cc-button cc-button-primary px-6">
              Send
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AIHelper;
