import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
const Contact = () => {
  const {
    cart
  } = useCart();
  const {
    currentCity
  } = useCity();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix mobile UX issue: auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!"
      });
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };
  return Helmet>
        <title>About Us – Xstore India</title>
        <meta name="description"
    content="Contact Xstore India if you have expiring inventory – we’ll help you clear it fast. Retailers can get up to 95% off on FMCG products. Hotels and restaurants can also reach out to receive fresh fruits, vegetables, and frozen items at the lowest rates with free same-day doorstep delivery." />
        <link rel="canonical" href="https://xstoreindia.shop/contact" />
      </Helmet>
    
  <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-xstore-green mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <p className="font-medium">+91 1334354326</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-xstore-green mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Us</p>
                    <p className="font-medium">support@xstoreindia.shop</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-xstore-green mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Headquarters</p>
                    <p className="font-medium">123 Smith Nagar, Prem Nagar, Dehradun</p>
                    <p className="text-gray-500">Uttarakhand, India - 248007</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Order Support</h3>
                <p className="text-gray-600">
                  Customer support for orders is available 7 days a week from 8:00 AM to 8:00 PM
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required placeholder="How can we help you?" className="min-h-[120px]" />
              </div>
              
              <Button type="submit" className="w-full bg-xstore-green" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Our Location</h2>
          <div className="h-96 rounded-lg overflow-hidden shadow-md">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.3089235655876!2d77.2177855!3d28.6439805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sus!4v1626423095562!5m2!1sen!2sus" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen={true} loading="lazy" title="Xstore Location Map" />
          </div>
        </div>
      </div>
    </Layout>;
};
export default Contact;
