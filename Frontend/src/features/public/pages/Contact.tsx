import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HeroBanner from "./HeroBanner";
import api from "../../../services/api";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../shared/utils/errors";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  telephone: z
    .string()
    .optional(),

  subject: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      subject: "",
      message: "",
    },
  });

const onSubmit = async (data: ContactFormData) => {
  try {
    await api.post("/contact", data);

    toast.success("Your message has been sent successfully");

    reset();
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
};

  return (
    <div>
      <HeroBanner
        label="Get In Touch"
        quote="We'd love to hear about your project."
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
      />

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 grid lg:grid-cols-[1fr_1.4fr] gap-16">

          {/* Contact Information */}

          <div>
            <span className="block text-xs uppercase tracking-[0.28em] text-clay mb-4">
              DesignFlow Studio
            </span>

            <h2 className="font-serif text-2xl text-charcoal mb-8">
              Reach out to us
            </h2>

            <div className="space-y-6 text-sm text-charcoal/80">

              <div className="flex gap-4">
                <MapPin
                  className="text-clay shrink-0"
                  size={18}
                />

                <p>
                  Building No. 1/65B, Pudukode Road,
                  <br />
                  Malappuram District, Kerala — 673633
                </p>
              </div>

              <div className="flex gap-4">
                <Mail
                  className="text-clay shrink-0"
                  size={18}
                />

                <p>
                  hello@designflow.studio
                </p>
              </div>

              <div className="flex gap-4">
                <Phone
                  className="text-clay shrink-0"
                  size={18}
                />

                <p>
                  +91 495 000 0000
                  <br />
                  +91 900 000 0000
                </p>
              </div>

            </div>
          </div>


          {/* Contact Form */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Name + Email */}

            <div className="grid sm:grid-cols-2 gap-5">

              <div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Name"
                  className="w-full border border-border bg-surface px-4 py-3 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:border-clay"
                />

                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-border bg-surface px-4 py-3 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:border-clay"
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

            </div>


            {/* Telephone + Subject */}

            <div className="grid sm:grid-cols-2 gap-5">

              <div>
                <input
                  {...register("telephone")}
                  type="tel"
                  placeholder="Telephone No."
                  className="w-full border border-border bg-surface px-4 py-3 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:border-clay"
                />
              </div>

              <div>
                <input
                  {...register("subject")}
                  type="text"
                  placeholder="Subject"
                  className="w-full border border-border bg-surface px-4 py-3 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:border-clay"
                />
              </div>

            </div>


            {/* Message */}

            <div>
              <textarea
                {...register("message")}
                placeholder="Message"
                rows={6}
                className="w-full border border-border bg-surface px-4 py-3 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:border-clay resize-none"
              />

              {errors.message && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-clay text-cream px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-charcoal transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>
      </section>
    </div>
  );
};

export default Contact;