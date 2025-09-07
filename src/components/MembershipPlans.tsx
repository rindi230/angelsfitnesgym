
import { Check, Star } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validateName, validateAlbanianPhone, formatAlbanianPhone, cleanPhoneInput } from '@/lib/validation';

export const MembershipPlans = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPlanPrice, setSelectedPlanPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string; phone?: string}>({});
  const { toast } = useToast();

  const plans = [
    {
      name: "Basic",
      price: "29",
      period: "month",
      description: "Perfect for getting started with your fitness journey",
      features: [
        "Access to gym equipment",
        "Basic locker room access",
        "Free parking",
        "Online workout tracking"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "49",
      period: "month",
      description: "Most popular choice with added benefits",
      features: [
        "All Basic features",
        "Group fitness classes",
        "Personal training consultation",
        "Nutritional guidance",
        "Priority booking",
        "Guest passes (2 per month)"
      ],
      popular: true
    },
    {
      name: "Elite",
      price: "79",
      period: "month",
      description: "Ultimate fitness experience with VIP treatment",
      features: [
        "All Premium features",
        "Unlimited personal training",
        "Massage therapy sessions",
        "VIP locker room access",
        "Unlimited guest passes",
        "Custom meal planning",
        "24/7 gym access"
      ],
      popular: false
    }
  ];

  const handleGetStarted = (planName: string, planPrice: string) => {
    setSelectedPlan(planName);
    setSelectedPlanPrice(planPrice);
    setErrors({});
    setIsDialogOpen(true);
  };

  // Validation functions
  const validateForm = () => {
    const newErrors: {name?: string; email?: string; phone?: string} = {};
    
    const nameValidation = validateName(customerName);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }
    
    const emailValidation = validateEmail(customerEmail);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }
    
    const phoneValidation = validateAlbanianPhone(customerPhone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setCustomerName(value);
    if (errors.name) {
      const validation = validateName(value);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    }
  };

  const handleEmailChange = (value: string) => {
    setCustomerEmail(value);
    if (errors.email) {
      const validation = validateEmail(value);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneInput(value);
    setCustomerPhone(cleaned);
    if (errors.phone) {
      const validation = validateAlbanianPhone(cleaned);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    }
  };

  const sendMembershipEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-membership-email', {
        body: {
          customerName,
          customerEmail,
          customerPhone,
          planName: selectedPlan,
          planPrice: selectedPlanPrice,
        },
      });

      if (error) {
        console.error('Error sending membership email:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in sendMembershipEmail:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await sendMembershipEmail();
      
      toast({
        title: "Inquiry Submitted Successfully!",
        description: `Thank you ${customerName}! We've received your interest in the ${selectedPlan} plan. Our team will contact you soon.`,
      });
      
      // Reset form
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setErrors({});
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your inquiry. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Membership Plans</h2>
          <p className="text-xl text-gray-600">
            Choose the perfect plan that fits your fitness goals and lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover-scale ${
                plan.popular ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleGetStarted(plan.name, plan.price)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${
                    plan.popular
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All memberships include access to our expert trainers and support staff
          </p>
          <p className="text-sm text-gray-500">
            No setup fees • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Join Our {selectedPlan} Plan
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill out your information below and we'll contact you to complete your membership setup.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={customerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your full name"
                required
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Gmail Address</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your Gmail address (example@gmail.com)"
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Albanian Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formatAlbanianPhone(customerPhone)}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+355 6X XXX XXX"
                required
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Selected Plan:</strong> {selectedPlan} Plan
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Price:</strong> ${selectedPlanPrice}/month
              </p>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || Object.keys(errors).length > 0}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};