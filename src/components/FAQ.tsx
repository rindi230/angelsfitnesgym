import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Ne cfare ore hapeni?",
    answer: "Ne jemi te hapur nga e Hena ne te shtune nga ora 5:00 AM deri ne oren 00:00 AM, dhe te dielen nga ora 6:00 AM deri ne oren 10:00PM"
  },
  {
    question: "A me duhet ti rezervoj klasat qe te jem pjese?",
    answer: "Ne rekomandojme ti rezervoni por ju mund te hyni dhe direkt pasi ka vende per te gjithe per me shume informacion ju lutem paraqituni fizikisht tek stafi yne"
  },
  {
    question: "A jane tranjeret te disponueshem?",
    answer: "Po trajneret tane te certifikuar jani gjithmone ne gatishmeri per t'ju ndihmuar ne qellimet tuaja"
  },
  {
    question: "Cfare ofertash ofroni?",
    answer: "Ne ofrojme me se shumti oferta mujore te cilat ndahen ne 3,4 ose 5 here ne jave por shpesh here ne leshojme dhe oferta vjetore dhe mujore 3+1 ku perfitoni 1 muaj falas"
  },
  {
    question: "Cfare kerkohet per tu regjistruar ne palester?",
    answer: "Per tu regjistruar tek Angels na nevojitet nje karte identiteti shumen e nevojshme monetare nje numer telefoni dhe disa gjera te tjera te vogla te cilat stafi yne do t'ju perditsoje"
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 20%, #f87171 0.5px, transparent 0.5px), radial-gradient(circle at 80% 80%, #fbbf24 0.5px, transparent 0.5px)', backgroundSize: '40px 40px'}}></div>
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.07)]">Pyetjet me te shpeshta</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${isOpen ? 'border-red-500 bg-white/90' : 'border-gray-200 bg-white/70'}`}
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium text-left text-gray-800 focus:outline-none focus:bg-red-50 hover:bg-red-50 transition-colors group"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className={`w-5 h-5 ${isOpen ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-6 h-6 ml-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-red-600' : 'rotate-0 text-gray-400'}`} />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} bg-white`}
                  style={{overflow: 'hidden'}}
                >
                  <div className="px-6 pb-4 text-gray-700 animate-fade-in" style={{minHeight: isOpen ? '2rem' : 0}}>
                    {isOpen && faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 