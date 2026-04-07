'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Send, Check, Loader2, Mail, MapPin, Sparkles } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
type SubmitState = 'idle' | 'loading' | 'success';

const contactInfo = [
  { icon: Mail, label: 'Email us at', value: 'hello@funtern.co' },
  { icon: MapPin, label: 'Based in', value: 'India — serving students globally' },
];

export function ContactSection() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (_data: ContactFormData) => {
    setSubmitState('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitState('success');
    setTimeout(() => {
      setSubmitState('idle');
      form.reset();
    }, 3000);
  };

  return (
    <section id="contact" className="relative z-10 py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Heading & Info */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-900/30 text-purple-300 text-xs font-semibold mb-5">
              <span>📬</span><span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Let&apos;s Build Something{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Fun Together
              </span>
            </h2>
            <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-md">
              Whether you&apos;re a student with questions, a company looking to
              partner, or just curious about Funtern — we&apos;d love to hear
              from you.
            </p>

            <div className="space-y-5">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="text-white font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative sparkle blob */}
            <div className="relative mt-12 hidden lg:block">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 blur-2xl" />
              <Sparkles className="absolute top-6 left-8 w-8 h-8 text-purple-400/40" />
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            <div className="p-7 sm:p-9 rounded-3xl border border-purple-700/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 backdrop-blur-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-sm font-medium">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Priya Sharma"
                            {...field}
                            className="bg-white/5 border-purple-700/40 text-white placeholder:text-gray-600 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/60 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            className="bg-white/5 border-purple-700/40 text-white placeholder:text-gray-600 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/60 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-sm font-medium">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what's on your mind..."
                            rows={4}
                            {...field}
                            className="bg-white/5 border-purple-700/40 text-white placeholder:text-gray-600 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/60 rounded-xl resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={submitState === 'loading' || submitState === 'success'}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      submitState === 'success'
                        ? 'bg-emerald-600 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-700/30'
                        : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-purple-700/30 hover:scale-[1.02]'
                    }`}
                  >
                    {submitState === 'loading' && (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending…
                      </>
                    )}
                    {submitState === 'success' && (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Message Sent! ✨
                      </>
                    )}
                    {submitState === 'idle' && (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
