import { WhatsAppIcon } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

/** Mobile and tablet only: WhatsApp always one tap away, bottom right. */
export default function WhatsAppFloat() {
  return (
    <a
      href={profile.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Me contacter sur WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[90] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-expo active:scale-95 lg:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
