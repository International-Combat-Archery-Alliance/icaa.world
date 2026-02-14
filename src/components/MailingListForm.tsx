import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const MailingListForm = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!agreed) {
      alert('Please confirm that you agree to receive updates.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('agreed', 'true');
    formData.append('_subject', 'New Newsletter Subscription');
    formData.append('_replyto', email);

    try {
      const response = await fetch('https://formspree.io/f/xblkevky', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch {
      alert('A network error occurred. Please check your connection and try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">Thank you for signing up!</h3>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="space-y-2">
        <Label htmlFor="email">Email address:</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked as boolean)}
        />
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to receive emails regarding ICAA events, news, and updates.
        </Label>
      </div>
      <Button type="submit" disabled={!agreed} className="w-full">
        Sign Up
      </Button>
    </form>
  );
};

export default MailingListForm;
