'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, X, Send } from 'lucide-react';

interface QA { question: string; answer: string }
const CONTACT_KB: QA[] = [
  { question: 'hi', answer: 'Hi there! 👋 Welcome to HackVibe 2025. How can I help you today?' },
  { question: 'hello', answer: 'Hello! 👋 Excited for HackVibe 2025? I can answer any questions about the event.' },
  { question: 'hey', answer: 'Hey! 👋 Ready to innovate? Ask me anything about HackVibe 2025.' },
  { question: 'good morning', answer: 'Good morning! ☀ Hope you\'re ready for a day full of creativity and innovation.' },
  { question: 'good afternoon', answer: 'Good afternoon! 🌞 HackVibe 2025 is just around the corner.' },
  { question: 'good evening', answer: 'Good evening! 🌆 Are you preparing for the hackathon?' },
  { question: 'how are you', answer: 'I\'m doing great, thanks for asking! 😊 How about you?' },
  { question: 'who are you', answer: 'I\'m your HackVibe 2025 assistant bot 🤖 here to answer all your hackathon questions.' },
  { question: 'thank you', answer: 'You\'re welcome! 😊 Happy to help.' },
  { question: 'thanks', answer: 'Anytime! 👍' },
  { question: 'when is the hackathon?', answer: 'The hackathon will take place on 11th September 2025 and will last for 24 hours.' },
  { question: 'how long will the hackathon last?', answer: 'The hackathon will last for 24 hours, starting on 11th September 2025.' },
  { question: 'what is the theme of the hackathon?', answer: 'The theme of the hackathon is Open Innovation — participants can work on creative solutions in any domain of their choice.' },
  { question: 'what is the registration fee for the hackathon?', answer: 'The registration fee is ₹200 per head and ₹600 per team (exactly 3 members per team).' },
  { question: 'when do registrations close?', answer: 'Registrations close on 7th September 2025, which is 3 days before the hackathon.' },
  { question: 'how many members are allowed in a team?', answer: 'Each team must have exactly 3 members. No solo participation is allowed.' },
  { question: 'can i participate alone?', answer: 'No, solo participation is not allowed. You must be in a team of exactly 3 members.' },
  { question: 'will lunch be provided during the hackathon?', answer: 'No, lunch will not be provided. Participants should bring their own lunch.' },
  { question: 'will dinner be provided during the hackathon?', answer: 'Yes, dinner will be provided on Day-1 along with networking opportunities.' },
  { question: 'will breakfast be provided on day-2?', answer: 'Yes, breakfast will be provided on the morning of Day-2.' },
  { question: 'will participants receive a certificate?', answer: 'Yes, all participants will receive a participation certificate.' },
  { question: 'what should i bring to the hackathon?', answer: 'You should bring:\n- Laptop & charger\n- Extension board\n- Valid ID proof\n- Reusable water bottle\n- Notepad & pen\n- Your own lunch\n- Any hardware components if your project requires them' },
  { question: 'what is the schedule for day-1 of the hackathon?', answer: 'Day-1 Schedule:\n1. Registration & Check-in – Welcome and team formation\n2. Opening Ceremony – Keynote speakers and theme introduction\n3. Hacking Begins! – The 24-hour innovation marathon starts\n4. Lunch Break – Lunch with mentors (bring your own lunch)\n5. Mentor Sessions – One-on-one guidance from industry experts\n6. Dinner & Networking – Evening meal and collaboration\n7. Late Night Coding – Continuous development through the night\n8. Midnight Snacks – Energy boost for night owls\n9. Day-1 Wrap Up – Progress review and rest' },
  { question: 'what is the schedule for day-2 of the hackathon?', answer: 'Day-2 Schedule:\n1. Morning Refresh – Breakfast and final sprint preparation\n2. Final Sprint – Last hours to polish your project\n3. Submissions Close – Deploy and submit your solutions\n4. Project Demos – Showcase your innovations to judges\n5. Award Ceremony – Winners announcement and prizes' },
  { question: 'what happens after the opening ceremony?', answer: 'After the opening ceremony, hacking begins and the 24-hour innovation marathon starts.' },
  { question: 'what is the final activity of the hackathon?', answer: 'The final activity is the Award Ceremony where winners are announced and prizes are distributed.' },
  { question: 'what does open innovation mean?', answer: 'Open innovation is the practice of allowing ideas to flow freely across boundaries, encouraging collaboration and creativity without limiting to a single domain.' },
  { question: 'can i work on any project topic?', answer: 'Yes, since the theme is Open Innovation, you can choose any domain or problem statement you are passionate about.' },
  { question: 'what is innovation?', answer: 'Innovation is the process of creating new ideas, products, or solutions that bring value, improve existing processes, or solve problems in a unique way.' },
  { question: 'do i need to have a team before the hackathon?', answer: 'You can form a team before registration or during the registration and check-in session on Day-1, but each team must have exactly 3 members.' },
  { question: 'will there be mentors during the hackathon?', answer: 'Yes, mentors will be available to guide participants through one-on-one sessions on Day-1.' },
  { question: 'when do submissions close?', answer: 'Submissions close during the Final Sprint on Day-2, right before the Project Demos session.' },
  { question: 'what is the contact email for the hackathon?', answer: 'You can contact the team at vgnt@hackvibe.in.' },
  { question: 'what is the contact phone number for the hackathon?', answer: 'You can reach the organizers at +91 93929 81385 .' },
  { question: 'where will the hackathon be held?', answer: 'The hackathon will be held at Vignan Institute of Technology and Science, Deshmukhi, Hyderabad, Telangana 501512.\nGoogle Maps: https://maps.app.goo.gl/LAwjZVsFepBVwR1u8' },
  { question: 'what is the instagram link for the hackathon?', answer: 'Follow us on Instagram: https://www.instagram.com/hackvibe2025?igsh=dG56d3NoaHdlZWJw&utm_source=qr' },
  { question: 'what is the linkedin link for the hackathon?', answer: 'Follow us on LinkedIn: https://www.linkedin.com/company/hackvibe/?fbclid=PAQ0xDSwMAfVBleHRuA2FlbQIxMQABp7vuUApCtQ5-jDuqhPg2eDkxsu9kSennINmv_CFUlzS5hCdbjO8fCcMrfxAE_aem_nD_Z2zbMIgzJWmSwseg3Bg' },
  
  // General FAQ Questions
  { question: 'what is a hackathon?', answer: 'A hackathon is an event where programmers, designers, and innovators come together to build creative solutions to problems in a short time period. It\'s like a coding marathon where you collaborate, learn, and create something amazing!' },
  { question: 'why should i participate in a hackathon?', answer: 'Hackathons are great for:\n- Learning new technologies\n- Building your portfolio\n- Networking with like-minded people\n- Winning prizes and recognition\n- Having fun while coding\n- Gaining real-world project experience' },
  { question: 'do i need to be an expert programmer?', answer: 'No! Hackathons welcome all skill levels. Whether you\'re a beginner or expert, there\'s something for everyone. You can learn from others, contribute your unique skills, and grow your abilities.' },
  { question: 'what if i don\'t know how to code?', answer: 'That\'s totally fine! Hackathons need designers, project managers, researchers, and creative thinkers too. You can contribute with UI/UX design, project planning, documentation, or even just great ideas!' },
  { question: 'how do i prepare for a hackathon?', answer: 'To prepare for a hackathon:\n- Learn basic programming concepts\n- Practice with small projects\n- Research the theme/topics\n- Get familiar with common tools\n- Get good sleep before the event\n- Bring your enthusiasm and creativity!' },
  { question: 'what should i expect at a hackathon?', answer: 'Expect:\n- Intense coding sessions\n- Collaboration with teammates\n- Mentorship from experts\n- Networking opportunities\n- Fun activities and breaks\n- Prizes and recognition\n- Amazing food and energy!' },
  { question: 'how do hackathons work?', answer: 'Hackathons typically work like this:\n1. Opening ceremony and theme announcement\n2. Team formation and idea brainstorming\n3. Intensive coding/development period\n4. Project submission and demos\n5. Judging and awards\n6. Networking and celebration!' },
  { question: 'what makes a good hackathon project?', answer: 'A good hackathon project should:\n- Solve a real problem\n- Be innovative and creative\n- Be feasible to build in the time given\n- Have a clear value proposition\n- Be well-documented and presented\n- Show technical skills and teamwork' },
  { question: 'how do i find teammates?', answer: 'You can find teammates by:\n- Asking friends or classmates\n- Using social media and forums\n- Attending pre-hackathon events\n- Joining hackathon Discord/Slack groups\n- Reaching out to people with complementary skills\n- Forming teams at the event itself' },
  { question: 'what technologies can i use?', answer: 'You can use any technology you\'re comfortable with! Common choices include:\n- Web technologies (HTML, CSS, JavaScript)\n- Mobile development (React Native, Flutter)\n- Backend (Python, Node.js, Java)\n- AI/ML tools and libraries\n- Cloud platforms (AWS, Google Cloud)\n- Hardware (Arduino, Raspberry Pi)' },
  { question: 'how long do hackathons usually last?', answer: 'Hackathons can vary in duration:\n- Mini hackathons: 4-8 hours\n- Standard hackathons: 24-48 hours\n- Extended hackathons: 3-7 days\n- Virtual hackathons: 1-4 weeks\nMost in-person hackathons are 24-48 hours long.' },
  { question: 'what are the prizes like?', answer: 'Prizes can include:\n- Cash rewards\n- Tech gadgets and devices\n- Software licenses and subscriptions\n- Internship opportunities\n- Job offers from sponsors\n- Recognition and certificates\n- Networking opportunities' },
  { question: 'do i need to bring my own laptop?', answer: 'Yes, you should bring your own laptop with all the software you plan to use. Make sure to:\n- Charge your laptop fully\n- Install necessary development tools\n- Bring your charger and extension cords\n- Have your ID and any required documents' },
  { question: 'what if my project doesn\'t work?', answer: 'That\'s completely normal! Many projects don\'t work perfectly at hackathons. Judges appreciate:\n- The effort and learning\n- Creative problem-solving\n- Team collaboration\n- Clear presentation of ideas\n- Honest discussion of challenges\n- Future improvement plans' },
  { question: 'how do i present my project?', answer: 'For project presentations:\n- Keep it simple and clear\n- Focus on the problem you solved\n- Show a working demo if possible\n- Explain your technical approach\n- Highlight your team\'s collaboration\n- Be honest about challenges\n- Practice your pitch beforehand' },
  { question: 'what if i get stuck during the hackathon?', answer: 'Getting stuck is normal! Here\'s what to do:\n- Ask mentors for help\n- Collaborate with your teammates\n- Use online resources and documentation\n- Take breaks to clear your mind\n- Simplify your approach if needed\n- Focus on learning rather than perfection' },
  { question: 'how do i network at a hackathon?', answer: 'To network effectively:\n- Be friendly and approachable\n- Ask questions and show interest\n- Share your ideas and experiences\n- Connect with mentors and judges\n- Exchange contact information\n- Follow up after the event\n- Join hackathon communities' },
  { question: 'what should i wear to a hackathon?', answer: 'Wear comfortable clothes! Most people wear:\n- Casual, comfortable clothing\n- Layers (venues can be cold)\n- Comfortable shoes\n- Your favorite tech t-shirt\n- Something that represents your personality\n- Avoid anything too formal or restrictive' },
  { question: 'how do i stay energized during a hackathon?', answer: 'To stay energized:\n- Get good sleep before the event\n- Stay hydrated with water\n- Eat regular meals and snacks\n- Take short breaks to stretch\n- Move around and get fresh air\n- Avoid too much caffeine\n- Listen to your body\'s needs' },
  { question: 'what if i can\'t attend the full hackathon?', answer: 'While it\'s best to attend the full event, you can:\n- Check with organizers about partial attendance\n- Focus on specific sessions or activities\n- Participate in virtual components\n- Connect with teams remotely\n- Attend future hackathons\n- Join online hackathon communities' },
  { question: 'how do i know if a hackathon is right for me?', answer: 'A hackathon might be right for you if you:\n- Enjoy problem-solving\n- Want to learn new skills\n- Like working in teams\n- Are curious about technology\n- Want to build something cool\n- Enjoy meeting new people\n- Want to challenge yourself' },
  { question: 'what are the different types of hackathons?', answer: 'Common hackathon types include:\n- General hackathons (any topic)\n- Theme-specific (AI, sustainability, etc.)\n- Industry-focused (healthcare, finance)\n- Skill-level specific (beginner, advanced)\n- Virtual vs in-person\n- Corporate vs student-run\n- Competitive vs learning-focused' },
  { question: 'how do i find hackathons to participate in?', answer: 'You can find hackathons through:\n- University and college announcements\n- Online platforms like Devpost\n- Social media and tech communities\n- Company websites and events\n- Local tech meetups\n- Professional networks\n- Hackathon aggregator websites' },
  { question: 'what skills do i need for a hackathon?', answer: 'Useful skills include:\n- Basic programming knowledge\n- Problem-solving abilities\n- Teamwork and communication\n- Creativity and innovation\n- Time management\n- Presentation skills\n- Willingness to learn\n- Enthusiasm and persistence' },
  { question: 'how do i handle stress during a hackathon?', answer: 'To manage hackathon stress:\n- Set realistic goals\n- Break tasks into smaller parts\n- Take regular breaks\n- Stay organized and focused\n- Communicate with your team\n- Remember it\'s about learning\n- Don\'t be afraid to ask for help\n- Keep a positive attitude' },
  { question: 'what if my team has conflicts?', answer: 'If conflicts arise:\n- Communicate openly and respectfully\n- Focus on the project goals\n- Compromise when possible\n- Use mentors as mediators\n- Remember you\'re all learning\n- Stay professional and positive\n- Learn from the experience' },
  { question: 'how do i make the most of my hackathon experience?', answer: 'To maximize your experience:\n- Set clear goals before starting\n- Network with other participants\n- Ask questions and learn from mentors\n- Document your learning journey\n- Take photos and share on social media\n- Follow up with new connections\n- Reflect on what you learned\n- Plan for future hackathons!' },
  { question: 'how do i come to the venue?', answer: 'Transportation to the venue:\n- College will provide transport from LB Nagar\n- Pickup time: 7:30 AM in the morning\n- Transport will be available to return after the event\n- Public transport is also available as an alternative\n- Make sure to arrive on time for the pickup!' },
  { question: 'how to register?', answer: 'You can register for HackVibe 2025 online:\n\n**Online Registration:**\n- Visit our website and go to the Register page\n- Fill out the online registration form\n- Pay the registration fee of ₹200 per person (₹600 per team)\n- Submit your team details and required documents\n\n**Important:** \n- Each team must have exactly 3 members\n- No solo participation is allowed\n- No on-site registration available\n- Register before the deadline: 7th September 2025' },
];

