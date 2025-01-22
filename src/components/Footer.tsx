import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navbar text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">TechSly.</h2>
            <p className="text-gray-400 mb-6">
              TechSly Elementor template is simply dummy text of the printing and typesetting industry lorem Ipsum has been the text.
            </p>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Address</h3>
            <p className="text-gray-400 mb-2">
              49 West 32nd Street, New York,
              <br />
              4.9 mi / 7.9 km from Downtown
              <br />
              United States
            </p>
            <div className="mt-4">
              <p className="text-gray-400">Monday — Friday: 8AM — 5PM</p>
              <p className="text-gray-400">Saturday: 10AM — 3PM</p>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Contact</h3>
            <p className="text-gray-400 mb-4">
              If you have any question please contact us
              <br />
              noreply@envato.com
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-5 h-5" />
                <span>+62 (0) 846 839 119</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>techsly@example.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2021 Eventkit Elementor Template. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;