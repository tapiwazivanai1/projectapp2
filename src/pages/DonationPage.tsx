import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useContributeToProject } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import RequireAuth from "../components/auth/RequireAuth";

const DonationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // This would come from your project hook
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { contribute, loading: contributionLoading, error, success } = useContributeToProject();
  
  const [amount, setAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch project details
  useEffect(() => {
    // Simulate fetching project
    setTimeout(() => {
      setProject({
        id: projectId,
        title: "Church Building Renovation",
        description: "Help us renovate the main sanctuary to accommodate our growing congregation and improve facilities.",
        image: "https://images.unsplash.com/photo-1543674892-7d64d45df18d?w=600&q=80",
        currentAmount: 15000,
        goalAmount: 50000,
        deadline: "2023-12-31",
      });
      setLoading(false);
    }, 1000);
  }, [projectId]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setCustomAmount("");
      setAmount("25"); // Default back to a preset amount
    } else if (/^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
      setAmount("custom");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const donationAmount = amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);
    
    if (isNaN(donationAmount) || donationAmount <= 0) {
      return; // Invalid amount
    }
    
    const result = await contribute({
      projectId: projectId || "",
      amount: donationAmount,
      anonymous,
    });
    
    if (result.success) {
      setIsSubmitted(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <main className="container mx-auto px-4 py-12 flex justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />

        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Your Contribution!
            </h1>
            <p className="text-gray-600 mb-6">
              Your donation of ${amount === "custom" ? customAmount : amount} to {project?.title} has been received.
              A receipt has been sent to your email address.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to your profile...
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <RequireAuth>
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                to="/projects"
                className="inline-flex items-center text-gray-600 hover:text-red-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Make a Contribution
            </h1>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Project Summary */}
            {project && (
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            ${project.currentAmount.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            of ${project.goalAmount.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={(project.currentAmount / project.goalAmount) * 100}
                          className="h-2 bg-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              {/* Donation Amount */}
              <div className="space-y-3">
                <Label>Donation Amount</Label>
                <RadioGroup
                  value={amount}
                  onValueChange={handleAmountChange}
                  className="flex flex-wrap gap-4"
                >
                  {["10", "25", "50", "100"].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`amount-${value}`} />
                      <Label
                        htmlFor={`amount-${value}`}
                        className="cursor-pointer"
                      >
                        ${value}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="amount-custom" />
                    <Label
                      htmlFor="amount-custom"
                      className="flex items-center cursor-pointer"
                    >
                      <Input
                        type="text"
                        placeholder="Other amount"
                        className="w-32 ml-2"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        onClick={() => setAmount("custom")}
                      />
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Anonymous Donation */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous