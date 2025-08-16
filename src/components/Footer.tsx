
export const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Classes", href: "#classes" },
    { name: "Staff", href: "#staff" },
    { name: "Shop", href: "#shop" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "Personal Training",
    "Grupime klasash",
    "Konsultime per nutricione",
   
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold text-red-500 mb-4">Angels Fitness Gym</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
            Destinacioni juaj kryesor për transformim në fitnes. Ne jemi të përkushtuar t'ju ndihmojmë të arrini qëllimet tuaja për shëndetin dhe mirëqenien në një mjedis mbështetës dhe motivues.
            </p>
            <div className="text-gray-300">
              <p>📍 Rruga e Kavajes, Pallati Orion kati 2</p>
              <p>📞 (355)68 567 223</p>
              <p>✉️ angelsfitnessgym@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Navigacioni</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-4">Sherbimet tona</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Angels Fitness Gym. Te gjitha te drejtat e rezervuara. | 
            <span className="text-red-500"> E dizenjuar per ekselence</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