export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm VibBot 🤖 your HackVibe 2025 assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  const findAnswer = (q: string): string => {
    const question = q.trim().toLowerCase();
    if (!question) return 'Please type your question.';
    const exact = CONTACT_KB.find(k => k.question === question);
    if (exact) return exact.answer;
    const contains = CONTACT_KB.find(k => question.includes(k.question));
    if (contains) return contains.answer;
    const tokens = question.split(/\s+/).filter(Boolean);
    const scored = CONTACT_KB
      .map(item => ({ item, score: tokens.reduce((s, t) => (item.question.includes(t) ? s + 1 : s), 0) }))
      .sort((a, b) => b.score - a.score);
    if (scored[0]?.score && scored[0].score >= 2) return scored[0].item.answer;
    return 'Sorry, I don\'t have an answer yet. Try asking about dates, fees, schedule, or contacts.';
  };

  const handleChatSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    const answer = findAnswer(text);
    setChatMessages(prev => [...prev, { role: 'user', text }, { role: 'bot', text: answer }]);
    setChatInput('');
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChatSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 shadow-lg hover:shadow-xl transition-all duration-300 relative group touch-manipulation"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse effect when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-ping opacity-20"></div>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 left-4 md:bottom-24 md:right-6 md:left-auto w-auto md:w-80 h-80 md:h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-white/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">VibBot Assistant</h3>
                  <p className="text-xs opacity-90">Online • HackVibe 2025</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-48 md:h-64 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800 selectable-text">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 selectable-text">
              <div className="flex items-center space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Type your question..."
                  className="flex-1 text-sm border-gray-300 dark:border-gray-600 focus:border-primary"
                />
                <Button
                  onClick={handleChatSend}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ask me anything about HackVibe 2025! 🤖
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
